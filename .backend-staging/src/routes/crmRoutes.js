import { Router, raw } from 'express';
import adminLoginController from '../controllers/AdminLoginController.js';
import branchController from '../controllers/BranchController.js';
import applicationController from '../controllers/ApplicationController.js';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';
import { requireFields } from '../middlewares/validateMiddleware.js';
import ApiError from '../utils/ApiError.js';
import env from '../config/env.js';

const router = Router();

function requireTrustedOrigin(req, res, next) {
  const origin = req.headers.origin;
  if (origin && !env.corsOrigins.includes(origin)) return next(ApiError.forbidden('Origin is not allowed'));
  return next();
}

router.post(
  '/login',
  requireTrustedOrigin,
  requireFields(['branch_id', 'username', 'password']),
  adminLoginController.login
);

router.post('/refresh', requireTrustedOrigin, adminLoginController.refresh);
router.post('/logout', requireTrustedOrigin, adminLoginController.logout);

router.use(authenticateAdmin);
router.post('/applications', applicationController.createCrm);
router.get('/applications', applicationController.listCrm);
router.patch('/applications/status/:id', applicationController.changeStatus);
router.get('/applications/kyc/:id', applicationController.getKyc);
router.put('/applications/kyc/:id', applicationController.saveKyc);
router.post('/applications/kyc/verify/:id', applicationController.verifyKyc);
router.post('/applications/kyc/documents/:id', raw({ type: 'application/octet-stream', limit: '5mb' }), applicationController.uploadKycDocument);
router.get('/applications/kyc/document/:documentType/:id', applicationController.viewKycDocument);
router.get('/branches', branchController.getAll);
router.get('/branches/:id', branchController.getById);
router.post('/branches', requireFields(['name']), branchController.create);
router.put('/branches/:id', requireFields(['name']), branchController.update);
router.delete('/branches/:id', branchController.remove);

export default router;
