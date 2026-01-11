import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a product name'],
        trim: true,
        maxlength: [100, 'Product name cannot be more than 100 characters']
    },
    name_ar: {
        type: String,
        trim: true,
        maxlength: [100, 'Arabic product name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a product description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    description_ar: {
        type: String,
        maxlength: [1000, 'Arabic description cannot be more than 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a product price'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Please provide a category']
    },
    stock: {
        type: Number,
        required: [true, 'Please provide stock quantity'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    // Main image - displayed in cards and lists
    mainImage: {
        type: String,
        default: '/images/default-product.jpg'
    },
    // Additional images (up to 4) - displayed only in product detail page
    additionalImages: {
        type: [String],
        default: [],
        validate: {
            validator: function (v) {
                return v.length <= 4;
            },
            message: 'Vous pouvez télécharger 4 images supplémentaires maximum'
        }
    },
    // Keep old fields for backward compatibility
    image: {
        type: String,
        default: '/images/default-product.jpg'
    },
    images: {
        type: [String],
        default: []
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    numReviews: {
        type: Number,
        default: 0
    },
    reviews: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    isAvailable: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});



const Product = mongoose.model('Product', productSchema);

export default Product;
