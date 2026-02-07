import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../utils/emailService.js';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
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

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone
        });

        // Generate token
        const token = generateToken(user._id);

        // Send welcome email (non-blocking)
        sendWelcomeEmail(user.email, user.name).catch(err =>
            console.error('Email send error:', err)
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Register error:', error);

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
            message: 'Error registering user',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user (include password for comparison)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                },
                token
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user data',
            error: error.message
        });
    }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address'
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with this email address'
            });
        }

        // Generate reset token
        const resetToken = user.generateResetToken();
        await user.save({ validateBeforeSave: false });

        // Send email
        try {
            await sendPasswordResetEmail(user.email, user.name, resetToken);

            res.status(200).json({
                success: true,
                message: 'Password reset code sent to your email'
            });
        } catch (emailError) {
            // If email fails, clear the reset token
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                success: false,
                message: 'Error sending email. Please try again later.'
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing request',
            error: error.message
        });
    }
};

// @desc    Verify reset token
// @route   POST /api/auth/verify-reset-token
// @access  Public
export const verifyResetToken = async (req, res) => {
    try {
        const { email, token } = req.body;

        if (!email || !token) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and verification code'
            });
        }

        // Find user with valid token
        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        }).select('+resetPasswordToken +resetPasswordExpire');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Verification code is valid'
        });
    } catch (error) {
        console.error('Verify reset token error:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying code',
            error: error.message
        });
    }
};

// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        if (!email || !token || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email, verification code, and new password'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // Find user with valid token
        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() }
        }).select('+resetPasswordToken +resetPasswordExpire');

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code'
            });
        }

        // Set new password
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Generate new token
        const authToken = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                },
                token: authToken
            }
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Error resetting password',
            error: error.message
        });
    }
};
