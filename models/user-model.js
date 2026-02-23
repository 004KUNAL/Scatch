const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name : String,
    email : String,
    password : String,
    cart : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'product'
    }],
    orders : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'order'
    }],
    contact : Number,
    picture : String
})

module.exports = mongoose.model('user', userSchema)
