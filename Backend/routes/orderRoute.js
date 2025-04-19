import express from 'express'
import { verifyAdmin } from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import { orderModel } from '../models/orderModel.js'
import { cartModel } from '../models/cartModel.js'

const orderRouter = express.Router()

orderRouter.get('/my', authUser, async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user._id }).populate('items.productId').sort({ createdAt: -1 });
        res.json({ orders });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch orders.' });
    }
});
orderRouter.post('/place', authUser, async (req, res) => {
    const { items, total, address, phone } = req.body;

    if (!items || !total || !address || !phone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const order = new orderModel({
            user: req.user._id,
            items,
            total,
            address,
            phone,
        });

        await order.save();

        const updatedCart = await cartModel.findOneAndUpdate(
            { userId: req.user._id },
            { $set: { items: [] } },
            { new: true }
        );

        if (!updatedCart) {
            console.warn(`Cart not found for user: ${req.user._id}`);
        }

        res.status(201).json({ message: 'Order placed successfully!', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});


orderRouter.get('/all', verifyAdmin, async (req, res) => {
    try {

        const orders = await orderModel.find()
            .populate('user', 'name email')
            .populate('items.productId')
            .sort({ createdAt: -1 });

        res.json({ orders });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch all orders.' });
    }
});

orderRouter.put('/:id/status', verifyAdmin, async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Shipped', 'Delivered', 'Canceled', 'Completed'];

    // Check if the status is valid
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const order = await orderModel.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update the order status
        order.status = status;
        await order.save();

        return res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
});

export default orderRouter