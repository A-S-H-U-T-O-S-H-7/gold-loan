import applicationService from '../services/ApplicationService.js';
import asyncHandler from '../utils/asyncHandler.js';

class ApplicationController {
  createPublic = asyncHandler(async (req, res) => {
    const application = await applicationService.createApplication(req.body, { source: 'WEB' });
    res.status(201).json({ success: true, data: application });
  });

  createCrm = asyncHandler(async (req, res) => {
    const application = await applicationService.createApplication(req.body, { source: 'CRM', admin: req.user });
    res.status(201).json({ success: true, data: application });
  });

  listCrm = asyncHandler(async (req, res) => {
    const result = await applicationService.listApplications(req.query, req.user);
    res.status(200).json({ success: true, ...result });
  });

  changeStatus = asyncHandler(async (req, res) => {
    const application = await applicationService.changeStatus(req.params.id, req.body, req.user);
    res.status(200).json({ success: true, data: application });
  });

  getKyc = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, data: await applicationService.getKyc(req.params.id, req.user) });
  });

  saveKyc = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, data: await applicationService.saveKyc(req.params.id, req.body, req.user) });
  });

  verifyKyc = asyncHandler(async (req, res) => {
    res.status(200).json({ success: true, data: await applicationService.verifyKyc(req.params.id, req.user) });
  });

  uploadKycDocument = asyncHandler(async (req, res) => {
    res.status(201).json({ success: true, data: await applicationService.uploadKycDocument(req.params.id, req.query.document_type, req.body, req.user) });
  });

  viewKycDocument = asyncHandler(async (req, res) => {
    const file = await applicationService.viewKycDocument(req.params.id, req.params.documentType, req.user);
    res.set({ 'Content-Type': file.contentType, 'Content-Disposition': 'inline', 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' });
    res.status(200).send(file.bytes);
  });
}

export default new ApplicationController();
