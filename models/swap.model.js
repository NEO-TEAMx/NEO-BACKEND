const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema({
    
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        neo_amount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        email:{
            type: String,
            required: true,
            trim: true
        },
        usdt_equ:{
            type:Number
        }
    

},{timestamps:true});


module.exports = mongoose.model("Swap", swapSchema);