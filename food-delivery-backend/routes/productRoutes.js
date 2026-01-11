import express from 'express';
import {
    getProducts,
    getFeaturedProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductReview
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProduct);

// Review route (must be before /:id routes to avoid conflicts)
router.post('/:id/reviews', protect, addProductReview);

// Admin routes
router.post('/', protect, authorize('admin'), (req, res, next) => {
    console.log('\n🔵 وصل طلب POST /products');
    console.log('Content-Type:', req.headers['content-type']);
    next();
}, upload.array('images', 5), createProduct); // 5 images: 1 main + 4 additional
router.put('/:id', protect, authorize('admin'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
