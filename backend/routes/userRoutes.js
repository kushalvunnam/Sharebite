import express from 'express';
import { getMe, updateMe } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Both endpoints strictly require an active JWT session
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateMe);

export default router;
