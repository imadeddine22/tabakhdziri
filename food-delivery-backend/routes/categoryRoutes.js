import express from 'express';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin routes
router.post('/', protect, authorize('admin'), upload.single('image'), createCategory);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
