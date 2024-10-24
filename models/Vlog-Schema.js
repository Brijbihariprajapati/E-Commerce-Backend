const mongoose = require('mongoose');

const VlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now, 
    }
});

const Vlog = mongoose.model('Vlog', VlogSchema);

module.exports = Vlog;
