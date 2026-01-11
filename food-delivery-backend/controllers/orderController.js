import Order from '../models/Order.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (requires authentication)
export const createOrder = async (req, res) => {
    try {
        console.log('\n========== 📦 إنشاء طلب جديد ==========');
        console.log('⏰ الوقت:', new Date().toLocaleString());
        console.log('👤 المستخدم:', req.user?.email, '| ID:', req.user?.id);
        console.log('📋 بيانات الطلب:', JSON.stringify(req.body, null, 2));

        const { customerInfo, items, eventDetails, totalAmount, notes } = req.body;

        // Validation
        if (!customerInfo || !items || !eventDetails || !totalAmount) {
            console.log('❌ فشل التحقق: حقول مفقودة');
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        if (!items || items.length === 0) {
            console.log('❌ فشل التحقق: لا توجد عناصر في الطلب');
            return res.status(400).json({
                success: false,
                message: 'Order must contain at least one item'
            });
        }

        console.log('✅ التحقق نجح، جاري إنشاء الطلب...');

        // Create order
        const orderData = {
            customer: req.user.id,
            customerInfo,
            items,
            eventDetails,
            totalAmount,
            notes,
            status: 'pending'
        };

        console.log('📝 بيانات الطلب للحفظ:', JSON.stringify(orderData, null, 2));

        const order = await Order.create(orderData);

        console.log('✅ تم إنشاء الطلب بنجاح! ID:', order._id);

        // Populate customer info
        await order.populate('customer', 'name email');

        console.log('✅ تم ربط بيانات العميل');

        // Send order confirmation email (non-blocking)
        sendOrderConfirmationEmail(
            req.user.email,
            req.user.name,
            order
        ).catch(err => console.error('❌ خطأ في إرسال البريد:', err));

        console.log('✅ إرسال الاستجابة للعميل...');
        console.log('========================================\n');

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (error) {
        console.error('\n❌ خطأ في إنشاء الطلب:');
        console.error('  الرسالة:', error.message);
        console.error('  التفاصيل:', error);
        console.error('  Stack:', error.stack);
        console.error('========================================\n');

        res.status(500).json({
            success: false,
            message: 'Error creating order',
            error: error.message
        });
    }
};

// @desc    Get all orders for current user
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ customer: req.user.id })
            .sort({ createdAt: -1 })
            .populate('customer', 'name email');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// @desc    Get all orders (admin only)
// @route   GET /api/orders/all
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('customer', 'name email phone');

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer', 'name email phone');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user owns the order or is admin
        if (order.customer._id.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this order'
            });
        }

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error.message
        });
    }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
export const updateOrder = async (req, res) => {
    try {
        let order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user owns the order or is admin
        if (order.customer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this order'
            });
        }

        // Update order
        order = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate('customer', 'name email');

        res.status(200).json({
            success: true,
            message: 'Order updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order',
            error: error.message
        });
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
export const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Make sure user owns the order or is admin
        if (order.customer.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this order'
            });
        }

        await order.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully',
            data: {}
        });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting order',
            error: error.message
        });
    }
};

// @desc    Update order status (admin only)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                success: false,
                message: 'Please provide status'
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            {
                new: true,
                runValidators: true
            }
        ).populate('customer', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};
