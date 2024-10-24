const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
    name :{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    subject:{
        type:String,
        require:true
    },
    message:{
        type:String,
        require:true
    },
    status:{
        type:Number,
        default:0
    }
})

const ContactUs = mongoose.model('ContactUs',Schema)
module.exports = ContactUs