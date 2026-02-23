require('dotenv').config();
const mongoose = require('mongoose');
const dbgr = require('debug')('development:mongoose');

const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => dbgr('Connected to MongoDB'))
    .catch((err) => dbgr('Error connecting to MongoDB:', err.message));

module.exports = mongoose.connection;
