const mongoose = require('mongoose')
const HomeSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    offerText: {
        type: String,
        required: true 
    },
    offer:{
        type:Number,
        
    }

})

const home = mongoose.model('home',HomeSchema)

module.exports = home