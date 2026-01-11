import InstagramPost from '../models/InstagramPost.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all Instagram posts
// @route   GET /api/instagram
// @access  Public
export const getAllPosts = async (req, res) => {
    try {
        const posts = await InstagramPost.find({ isActive: true })
            .sort({ order: 1, createdAt: -1 });

        res.json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching Instagram posts',
            error: error.message
        });
    }
};

// @desc    Get all Instagram posts (Admin - includes inactive)
// @route   GET /api/instagram/admin
// @access  Private/Admin
export const getAllPostsAdmin = async (req, res) => {
    try {
        const posts = await InstagramPost.find()
            .sort({ order: 1, createdAt: -1 });

        res.json({
            success: true,
            count: posts.length,
            data: posts
        });
    } catch (error) {
        console.error('Error fetching Instagram posts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching Instagram posts',
            error: error.message
        });
    }
};

// @desc    Get single Instagram post
// @route   GET /api/instagram/:id
// @access  Public
export const getPostById = async (req, res) => {
    try {
        const post = await InstagramPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Instagram post not found'
            });
        }

        res.json({
            success: true,
            data: post
        });
    } catch (error) {
        console.error('Error fetching Instagram post:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching Instagram post',
            error: error.message
        });
    }
};

// @desc    Create Instagram post
// @route   POST /api/instagram
// @access  Private/Admin
export const createPost = async (req, res) => {
    try {
        const { postUrl, order, isActive } = req.body;

        // Check if image was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload an image'
            });
        }

        // Create post
        const post = await InstagramPost.create({
            image: `/uploads/${req.file.filename}`,
            postUrl,
            order: order || 0,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({
            success: true,
            message: 'Instagram post created successfully',
            data: post
        });
    } catch (error) {
        console.error('Error creating Instagram post:', error);

        // Delete uploaded file if post creation failed
        if (req.file) {
            const filePath = path.join(__dirname, '../public/uploads', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Error creating Instagram post',
            error: error.message
        });
    }
};

// @desc    Update Instagram post
// @route   PUT /api/instagram/:id
// @access  Private/Admin
export const updatePost = async (req, res) => {
    try {
        const { postUrl, order, isActive } = req.body;

        let post = await InstagramPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Instagram post not found'
            });
        }

        // Update fields
        const updateData = {
            postUrl: postUrl || post.postUrl,
            order: order !== undefined ? order : post.order,
            isActive: isActive !== undefined ? isActive : post.isActive
        };

        // If new image is uploaded, delete old one and update
        if (req.file) {
            // Delete old image
            if (post.image) {
                const oldImagePath = path.join(__dirname, '../public', post.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            updateData.image = `/uploads/${req.file.filename}`;
        }

        post = await InstagramPost.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Instagram post updated successfully',
            data: post
        });
    } catch (error) {
        console.error('Error updating Instagram post:', error);

        // Delete uploaded file if update failed
        if (req.file) {
            const filePath = path.join(__dirname, '../public/uploads', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.status(500).json({
            success: false,
            message: 'Error updating Instagram post',
            error: error.message
        });
    }
};

// @desc    Delete Instagram post
// @route   DELETE /api/instagram/:id
// @access  Private/Admin
export const deletePost = async (req, res) => {
    try {
        const post = await InstagramPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Instagram post not found'
            });
        }

        // Delete image file
        if (post.image) {
            const imagePath = path.join(__dirname, '../public', post.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await InstagramPost.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: 'Instagram post deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting Instagram post:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting Instagram post',
            error: error.message
        });
    }
};

// @desc    Toggle Instagram post active status
// @route   PATCH /api/instagram/:id/toggle
// @access  Private/Admin
export const togglePostStatus = async (req, res) => {
    try {
        const post = await InstagramPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: 'Instagram post not found'
            });
        }

        post.isActive = !post.isActive;
        await post.save();

        res.json({
            success: true,
            message: `Instagram post ${post.isActive ? 'activated' : 'deactivated'} successfully`,
            data: post
        });
    } catch (error) {
        console.error('Error toggling Instagram post status:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling Instagram post status',
            error: error.message
        });
    }
};
