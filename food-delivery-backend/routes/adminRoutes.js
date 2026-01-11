import express from 'express';
import {
    getDashboardStats,
    getAllUsers,
    updateUser,
    deleteUser,
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    toggleAdminStatus
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Apply admin protection to all routes
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.patch('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Admin management routes
router.get('/admins', getAllAdmins);
router.post('/admins', createAdmin);
router.put('/admins/:id', updateAdmin);
router.delete('/admins/:id', deleteAdmin);
router.patch('/admins/:id/toggle', toggleAdminStatus);

export default router;
