const mongoose = require("mongoose");
const { generateUniquieId } = require("../__helpers__/generateId");

const depositSchema = new mongoose.Schema({
    
        amount: {
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
        transaction_id: {
            type: String,
            require: true,
        },
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        }
    

},{timestamps:true});


module.exports = mongoose.model("Deposit", depositSchema);