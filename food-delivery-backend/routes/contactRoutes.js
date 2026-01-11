import express from 'express';
import {
    createContactMessage,
    getAllContactMessages,
    getContactMessageById,
    updateContactStatus,
    deleteContactMessage
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public route - anyone can send a contact message
router.post('/', createContactMessage);

// Admin only routes
router.get('/', protect, authorize('admin'), getAllContactMessages);
router.get('/:id', protect, authorize('admin'), getContactMessageById);
router.patch('/:id/status', protect, authorize('admin'), updateContactStatus);
router.delete('/:id', protect, authorize('admin'), deleteContactMessage);

export default router;
