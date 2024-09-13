const mongoose = require('mongoose');
const product = require('./product');

const Schema= mongoose.Schema


const orderSchema = new Schema({
    products:[{
        product: {
            type: Object,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    user: {
        username: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true,
            ref: 'User'
        }
    }
});

module.exports = mongoose.model('Order',orderSchema);