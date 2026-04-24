require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');

const db = require('./config/mongoose-connection');
const usersRouter = require('./routes/usersRouter');
const productsRouter = require('./routes/productsRouter');
const ownersRouter = require('./routes/ownersRouter');
const ordersRouter = require('./routes/ordersRouter');

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve API routes
app.use('/owners', ownersRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);

// Serve static files from React frontend and public folder
app.use(express.static(path.join(__dirname, 'public')));

// Basic health check
app.get('/', (req, res) => {
    res.json({ 
        message: 'Scatch API is running 🚀',
        environment: process.env.NODE_ENV || 'development'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});