
import Review from '../models/Review.js';

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private (Registered users)
export const createReview = async (req, res) => {
    try {
        const { rating, comment, name } = req.body;

        const review = await Review.create({
            user: req.user._id,
            name: name || req.user.name,
            rating,
            comment,
            status: 'pending' // Always pending until admin approves
        });

        res.status(201).json({
            success: true,
            data: review,
            message: 'تم إرسال تعليقك للمراجعة من قبل الإدارة'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get all approved reviews
// @route   GET /api/reviews
// @access  Public
export const getApprovedReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'approved' })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Update review status
// @route   PATCH /api/reviews/:id/status
// @access  Private/Admin
export const updateReviewStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        await review.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Review removed'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
