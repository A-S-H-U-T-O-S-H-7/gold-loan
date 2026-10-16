import applicationRepository from '../repositories/ApplicationRepository.js';
import ApiError from '../utils/ApiError.js';
import { readKycFile, saveKycFile, validateKycFileKeys } from './KycFileService.js';

const requiredDocumentTypes = ['aadhaarFront', 'aadhaarBack', 'panCard', 'photo', 'addressProof'];
function present(value) { return typeof value === 'string' && value.trim().length > 0; }
function validateDraftDetails(details) {
  const patterns = [
    [details.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'email'],
    [details.mobile, /^[6-9]\d{9}$/, 'mobile'],
    [details.alternativePhone, /^[6-9]\d{9}$/, 'alternative phone'],
    [details.currentAddress?.pinCode, /^\d{6}$/, 'current PIN code'],
    [details.permanentAddress?.pinCode, /^\d{6}$/, 'permanent PIN code'],
    [details.bankDetails?.ifscCode, /^[A-Z]{4}0[A-Z0-9]{6}$/, 'IFSC code'],
    [details.nominee?.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'nominee email'],
    [details.nominee?.mobile, /^[6-9]\d{9}$/, 'nominee mobile'],
    [details.guarantor?.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'guarantor email'],
    [details.guarantor?.mobile, /^[6-9]\d{9}$/, 'guarantor mobile'],
  ];
  for (const [value, pattern, label] of patterns) {
    if (value !== undefined && value !== null && value !== '' && !pattern.test(value)) {
      throw ApiError.badRequest(`Invalid ${label}`);
    }
  }
  const dob = details.dob;
  if (dob && Object.values(dob).some(Boolean)) {
    const { day, month, year } = dob;
    if (day && (!/^\d{1,2}$/.test(String(day)) || Number(day) < 1 || Number(day) > 31)) throw ApiError.badRequest('Invalid birth day');
    if (month && (!/^\d{1,2}$/.test(String(month)) || Number(month) < 1 || Number(month) > 12)) throw ApiError.badRequest('Invalid birth month');
    if (year && (!/^\d{4}$/.test(String(year)) || Number(year) > new Date().getFullYear())) throw ApiError.badRequest('Invalid birth year');
    if (day && month && year) {
      const parsed = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
      if (parsed.getUTCFullYear() !== Number(year) || parsed.getUTCMonth() + 1 !== Number(month) || parsed.getUTCDate() !== Number(day) || parsed > new Date()) {
        throw ApiError.badRequest('Invalid date of birth');
      }
    }
  }
}

function validateCompleteKyc(kyc) {
  const details = kyc.details;
  const required = {
    name: details.name, email: details.email, mobile: details.mobile, gender: details.gender,
    birthDay: details.dob?.day, birthMonth: details.dob?.month, birthYear: details.dob?.year,
    currentHouseNo: details.currentAddress?.houseNo, currentAddress: details.currentAddress?.address,
    currentState: details.currentAddress?.state, currentCity: details.currentAddress?.city,
    currentPinCode: details.currentAddress?.pinCode, currentAddressType: details.currentAddress?.type,
    permanentHouseNo: details.permanentAddress?.houseNo, permanentAddress: details.permanentAddress?.address,
    permanentState: details.permanentAddress?.state, permanentCity: details.permanentAddress?.city,
    permanentPinCode: details.permanentAddress?.pinCode, permanentAddressType: details.permanentAddress?.type,
    bankName: details.bankDetails?.bankName, branchName: details.bankDetails?.branchName,
    accountHolderName: details.bankDetails?.accountHolderName, accountType: details.bankDetails?.accountType,
    accountNumber: details.bankDetails?.accountNumber, ifscCode: details.bankDetails?.ifscCode,
  };
  const missing = Object.entries(required).filter(([, value]) => !present(String(value ?? ''))).map(([field]) => field);
  if (missing.length) throw ApiError.badRequest(`Complete required KYC fields: ${missing.join(', ')}`);
  validateDraftDetails(details);
  const documentTypes = new Set(kyc.documents.map((document) => document.documentType));
  const missingDocuments = requiredDocumentTypes.filter((type) => !documentTypes.has(type));
  if (missingDocuments.length) throw ApiError.badRequest(`Upload required documents: ${missingDocuments.join(', ')}`);
}

const optionalLengths = {
  preferredBranch: 100,
  state: 100,
  city: 100,
  purpose: 255,
  remark: 1000,
};

function optionalText(value, field, maxLength) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') throw ApiError.badRequest(`${field} must be text`);
  const trimmed = value.trim();
  if (trimmed.length > maxLength) throw ApiError.badRequest(`${field} is too long`);
  return trimmed || null;
}

function parseDate(value, field) {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw ApiError.badRequest(`${field} must be YYYY-MM-DD`);
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw ApiError.badRequest(`${field} is not a valid date`);
  }
  return date;
}

function positiveInteger(value, field, fallback, max) {
  if (value === undefined || value === '') return fallback;
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 1 || number > max) {
    throw ApiError.badRequest(`${field} must be an integer between 1 and ${max}`);
  }
  return number;
}

class ApplicationService {
  parseId(id) {
    if (!/^\d+$/.test(String(id)) || BigInt(id) < 1n || BigInt(id) > 18446744073709551615n) {
      throw ApiError.badRequest('Invalid application id');
    }
    return id;
  }

  serializeKyc(kyc) {
    if (!kyc) return null;
    return {
      id: Number(kyc.id),
      applicationId: Number(kyc.applicationId),
      details: kyc.details,
      isVerified: kyc.isVerified,
      verifiedByAdminId: kyc.verifiedByAdminId == null ? null : Number(kyc.verifiedByAdminId),
      verifiedAt: kyc.verifiedAt,
      documents: kyc.documents.map((document) => ({
        id: Number(document.id),
        documentType: document.documentType,
        fileKey: document.fileKey,
        isVerified: document.isVerified,
        verificationNote: document.verificationNote,
      })),
    };
  }

  async createApplication(input, context) {
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
      throw ApiError.badRequest('A JSON object is required');
    }
    if (typeof input.name !== 'string' || input.name.trim().length < 2 || input.name.trim().length > 100) {
      throw ApiError.badRequest('name must contain 2 to 100 characters');
    }
    if (typeof input.mobile !== 'string' || !/^[6-9]\d{9}$/.test(input.mobile)) {
      throw ApiError.badRequest('mobile must be a valid 10-digit Indian mobile number');
    }

    const email = optionalText(input.email, 'email', 255)?.toLowerCase() ?? null;
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw ApiError.badRequest('email must be valid');
    }
    const dob = parseDate(input.dob, 'dob');
    if (dob && dob > new Date()) throw ApiError.badRequest('dob cannot be in the future');
    const pin = optionalText(input.pin, 'pin', 6);
    if (pin && !/^\d{6}$/.test(pin)) throw ApiError.badRequest('pin must contain 6 digits');
    let requestedAmount = null;
    if (input.requested_amount !== undefined && input.requested_amount !== null && input.requested_amount !== '') {
      const amount = Number(input.requested_amount);
      if (!Number.isFinite(amount) || amount <= 0 || amount > 999999999999.99 || !/^\d+(\.\d{1,2})?$/.test(String(input.requested_amount))) {
        throw ApiError.badRequest('requested_amount must be a positive amount with at most two decimal places');
      }
      requestedAmount = amount;
    }

    let createdByAdminId = null;
    let branchId = null;
    if (context.source === 'CRM') {
      const adminId = Number(context.admin?.sub);
      const sessionBranchId = Number(context.admin?.branchId);
      if (!Number.isSafeInteger(adminId) || adminId < 1 || !Number.isSafeInteger(sessionBranchId) || sessionBranchId < 1) {
        throw ApiError.unauthorized('Invalid admin token');
      }
      const admin = await applicationRepository.findAdmin(adminId, sessionBranchId);
      if (!admin) throw ApiError.unauthorized('Admin account is no longer available');
      createdByAdminId = admin.id;
      branchId = admin.branchId;
      if (input.branch_id !== undefined && String(input.branch_id) !== String(branchId)) {
        throw ApiError.forbidden('Applications can only be created for your branch');
      }
    } else if (input.branch_id !== undefined && input.branch_id !== null && input.branch_id !== '') {
      const branchIdInput = this.parseId(input.branch_id);
      const branch = await applicationRepository.findBranchById(branchIdInput);
      if (!branch) throw ApiError.badRequest('Selected branch does not exist');
      branchId = branch.id;
    } else {
      const requestedBranch = optionalText(input.branch ?? input.preferred_branch, 'branch', optionalLengths.preferredBranch);
      if (requestedBranch) {
        const branch = await applicationRepository.findBranchByName(requestedBranch);
        if (!branch) throw ApiError.badRequest('Selected branch does not exist');
        branchId = branch.id;
      }
    }

    return applicationRepository.create({
      name: input.name.trim(),
      mobile: input.mobile,
      email,
      dob,
      preferredBranch: null,
      state: optionalText(input.state, 'state', optionalLengths.state),
      city: optionalText(input.city, 'city', optionalLengths.city),
      pin,
      purpose: optionalText(input.purpose, 'purpose', optionalLengths.purpose),
      requestedAmount,
      status: 'PENDING',
      source: context.source,
      createdByAdminId,
      branchId,
    });
  }

  async listApplications(query, adminToken) {
    const status = query.status || 'PENDING';
    if (!['PENDING', 'FOLLOW_UP', 'REJECTED', 'GOLD_EVALUATION'].includes(status)) {
      throw ApiError.badRequest('Invalid application status');
    }
    const page = positiveInteger(query.page, 'page', 1, 1000000);
    const perPage = positiveInteger(query.per_page, 'per_page', 10, 100);
    const search = optionalText(query.search, 'search', 100);
    const searchBy = optionalText(query.search_by, 'search_by', 30);
    const searchValue = optionalText(query.search_value, 'search_value', 100);
    if (searchBy && !['application_no', 'name', 'mobile', 'email'].includes(searchBy)) {
      throw ApiError.badRequest('Invalid search_by field');
    }
    if ((searchBy && !searchValue) || (!searchBy && searchValue)) {
      throw ApiError.badRequest('search_by and search_value must be provided together');
    }
    const admin = await this.getAdmin(adminToken);
    if (query.branch_id !== undefined && query.branch_id !== 'unassigned' && String(query.branch_id) !== String(admin.branchId)) {
      throw ApiError.forbidden('You can only list applications for your branch');
    }
    const dateFrom = parseDate(query.date_from, 'date_from');
    const dateToDate = parseDate(query.date_to, 'date_to');
    if (dateFrom && dateToDate && dateFrom > dateToDate) {
      throw ApiError.badRequest('date_from cannot be after date_to');
    }
    const dateTo = dateToDate ? new Date(dateToDate.getTime() + 86400000) : null;
    const branchFilter = query.branch_id === 'unassigned' ? 'unassigned' : query.branch_id ? 'own' : 'all';
    const result = await applicationRepository.findByStatus({ status, page, perPage, search, searchBy, searchValue, dateFrom, dateTo, branchId: admin.branchId, branchFilter });
    return {
      data: result.applications,
      pagination: {
        total: result.total,
        current_page: page,
        per_page: perPage,
        total_pages: Math.ceil(result.total / perPage),
      },
    };
  }

  async getAdmin(token) {
    const id = Number(token?.sub);
    const branchId = Number(token?.branchId);
    if (!Number.isSafeInteger(id) || id < 1 || !Number.isSafeInteger(branchId) || branchId < 1) {
      throw ApiError.unauthorized('Invalid admin token');
    }
    const admin = await applicationRepository.findAdmin(id, branchId);
    if (!admin) throw ApiError.unauthorized('Admin account is no longer available');
    return admin;
  }

  async changeStatus(id, input, token) {
    this.parseId(id);
    const status = input?.status === 'EVALUATING' ? 'GOLD_EVALUATION' : input?.status;
    if (!['FOLLOW_UP', 'REJECTED', 'GOLD_EVALUATION'].includes(status)) {
      throw ApiError.badRequest('status must be FOLLOW_UP, REJECTED, EVALUATING or GOLD_EVALUATION');
    }
    const remark = optionalText(input?.remark, 'remark', optionalLengths.remark);
    if (status !== 'GOLD_EVALUATION' && !remark) throw ApiError.badRequest('A reason is required');
    const admin = await this.getAdmin(token);
    const result = await applicationRepository.changeStatus(id, status, remark, admin.id, admin.branchId);
    if (result.error === 'NOT_FOUND') throw ApiError.notFound('Application not found');
    if (result.error === 'FORBIDDEN') throw ApiError.forbidden('Application belongs to another branch');
    if (result.error === 'CONFLICT') throw ApiError.conflict('Application status changed or this move is not allowed. Refresh the queue.');
    if (result.error === 'KYC_REQUIRED') throw ApiError.conflict('Complete KYC verification first.');
    return result.application;
  }

  async getKyc(id, token) {
    this.parseId(id);
    const admin = await this.getAdmin(token);
    const result = await applicationRepository.getKyc(id, admin.branchId);
    if (result.error === 'NOT_FOUND') throw ApiError.notFound('Application not found');
    if (result.error === 'FORBIDDEN') throw ApiError.forbidden('Application belongs to another branch');
    const application = result.application;
    return {
      id: Number(application.id),
      applicationNo: application.applicationNo,
      name: application.name,
      mobile: application.mobile,
      email: application.email,
      dob: application.dob ? application.dob.toISOString().slice(0, 10) : null,
      state: application.state,
      city: application.city,
      pin: application.pin,
      status: application.status,
      kyc: this.serializeKyc(application.kyc),
    };
  }

  async saveKyc(id, input, token) {
    this.parseId(id);
    if (!input || typeof input !== 'object' || Array.isArray(input) || !input.details || typeof input.details !== 'object' || Array.isArray(input.details)) {
      throw ApiError.badRequest('details must be an object');
    }
    validateDraftDetails(input.details);
    const documents = input.documents ?? [];
    if (!Array.isArray(documents) || documents.length > 20 || documents.some((document) =>
      !document || typeof document.document_type !== 'string' || !document.document_type.trim() || document.document_type.length > 50 ||
      typeof document.file_key !== 'string' || !document.file_key.trim() || document.file_key.length > 500)) {
      throw ApiError.badRequest('documents must contain document_type and file_key');
    }
    await validateKycFileKeys(id, documents);
    const admin = await this.getAdmin(token);
    const result = await applicationRepository.saveKyc(id, input.details, documents, admin.branchId);
    if (result.error === 'NOT_FOUND') throw ApiError.notFound('Application not found');
    if (result.error === 'FORBIDDEN') throw ApiError.forbidden('Application belongs to another branch');
    return this.serializeKyc(result.kyc);
  }

  async verifyKyc(id, token) {
    this.parseId(id);
    const admin = await this.getAdmin(token);
    const result = await applicationRepository.verifyKyc(id, admin.id, admin.branchId, validateCompleteKyc);
    if (result.error === 'NOT_FOUND') throw ApiError.notFound('Application not found');
    if (result.error === 'FORBIDDEN') throw ApiError.forbidden('Application belongs to another branch');
    if (result.error === 'INCOMPLETE') throw ApiError.badRequest('Save KYC details and documents before verification');
    return this.serializeKyc(result.kyc);
  }

  async uploadKycDocument(id, documentType, bytes, token) {
    this.parseId(id);
    const admin = await this.getAdmin(token);
    const record = await applicationRepository.getKyc(id, admin.branchId);
    if (record.error === 'NOT_FOUND') throw ApiError.notFound('Application not found');
    if (record.error === 'FORBIDDEN') throw ApiError.forbidden('Application belongs to another branch');
    return { file_key: await saveKycFile(id, documentType, bytes) };
  }

  async viewKycDocument(id, documentType, token) {
    this.parseId(id);
    const admin = await this.getAdmin(token);
    const record = await applicationRepository.getKyc(id, admin.branchId);
    if (record.error === 'NOT_FOUND') throw ApiError.notFound('Application not found');
    if (record.error === 'FORBIDDEN') throw ApiError.forbidden('Application belongs to another branch');
    const document = record.application.kyc?.documents.find((item) => item.documentType === documentType);
    if (!document) throw ApiError.notFound('KYC document not found');
    return readKycFile(id, documentType, document.fileKey);
  }
}

export default new ApplicationService();
