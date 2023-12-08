const mongoose = require('mongoose');


const tokenSchema = new mongoose.Schema({
    refresh_token :{
        type: String,
        require: true
    },
    ip: {
        type: String,
        required: true
    },
    userAgent: {
        type: String,
        required: true
    },
    isValid: {
        type: Boolean,
        default: true
    },
    admin: {
        type: mongoose.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, {timestamps: true});


module.exports = mongoose.model('Token', tokenSchema);