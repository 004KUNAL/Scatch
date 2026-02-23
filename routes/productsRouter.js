const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productModel = require('../models/product-model');
const isLoggedIn = require('../middlewares/isLoggedIn');
const isOwner = require('../middlewares/isOwner');

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/images/products'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Get all products (public)
router.get('/', async (req, res) => {
    try {
        const products = await productModel.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single product (public)
router.get('/:id', async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create product (owner only)
router.post('/create', isLoggedIn, isOwner, upload.single('image'), async (req, res) => {
    try {
        const { name, price, discount, bgc, panelcolor, textcolor } = req.body;
        const imageUrl = req.file ? `/images/products/${req.file.filename}` : '';
        const product = await productModel.create({
            name, price, discount, bgc, panelcolor, textcolor, image: imageUrl
        });
        res.status(201).json({ message: 'Product created', product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update product (owner only)
router.put('/:id', isLoggedIn, isOwner, upload.single('image'), async (req, res) => {
    try {
        const { name, price, discount, bgc, panelcolor, textcolor } = req.body;
        const updates = { name, price, discount, bgc, panelcolor, textcolor };
        if (req.file) updates.image = `/images/products/${req.file.filename}`;

        const product = await productModel.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product updated', product });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete product (owner only)
router.delete('/:id', isLoggedIn, isOwner, async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;