import Application from '../models/Application.js';
import { prisma } from '../config/database.js';
import { randomUUID } from 'node:crypto';
import { isDeepStrictEqual } from 'node:util';
import ApiError from '../utils/ApiError.js';

class ApplicationRepository {
  async create(data) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const row = await prisma.$transaction(async (tx) => {
          if (await tx.application.findFirst({ where: { mobile: data.mobile }, select: { id: true } })) {
            throw ApiError.conflict('An application with this mobile number already exists');
          }
          if (data.email && await tx.application.findFirst({ where: { email: data.email }, select: { id: true } })) {
            throw ApiError.conflict('An application with this email address already exists');
          }
          const created = await tx.application.create({
            data: { ...data, applicationNo: `TMP-${randomUUID()}` },
          });
          return tx.application.update({
            where: { id: created.id },
            data: { applicationNo: String(created.id) },
            include: { kyc: { select: { isVerified: true } } },
          });
        }, { isolationLevel: 'Serializable' });
        return new Application(row);
      } catch (error) {
        if (error.code !== 'P2034' || attempt === 2) throw error;
      }
    }
  }

  async findByStatus({ status, page, perPage, search, searchBy, searchValue, dateFrom, dateTo, branchId, branchFilter }) {
    const searchableFields = { application_no: 'applicationNo', name: 'name', mobile: 'mobile', email: 'email' };
    const where = {
      status,
      ...(branchFilter === 'unassigned' ? { branchId: null } :
        branchFilter === 'own' ? { branchId: BigInt(branchId) } :
          { OR: [{ branchId: BigInt(branchId) }, { branchId: null }] }),
      ...(dateFrom || dateTo ? {
        createdAt: {
          ...(dateFrom ? { gte: dateFrom } : {}),
          ...(dateTo ? { lt: dateTo } : {}),
        },
      } : {}),
      ...(search ? {
        AND: [{ OR: [
          { name: { contains: search } },
          { mobile: { contains: search } },
          { email: { contains: search } },
          { applicationNo: { contains: search } },
          ...(/^\d{1,20}$/.test(search) && BigInt(search) <= 18446744073709551615n
            ? [{ id: BigInt(search) }]
            : []),
        ] }],
      } : {}),
      ...(searchBy && searchValue ? {
        [searchableFields[searchBy]]: { contains: searchValue },
      } : {}),
    };
    const [total, rows] = await prisma.$transaction([
      prisma.application.count({ where }),
      prisma.application.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          branch: { select: { name: true } },
          kyc: { select: { isVerified: true, details: true } },
          statusHistory: {
            ...(status === 'FOLLOW_UP' ? { where: { toStatus: 'FOLLOW_UP' } } : {}),
            orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], take: 1,
            select: { remark: true, createdAt: true },
          },
        },
      }),
    ]);
    return { total, applications: rows.map((row) => new Application(row)) };
  }

  async findAdmin(id, branchId) {
    return prisma.admin.findFirst({
      where: { id: BigInt(id), branchId: BigInt(branchId) },
      select: { id: true, branchId: true },
    });
  }

  async findBranchByName(name) {
    return prisma.branch.findFirst({ where: { name }, select: { id: true } });
  }

  async findBranchById(id) {
    return prisma.branch.findUnique({ where: { id: BigInt(id) }, select: { id: true } });
  }

  async changeStatus(id, toStatus, remark, adminId, branchId) {
    return prisma.$transaction(async (tx) => {
      const application = await tx.application.findUnique({
        where: { id: BigInt(id) },
        include: { kyc: { select: { isVerified: true } } },
      });
      if (!application) return { error: 'NOT_FOUND' };
      if (application.branchId !== null && application.branchId !== BigInt(branchId)) return { error: 'FORBIDDEN' };
      const fromStatus = application.status;
      const allowed = fromStatus === 'PENDING'
        ? ['FOLLOW_UP', 'REJECTED', 'GOLD_EVALUATION']
        : fromStatus === 'FOLLOW_UP' ? ['REJECTED', 'GOLD_EVALUATION'] : [];
      if (!allowed.includes(toStatus)) return { error: 'CONFLICT' };
      if (toStatus === 'GOLD_EVALUATION' && application.kyc?.isVerified !== 1) return { error: 'KYC_REQUIRED' };

      const changed = await tx.application.updateMany({
        where: {
          id: application.id,
          status: fromStatus,
          ...(toStatus === 'GOLD_EVALUATION' ? { kyc: { is: { isVerified: 1 } } } : {}),
        },
        data: { status: toStatus },
      });
      if (changed.count !== 1) return { error: 'CONFLICT' };
      await tx.applicationStatusHistory.create({
        data: {
          applicationId: application.id,
          fromStatus,
          toStatus,
          remark,
          changedByAdminId: BigInt(adminId),
        },
      });
      return { application: new Application({ ...application, status: toStatus }) };
    });
  }

  async getKyc(id, branchId) {
    const application = await prisma.application.findUnique({
      where: { id: BigInt(id) },
      select: {
        id: true, applicationNo: true, name: true, mobile: true, email: true, dob: true,
        state: true, city: true, pin: true, preferredBranch: true, status: true, branchId: true,
        kyc: { include: { documents: true } },
      },
    });
    if (!application) return { error: 'NOT_FOUND' };
    if (application.branchId !== null && application.branchId !== BigInt(branchId)) return { error: 'FORBIDDEN' };
    return { application };
  }

  async saveKyc(id, details, documents, branchId) {
    return prisma.$transaction(async (tx) => {
      const application = await tx.application.findUnique({ where: { id: BigInt(id) }, select: { branchId: true, status: true } });
      if (!application) return { error: 'NOT_FOUND' };
      if (application.branchId !== null && application.branchId !== BigInt(branchId)) return { error: 'FORBIDDEN' };
      const previous = await tx.applicationKyc.findUnique({ where: { applicationId: BigInt(id) }, include: { documents: true } });
      const oldDocuments = (previous?.documents || []).map(({ documentType, fileKey }) => [documentType, fileKey]).sort();
      const newDocuments = documents.map(({ document_type, file_key }) => [document_type, file_key]).sort();
      const changed = !isDeepStrictEqual(previous?.details ?? null, details)
        || !isDeepStrictEqual(oldDocuments, newDocuments);
      const kyc = await tx.applicationKyc.upsert({
        where: { applicationId: BigInt(id) },
        create: { applicationId: BigInt(id), details, isVerified: 0 },
        update: changed ? { details, isVerified: 0, verifiedAt: null, verifiedByAdminId: null } : { details },
      });
      if (changed) {
        await tx.kycDocument.deleteMany({ where: { kycId: kyc.id } });
        if (documents.length) {
          await tx.kycDocument.createMany({
            data: documents.map((document) => ({
              kycId: kyc.id,
              documentType: document.document_type,
              fileKey: document.file_key,
            })),
          });
        }
      }
      return { kyc: await tx.applicationKyc.findUnique({ where: { id: kyc.id }, include: { documents: true } }) };
    });
  }

  async verifyKyc(id, adminId, branchId, validateCompleteKyc) {
    return prisma.$transaction(async (tx) => {
      const application = await tx.application.findUnique({
        where: { id: BigInt(id) },
        include: { kyc: { include: { documents: true } } },
      });
      if (!application) return { error: 'NOT_FOUND' };
      if (application.branchId !== null && application.branchId !== BigInt(branchId)) return { error: 'FORBIDDEN' };
      if (!application.kyc?.details || application.kyc.documents.length === 0) return { error: 'INCOMPLETE' };
      validateCompleteKyc(application.kyc);
      await tx.kycDocument.updateMany({ where: { kycId: application.kyc.id }, data: { isVerified: 1 } });
      return { kyc: await tx.applicationKyc.update({
        where: { id: application.kyc.id },
        data: { isVerified: 1, verifiedByAdminId: BigInt(adminId), verifiedAt: new Date() },
        include: { documents: true },
      }) };
    });
  }
}

export default new ApplicationRepository();
