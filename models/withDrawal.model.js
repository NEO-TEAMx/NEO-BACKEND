const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
    user: {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
        total_amount: {
            type: Number,
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        approved: {
            type: Boolean,
            required: true,
            default: false,
        },
        charge: {
            type: Number,
            default: 5,
            required: true
        },
        payable_amount: {
            type: Number
        },
        walletAddress: {
            type: String,
        }
    }

},{timestamps:true});


module.exports = mongoose.model("Withdrawal", withdrawalSchema);