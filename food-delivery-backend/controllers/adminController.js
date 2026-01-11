import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments({ role: 'user' });
        const totalProducts = await Product.countDocuments();

        // Calculate total revenue
        const orders = await Order.find({ status: { $ne: 'cancelled' } });
        const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

        // Get recent orders
        const recentOrders = await Order.find()
            .populate('customer', 'name email')
            .sort({ createdAt: -1 })
            .limit(5);

        res.status(200).json({
            success: true,
            data: {
                stats: {
                    totalOrders,
                    totalUsers,
                    totalProducts,
                    totalRevenue
                },
                recentOrders
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard stats',
            error: error.message
        });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// @desc    Update user (block/unblock)
// @route   PATCH /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // We can block/unblock or change role
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating user',
            error: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User removed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

// ==================== ADMIN MANAGEMENT ====================

// @desc    Get all admins
// @route   GET /api/admin/admins
// @access  Private/Admin
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' })
            .select('-password')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: admins.length,
            data: admins
        });
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching admins',
            error: error.message
        });
    }
};

// @desc    Create new admin
// @route   POST /api/admin/admins
// @access  Private/Admin (Super Admin only)
export const createAdmin = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create admin user
        const admin = await User.create({
            name,
            email,
            password,
            phone,
            role: 'admin'
        });

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                role: admin.role,
                createdAt: admin.createdAt
            }
        });
    } catch (error) {
        console.error('Error creating admin:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error creating admin',
            error: error.message
        });
    }
};

// @desc    Update admin
// @route   PUT /api/admin/admins/:id
// @access  Private/Admin
export const updateAdmin = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        const admin = await User.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        if (admin.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'This user is not an admin'
            });
        }

        // Prevent admin from removing their own admin role
        if (admin._id.toString() === req.user.id && req.body.role && req.body.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'You cannot remove your own admin role'
            });
        }

        // Update fields
        if (name) admin.name = name;
        if (email) admin.email = email;
        if (phone) admin.phone = phone;
        if (password) admin.password = password;

        await admin.save();

        res.status(200).json({
            success: true,
            message: 'Admin updated successfully',
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                phone: admin.phone,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating admin',
            error: error.message
        });
    }
};

// @desc    Delete admin
// @route   DELETE /api/admin/admins/:id
// @access  Private/Admin
export const deleteAdmin = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        if (admin.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'This user is not an admin'
            });
        }

        // Prevent admin from deleting themselves
        if (admin._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot delete your own admin account'
            });
        }

        // Check if this is the last admin
        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount <= 1) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete the last admin. At least one admin must exist.'
            });
        }

        await admin.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Admin deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting admin',
            error: error.message
        });
    }
};

// @desc    Toggle admin status (activate/deactivate)
// @route   PATCH /api/admin/admins/:id/toggle
// @access  Private/Admin
export const toggleAdminStatus = async (req, res) => {
    try {
        const admin = await User.findById(req.params.id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: 'Admin not found'
            });
        }

        if (admin.role !== 'admin') {
            return res.status(400).json({
                success: false,
                message: 'This user is not an admin'
            });
        }

        // Prevent admin from deactivating themselves
        if (admin._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot deactivate your own account'
            });
        }

        // Toggle isActive field (you may need to add this field to User model)
        admin.isActive = !admin.isActive;
        await admin.save();

        res.status(200).json({
            success: true,
            message: `Admin ${admin.isActive ? 'activated' : 'deactivated'} successfully`,
            data: admin
        });
    } catch (error) {
        console.error('Error toggling admin status:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling admin status',
            error: error.message
        });
    }
};
