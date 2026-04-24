require('dotenv').config();
const mongoose = require('mongoose');
const productModel = require('../models/product-model');

const products = [
    // ── Electronics ─────────────────────────────
    { category: 'Electronics', name: 'iPhone 15 Pro Max', price: 134900, discount: 5, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&q=80', bgc: '#0f172a', panelcolor: '#6366f1', textcolor: '#ffffff' },
    { category: 'Electronics', name: 'Samsung Galaxy S24 Ultra', price: 129999, discount: 10, image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&q=80', bgc: '#1a1a2e', panelcolor: '#ec4899', textcolor: '#ffffff' },
    { category: 'Electronics', name: 'MacBook Air M3', price: 114900, discount: 8, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&q=80', bgc: '#111827', panelcolor: '#8b5cf6', textcolor: '#ffffff' },
    { category: 'Electronics', name: 'iPad Pro 12.9"', price: 112900, discount: 0, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&q=80', bgc: '#1a1f3d', panelcolor: '#6366f1', textcolor: '#ffffff' },
    { category: 'Electronics', name: 'OnePlus 12R', price: 39999, discount: 12, image: 'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=500&q=80', bgc: '#1a0a00', panelcolor: '#f97316', textcolor: '#ffffff' },
    { category: 'Electronics', name: 'Google Pixel 8 Pro', price: 105999, discount: 7, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80', bgc: '#0d1b2a', panelcolor: '#3b82f6', textcolor: '#ffffff' },
    { category: 'Electronics', name: 'Dell XPS 15 Laptop', price: 189990, discount: 5, image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&q=80', bgc: '#111827', panelcolor: '#6366f1', textcolor: '#ffffff' },
    { category: 'Electronics', name: 'PlayStation 5 Console', price: 54990, discount: 0, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80', bgc: '#0a0a1a', panelcolor: '#3b82f6', textcolor: '#ffffff' },
    { category: 'Electronics', name: 'Nintendo Switch OLED', price: 32999, discount: 5, image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&q=80', bgc: '#1a0a00', panelcolor: '#ef4444', textcolor: '#ffffff' },
    { category: 'Electronics', name: 'Kindle Paperwhite', price: 14999, discount: 20, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80', bgc: '#1c1c1e', panelcolor: '#6b7280', textcolor: '#ffffff' },

    // ── Audio ────────────────────────────────────
    { category: 'Audio', name: 'Sony WH-1000XM5 Headphones', price: 29990, discount: 15, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80', bgc: '#1e293b', panelcolor: '#f59e0b', textcolor: '#ffffff' },
    { category: 'Audio', name: 'JBL Charge 5 Speaker', price: 14999, discount: 0, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', bgc: '#0f1923', panelcolor: '#ef4444', textcolor: '#ffffff' },
    { category: 'Audio', name: 'boAt Airdopes 141', price: 1299, discount: 30, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80', bgc: '#1a0020', panelcolor: '#8b5cf6', textcolor: '#ffffff' },
    { category: 'Audio', name: 'Apple AirPods Pro 2', price: 24900, discount: 8, image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500&q=80', bgc: '#111827', panelcolor: '#6366f1', textcolor: '#ffffff' },
    { category: 'Audio', name: 'Bose QuietComfort 45', price: 26900, discount: 10, image: 'https://images.unsplash.com/photo-1585298723682-7115561c51b7?w=500&q=80', bgc: '#1c1410', panelcolor: '#d97706', textcolor: '#ffffff' },
    { category: 'Audio', name: 'Marshall Emberton II', price: 11999, discount: 12, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&q=80', bgc: '#1a1000', panelcolor: '#b45309', textcolor: '#ffffff' },

    // ── Cameras ──────────────────────────────────
    { category: 'Cameras', name: 'Canon EOS R50', price: 62995, discount: 0, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&q=80', bgc: '#1a1200', panelcolor: '#d97706', textcolor: '#ffffff' },
    { category: 'Cameras', name: 'GoPro Hero 12 Black', price: 39500, discount: 8, image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=500&q=80', bgc: '#0f2417', panelcolor: '#10b981', textcolor: '#ffffff' },
    { category: 'Cameras', name: 'DJI Mini 4 Pro Drone', price: 74900, discount: 5, image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&q=80', bgc: '#0a0a0a', panelcolor: '#6366f1', textcolor: '#ffffff' },
    { category: 'Cameras', name: 'Sony ZV-E10 Vlog Camera', price: 55990, discount: 10, image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&q=80', bgc: '#111827', panelcolor: '#ec4899', textcolor: '#ffffff' },
    { category: 'Cameras', name: 'Fujifilm Instax Mini 12', price: 7999, discount: 0, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500&q=80', bgc: '#1a0a1a', panelcolor: '#a855f7', textcolor: '#ffffff' },

    // ── Wearables ────────────────────────────────
    { category: 'Wearables', name: 'Apple Watch Series 9', price: 41900, discount: 12, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=80', bgc: '#0c1445', panelcolor: '#10b981', textcolor: '#ffffff' },
    { category: 'Wearables', name: 'Fossil Gen 6 Smartwatch', price: 22995, discount: 18, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', bgc: '#111827', panelcolor: '#6b7280', textcolor: '#ffffff' },
    { category: 'Wearables', name: 'Samsung Galaxy Watch 6', price: 26999, discount: 15, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80', bgc: '#0d1b2a', panelcolor: '#3b82f6', textcolor: '#ffffff' },
    { category: 'Wearables', name: 'Fitbit Charge 6', price: 14999, discount: 10, image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500&q=80', bgc: '#0f2417', panelcolor: '#10b981', textcolor: '#ffffff' },
    { category: 'Wearables', name: 'Noise ColorFit Pro 4', price: 2999, discount: 40, image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500&q=80', bgc: '#1a1a2e', panelcolor: '#8b5cf6', textcolor: '#ffffff' },

    // ── Fashion ──────────────────────────────────
    { category: 'Fashion', name: 'Nike Air Jordan 1 Retro', price: 12995, discount: 20, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', bgc: '#1c0a00', panelcolor: '#f97316', textcolor: '#ffffff' },
    { category: 'Fashion', name: 'Levi\'s 501 Original Jeans', price: 4999, discount: 25, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&q=80', bgc: '#0d1b2a', panelcolor: '#3b82f6', textcolor: '#ffffff' },
    { category: 'Fashion', name: 'Ray-Ban Aviator Sunglasses', price: 8490, discount: 10, image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80', bgc: '#1a0a00', panelcolor: '#b45309', textcolor: '#ffffff' },
    { category: 'Fashion', name: 'Adidas Ultraboost 23', price: 15999, discount: 15, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&q=80', bgc: '#0a0a1a', panelcolor: '#6366f1', textcolor: '#ffffff' },
    { category: 'Fashion', name: 'Puma Classic Cap', price: 999, discount: 30, image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=500&q=80', bgc: '#1a0000', panelcolor: '#ef4444', textcolor: '#ffffff' },
    { category: 'Fashion', name: 'Wildcraft Backpack 30L', price: 2499, discount: 20, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80', bgc: '#0f2417', panelcolor: '#10b981', textcolor: '#ffffff' },

    // ── Home & Kitchen ───────────────────────────
    { category: 'Home & Kitchen', name: 'Dyson V15 Vacuum Cleaner', price: 52900, discount: 5, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80', bgc: '#1a0a00', panelcolor: '#f97316', textcolor: '#ffffff' },
    { category: 'Home & Kitchen', name: 'Instant Pot Duo 7-in-1', price: 8999, discount: 15, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80', bgc: '#111827', panelcolor: '#6b7280', textcolor: '#ffffff' },
    { category: 'Home & Kitchen', name: 'Philips Air Fryer HD9200', price: 6995, discount: 20, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500&q=80', bgc: '#1a1200', panelcolor: '#d97706', textcolor: '#ffffff' },
    { category: 'Home & Kitchen', name: 'Bosch Electric Kettle', price: 2299, discount: 10, image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&q=80', bgc: '#1c1410', panelcolor: '#b45309', textcolor: '#ffffff' },

    // ── Sports & Fitness ─────────────────────────
    { category: 'Sports', name: 'Decathlon Yoga Mat Pro', price: 1299, discount: 25, image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&q=80', bgc: '#0f2417', panelcolor: '#10b981', textcolor: '#ffffff' },
    { category: 'Sports', name: 'Cosco Football Official', price: 899, discount: 0, image: 'https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500&q=80', bgc: '#1a0a00', panelcolor: '#f97316', textcolor: '#ffffff' },
    { category: 'Sports', name: 'Boldfit Gym Gloves', price: 599, discount: 35, image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&q=80', bgc: '#1a0000', panelcolor: '#ef4444', textcolor: '#ffffff' },
    { category: 'Sports', name: 'Hydro Flask Water Bottle', price: 3499, discount: 10, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80', bgc: '#0d1b2a', panelcolor: '#3b82f6', textcolor: '#ffffff' },
];

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('✅ Connected to MongoDB');

        if (process.argv.includes('--force')) {
            await productModel.deleteMany({});
            console.log('🗑️  Cleared existing products.');
        }

        const inserted = await productModel.insertMany(products);
        console.log(`\n🎉 Successfully seeded ${inserted.length} products!\n`);

        const byCategory = {};
        inserted.forEach(p => {
            byCategory[p.category] = (byCategory[p.category] || 0) + 1;
        });
        Object.entries(byCategory).forEach(([cat, count]) => {
            console.log(`  📦 ${cat}: ${count} products`);
        });

        console.log('\n👉 Visit http://localhost:5173/shop to see your products!\n');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('❌ Error:', err.message);
        process.exit(1);
    });
