import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    dishId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    nameFr: String,
    nameAr: String,
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    image: String
});

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Customer is required']
    },
    customerInfo: {
        firstName: {
            type: String,
            required: [true, 'First name is required']
        },
        lastName: {
            type: String,
            required: [true, 'Last name is required']
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required']
        },
        email: String
    },
    items: {
        type: [orderItemSchema],
        required: [true, 'Order must have items'],
        validate: {
            validator: function (items) {
                return items && items.length > 0;
            },
            message: 'Order must have at least one item'
        }
    },
    eventDetails: {
        eventType: {
            type: String,
            required: true
        },
        teamGender: {
            type: String,
            enum: ['Hommes', 'Femmes'],
            required: true
        },
        wilaya: {
            type: String,
            required: true
        },
        location: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true
        }
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'],
        default: 'pending'
    },
    notes: {
        type: String,
        maxlength: 500
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

// Index for faster queries
orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
