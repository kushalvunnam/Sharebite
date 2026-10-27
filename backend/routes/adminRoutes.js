import express from 'express';
import {
  getAdminStats,
  getAdminUsers,
  verifyUser,
  moderateListing,
  getAuditLogs,
} from '../controllers/adminController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Strict security: all admin routes require authenticated session with admin role
router.use(authenticate, requireRole('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.patch('/users/:id/verify', verifyUser);
router.patch('/listings/:id/moderate', moderateListing);
router.get('/audit-logs', getAuditLogs);

export default router;
