import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true,
            },
            quantity: { type: Number, required: true },
        }
    ],
    total: {
        type: Number,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'Pending', // Other values: Shipped, Delivered, Cancelled
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const orderModel = mongoose.model('Order', orderSchema);
export { orderModel };