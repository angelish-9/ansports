const express = require('express');
const router = express.Router();
const Order = require('models/Order.js');
const authenticate = require('../middleware/authenticate'); // Middleware to verify token

router.post('/place', authenticate, async (req, res) => {
    const { items, total, address, phone } = req.body;

    if (!items || !total || !address || !phone) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const order = new Order({
            user: req.user._id,
            items,
            total,
            address,
            phone,
        });

        await order.save();

        // Optionally, clear the user's cart after order
        // await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

        res.status(201).json({ message: 'Order placed successfully!', order });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Something went wrong.' });
    }
});

module.exports = router;
