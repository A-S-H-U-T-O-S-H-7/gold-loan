import { randomUUID } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import env from '../config/env.js';
import ApiError from '../utils/ApiError.js';

const storageRoot = path.resolve('uploads');
const firebaseAppName = 'gold-loan-kyc';
const documentFolders = Object.freeze({
  aadhaarFront: 'aadharfront',
  aadhaarBack: 'aadharback',
  panCard: 'pancard',
  photo: 'photo',
  addressProof: 'addressproof',
});
const previousDocumentFolders = Object.freeze({
  aadhaarFront: 'aadhaar-front',
  aadhaarBack: 'aadhaar-back',
  panCard: 'pan-card',
  photo: 'photo',
  addressProof: 'address-proof',
});

function documentFolder(documentType) {
  const folder = Object.hasOwn(documentFolders, documentType) ? documentFolders[documentType] : null;
  if (!folder) throw ApiError.badRequest('Unsupported KYC document type');
  return folder;
}

function firebaseBucket() {
  if (!env.kycStorage.bucket) {
    throw new ApiError(503, 'Firebase Storage bucket is not configured on the API server');
  }
  const app = getApps().find((item) => item.name === firebaseAppName)
    || initializeApp({
      credential: applicationDefault(),
      storageBucket: env.kycStorage.bucket,
    }, firebaseAppName);
  return getStorage(app).bucket();
}

function storageProvider() {
  if (!['local', 'firebase'].includes(env.kycStorage.provider)) {
    throw new ApiError(503, 'Invalid KYC storage provider configuration');
  }
  return env.kycStorage.provider;
}

function extensionFor(bytes) {
  if (bytes.subarray(0, 4).equals(Buffer.from([0x25, 0x50, 0x44, 0x46]))) return '.pdf';
  if (bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return '.png';
  if (bytes.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return '.jpg';
  throw ApiError.badRequest('Only PDF, PNG and JPEG files are allowed');
}

export async function saveKycFile(applicationId, documentType, bytes) {
  if (!Buffer.isBuffer(bytes) || bytes.length === 0 || bytes.length > 5 * 1024 * 1024) {
    throw ApiError.badRequest('Document must be 1 byte to 5 MB');
  }
  const extension = extensionFor(bytes);
  const folderName = documentFolder(documentType);
  const filename = `${randomUUID()}${extension}`;
  const key = `${folderName}/${applicationId}/${filename}`;
  if (storageProvider() === 'firebase') {
    const contentType = { '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg' }[extension];
    try {
      await firebaseBucket().file(key).save(bytes, {
        resumable: false,
        metadata: { contentType, cacheControl: 'private, max-age=0' },
      });
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(503, 'Could not upload KYC document to Firebase Storage');
    }
    return key;
  }
  const folder = path.join(storageRoot, folderName, String(applicationId));
  await mkdir(folder, { recursive: true });
  await writeFile(path.join(folder, filename), bytes, { flag: 'wx' });
  return key;
}

export async function validateKycFileKeys(applicationId, documents) {
  const provider = storageProvider();
  for (const document of documents) {
    const key = document.file_key;
    const folderName = documentFolder(document.document_type);
    const legacyFolder = previousDocumentFolders[document.document_type];
    const filenamePattern = '[0-9a-f-]{36}\\.(pdf|png|jpg)';
    const newKeyPattern = new RegExp(`^${folderName}/${applicationId}/${filenamePattern}$`);
    const oldKeyPattern = new RegExp(`^kyc/${applicationId}/(?:${legacyFolder}/)?${filenamePattern}$`);
    if (!newKeyPattern.test(key) && !oldKeyPattern.test(key)) {
      throw ApiError.badRequest('Invalid KYC document file_key');
    }
    if (provider === 'firebase') {
      let exists;
      try {
        [exists] = await firebaseBucket().file(key).exists();
      } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(503, 'Could not validate KYC document in Firebase Storage');
      }
      if (!exists) throw ApiError.badRequest('KYC document file does not exist');
    } else {
      try {
        await access(path.resolve(storageRoot, key));
      } catch {
        throw ApiError.badRequest('KYC document file does not exist');
      }
    }
  }
}

export async function readKycFile(applicationId, documentType, key) {
  await validateKycFileKeys(applicationId, [{ document_type: documentType, file_key: key }]);
  const extension = path.extname(key).toLowerCase();
  const contentType = { '.pdf': 'application/pdf', '.png': 'image/png', '.jpg': 'image/jpeg' }[extension];
  if (!contentType) throw ApiError.badRequest('Unsupported KYC document format');
  try {
    const bytes = storageProvider() === 'firebase'
      ? (await firebaseBucket().file(key).download())[0]
      : await readFile(path.resolve(storageRoot, key));
    return { bytes, contentType };
  } catch {
    throw new ApiError(503, 'Could not load KYC document');
  }
}
