require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user-model');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;
        const existing = await userModel.findOne({ email });
        if (existing) return res.status(400).json({ message: 'Email already registered' });

        const hash = await bcrypt.hash(password, 10);
        const user = await userModel.create({ name, email, password: hash, contact });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('token', token, { httpOnly: true });
        res.status(201).json({ message: 'Registered successfully', token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, email: user.email, role: 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('token', token, { httpOnly: true });
        res.json({ message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

// Get profile
router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all users (admin)
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const users = await userModel.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add to cart
router.post('/cart', isLoggedIn, async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await userModel.findById(req.user.id);
        user.cart.push(productId);
        await user.save();
        res.json({ message: 'Added to cart', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Remove from cart
router.delete('/cart/:productId', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id);
        user.cart = user.cart.filter(id => id.toString() !== req.params.productId);
        await user.save();
        res.json({ message: 'Removed from cart', cart: user.cart });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get cart
router.get('/cart', isLoggedIn, async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).populate('cart');
        res.json(user.cart);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;