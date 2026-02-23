require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ownerModel = require('../models/owner-model');

const newEmail = process.argv[2];
const newPassword = process.argv[3];
const newName = process.argv[4] || 'Admin';

if (!newEmail || !newPassword) {
    console.log('Usage: node utils/reset-owner.js <email> <password> [name]');
    process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        const hash = await bcrypt.hash(newPassword, 10);
        
        // Delete existing owner(s)
        await ownerModel.deleteMany({});
        
        // Create new owner
        await ownerModel.create({
            name: newName,
            email: newEmail,
            password: hash
        });
        
        console.log(`✅ Admin reset successfully!`);
        console.log(`Email: ${newEmail}`);
        console.log(`Name: ${newName}`);
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('❌ Error:', err.message);
        process.exit(1);
    });
