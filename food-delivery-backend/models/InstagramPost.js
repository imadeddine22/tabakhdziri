import mongoose from 'mongoose';

const instagramPostSchema = new mongoose.Schema({
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    postUrl: {
        type: String,
        required: [true, 'Instagram post URL is required'],
        validate: {
            validator: function (v) {
                return /^https?:\/\/(www\.)?instagram\.com\//.test(v);
            },
            message: 'Please provide a valid Instagram URL'
        }
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Index for sorting
instagramPostSchema.index({ order: 1 });

export default mongoose.model('InstagramPost', instagramPostSchema);
