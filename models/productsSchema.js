const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number, 
        required: true
    },
    color: {
        type: String,
        required: true
    },
    image: {
        type: String, 
        required: true
    },
    stocks: {
        type: Number, 
        required: true
    },
    available: {
        type: Number, 
        required: true
    },
    status: {
        type: Number,
        default: 0 
    }
});

const Products = mongoose.model('Products', productSchema);

module.exports = Products;
