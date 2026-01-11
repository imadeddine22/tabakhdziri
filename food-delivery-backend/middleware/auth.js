import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
    let token;

    console.log('\n=== Auth Middleware ===');
    console.log('URL:', req.originalUrl);
    console.log('Method:', req.method);

    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
        console.log('❌ لا يوجد توكن');
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Please login to access this resource.'
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('✅ التوكن صحيح، معرف المستخدم:', decoded.id);

        // Get user from token (exclude password)
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            console.log('❌ المستخدم غير موجود');
            return res.status(401).json({
                success: false,
                message: 'User not found. Token invalid.'
            });
        }

        // Check if user is active
        if (!req.user.isActive) {
            console.log('❌ الحساب معطل');
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact support.'
            });
        }

        console.log('✅ تم العثور على المستخدم:', req.user.email, 'الدور:', req.user.role);
        next();
    } catch (error) {
        console.error('❌ خطأ في auth middleware:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Invalid or expired token.'
        });
    }
};

// Authorize roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        console.log('\n=== Authorize Middleware ===');
        console.log('الأدوار المطلوبة:', roles);
        console.log('دور المستخدم:', req.user?.role);

        if (!roles.includes(req.user.role)) {
            console.log('❌ المستخدم غير مصرح له');
            return res.status(403).json({
                success: false,
                message: `User role '${req.user.role}' is not authorized to access this route`
            });
        }

        console.log('✅ المستخدم مصرح له');
        next();
    };
};
