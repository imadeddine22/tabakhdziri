import express from 'express';
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
    updateOrderStatus
} from '../controllers/orderController.js';
import { generateInvoice } from '../controllers/invoiceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

// User routes
router.route('/')
    .get(getMyOrders)           // Get my orders
    .post(createOrder);         // Create new order

router.route('/:id')
    .get(getOrderById)          // Get single order
    .put(updateOrder)           // Update order
    .delete(deleteOrder);       // Delete order

// Admin only routes
router.get('/all/orders', authorize('admin'), getAllOrders);
router.patch('/:id/status', authorize('admin'), updateOrderStatus);

// Invoice generation (user or admin)
router.get('/:id/invoice', generateInvoice);

export default router;
