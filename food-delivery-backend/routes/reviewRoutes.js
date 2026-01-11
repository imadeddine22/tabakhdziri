
import express from 'express';
import {
    createReview,
    getApprovedReviews,
    getAllReviews,
    updateReviewStatus,
    deleteReview
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getApprovedReviews);

// Protected routes (User)
router.post('/', protect, createReview);

// Admin routes
router.get('/admin', protect, authorize('admin'), getAllReviews);
router.patch('/:id/status', protect, authorize('admin'), updateReviewStatus);
router.delete('/:id', protect, authorize('admin'), deleteReview);

export default router;
