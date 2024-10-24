const mongoose = require ('mongoose')
const PurchaseSchema = new mongoose.Schema({
    productId:{
        type:String,
        require:true
    },
    quantity:{
        type:Number,
        require:true
    },
    userId:{
        type:String,
        require:true
    },
    name:{
        type:String,
        require:true
    },
    address:{
        type:String,
        require:true
    },
    mobile:{
        type:Number,
        require:true
    },
    paymentMethod:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    },
    status:{
        type:String,
        default:'Pending'
    }
})

const purchase = mongoose.model('purchase',PurchaseSchema)

module.exports = purchase