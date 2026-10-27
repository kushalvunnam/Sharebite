import express from 'express';
import {
  createRequest,
  getMyRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
  pickupRequest,
  completeRequest,
} from '../controllers/requestController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { validateDonationRequest } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.post(
  '/',
  authenticate,
  requireRole('recipient', 'admin'),
  validateDonationRequest,
  createRequest
);
router.get('/my', authenticate, getMyRequests);
router.patch('/:id/accept', authenticate, requireRole('donor', 'admin'), acceptRequest);
router.patch('/:id/reject', authenticate, requireRole('donor', 'admin'), rejectRequest);
router.patch('/:id/cancel', authenticate, cancelRequest);
router.patch('/:id/pickup', authenticate, pickupRequest);
router.patch('/:id/complete', authenticate, requireRole('donor', 'admin'), completeRequest);

export default router;
