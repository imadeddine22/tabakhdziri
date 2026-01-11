import express from 'express';
import {
    getAllPosts,
    getAllPostsAdmin,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    togglePostStatus
} from '../controllers/instagramController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getAllPosts);
router.get('/:id', getPostById);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllPostsAdmin);
router.post('/', protect, authorize('admin'), upload.single('image'), createPost);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updatePost);
router.patch('/:id/toggle', protect, authorize('admin'), togglePostStatus);
router.delete('/:id', protect, authorize('admin'), deletePost);

export default router;
