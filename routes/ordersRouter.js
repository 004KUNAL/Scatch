const express = require('express');
const router = express.Router();
const orderModel = require('../models/order-model');
const userModel = require('../models/user-model');
const isLoggedIn = require('../middlewares/isLoggedIn');
const isOwner = require('../middlewares/isOwner');

// Create Order (Checkout)
router.post('/create', isLoggedIn, async (req, res) => {
    try {
        const { items, totalAmount, address, paymentMethod } = req.body;
        
        // Create the order
        const order = await orderModel.create({
            user: req.user.id,
            items,
            totalAmount,
            address,
            paymentMethod,
            status: 'pending'
        });

        // Clear user cart and add order to user's history
        await userModel.findByIdAndUpdate(req.user.id, { 
            $set: { cart: [] },
            $push: { orders: order._id }
        });

        res.status(201).json({ message: 'Order placed successfully', order });
    } catch (err) {
        console.error("Order Creation Error:", err);
        res.status(500).json({ message: err.message });
    }
});

// Admin: Get all orders
router.get('/all', isLoggedIn, isOwner, async (req, res) => {
    try {
        const orders = await orderModel.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin: Update order status
router.put('/status/:id', isLoggedIn, isOwner, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await orderModel.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json({ message: `Order status updated to ${status}`, order });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// User: Get my orders
router.get('/my-orders', isLoggedIn, async (req, res) => {
    try {
        const orders = await orderModel.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
