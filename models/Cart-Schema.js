const mongoose = require('mongoose')
const cartSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true
    },
   
    productid:{
        type:String,
        require:true
    },
    count:{
        type:Number,
        default:1
    }
});

const Cart = mongoose.model('Cart',cartSchema);

module.exports = Cart