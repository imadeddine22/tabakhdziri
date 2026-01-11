import express from 'express';
import {
    getUserProfile,
    updateUserProfile,
    getAllUsers
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All user routes require authentication
router.use(protect);

// User profile routes
router.route('/profile')
    .get(getUserProfile)
    .put(updateUserProfile);

// Admin only route
router.get('/', authorize('admin'), getAllUsers);

export default router;
