require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ownerModel = require('../models/owner-model');
const productModel = require('../models/product-model');
const userModel = require('../models/user-model');
const isLoggedIn = require('../middlewares/isLoggedIn');
const isOwner = require('../middlewares/isOwner');

// Create owner (dev only - only one owner allowed)
if (process.env.NODE_ENV === 'development') {
    router.post('/create', async (req, res) => {
        try {
            const owners = await ownerModel.find();
            if (owners.length > 0) {
                return res.status(503).json({ message: "Owner already exists." });
            }
            const { name, email, password } = req.body;
            const hash = await bcrypt.hash(password, 10);
            const owner = await ownerModel.create({ name, email, password: hash });
            res.status(201).json({ message: 'Owner created', owner: { name: owner.name, email: owner.email } });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
}

// Owner Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const owner = await ownerModel.findOne({ email });
        if (!owner) return res.status(404).json({ message: 'Owner not found' });

        const match = await bcrypt.compare(password, owner.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: owner._id, email: owner.email, role: 'owner' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('token', token, { httpOnly: true });
        res.json({
            message: 'Owner login successful',
            token,
            owner: { id: owner._id, name: owner.name, email: owner.email }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Owner Logout
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out' });
});

// Owner Profile
router.get('/profile', isLoggedIn, isOwner, async (req, res) => {
    try {
        const owner = await ownerModel.findById(req.user.id).select('-password');
        res.json(owner);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Dashboard Stats
router.get('/dashboard', isLoggedIn, isOwner, async (req, res) => {
    try {
        const [products, users] = await Promise.all([
            productModel.find(),
            userModel.find().select('-password'),
        ]);

        const totalRevenue = products.reduce((sum, p) => {
            const discountedPrice = p.price - (p.price * (p.discount || 0) / 100);
            return sum + discountedPrice;
        }, 0);

        res.json({
            totalProducts: products.length,
            totalUsers: users.length,
            totalRevenue: totalRevenue.toFixed(2),
            recentProducts: products.slice(-5).reverse(),
            recentUsers: users.slice(-5).reverse()
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;