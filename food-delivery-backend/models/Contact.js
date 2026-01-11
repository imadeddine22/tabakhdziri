import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'الاسم مطلوب'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'البريد الإلكتروني مطلوب'],
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'رقم الهاتف مطلوب'],
        trim: true
    },
    eventType: {
        type: String,
        required: [true, 'نوع المناسبة مطلوب'],
        enum: ['mariage', 'fiancailles', 'anniversaire', 'entreprise', 'autre']
    },
    guests: {
        type: Number,
        required: [true, 'عدد الضيوف مطلوب'],
        min: 1
    },
    date: {
        type: Date,
        required: [true, 'تاريخ المناسبة مطلوب']
    },
    message: {
        type: String,
        required: [true, 'الرسالة مطلوبة'],
        trim: true
    },
    status: {
        type: String,
        enum: ['new', 'read', 'replied', 'contacted', 'completed', 'cancelled'],
        default: 'new'
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index for faster queries
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });
contactSchema.index({ email: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
