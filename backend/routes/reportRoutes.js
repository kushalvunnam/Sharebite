import express from 'express';
import {
  createReport,
  getReports,
  updateReportStatus,
} from '../controllers/reportController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, createReport);
router.get('/', authenticate, requireRole('admin'), getReports);
router.patch('/:id', authenticate, requireRole('admin'), updateReportStatus);

export default router;
