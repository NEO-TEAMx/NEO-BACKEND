const mongoose = require("mongoose");
const validator =  require("validator");
const bcrypt = require("bcrypt");


const depositSchema = new mongoose.Schema({
    user: {
        user: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        },
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
        }
    }

},{timestamps:true});


module.exports = mongoose.model("Deposit", depositSchema);