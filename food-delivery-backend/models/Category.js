import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Category name cannot be more than 50 characters']
    },
    name_ar: {
        type: String,
        trim: true,
        maxlength: [50, 'Arabic category name cannot be more than 50 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    description_ar: {
        type: String,
        maxlength: [500, 'Arabic description cannot be more than 500 characters']
    },
    image: {
        type: String,
        default: '/images/default-category.jpg'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
