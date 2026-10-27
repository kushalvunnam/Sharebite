import express from 'express';
import {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
} from '../controllers/listingController.js';
import { authenticate, requireRole } from '../middleware/authMiddleware.js';
import { validateFoodListing } from '../middleware/validateMiddleware.js';

const router = express.Router();

router.get('/', getListings);
router.get('/:id', getListingById);
router.post(
  '/',
  authenticate,
  requireRole('donor', 'admin'),
  validateFoodListing,
  createListing
);
router.patch(
  '/:id',
  authenticate,
  requireRole('donor', 'admin'),
  updateListing
);
router.delete(
  '/:id',
  authenticate,
  requireRole('donor', 'admin'),
  deleteListing
);

export default router;
