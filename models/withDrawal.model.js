const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
    
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        email:{
            type: String,
            required: true,
            trim: true
        },
        total_amount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            default: Date.now(),
        },
        approved: {
            type: Boolean,
            default: false,
            required: true
        },
        charge: {
            type: Number,
        },
        payable_amount: {
            type: Number
        },
        walletAddress: {
            type: String,
            required: true
        },
        transaction_id:{
            type:String,
            required:true,
        }

},{timestamps:true});


module.exports = mongoose.model("Withdrawal", withdrawalSchema);