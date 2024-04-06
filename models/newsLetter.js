const mongoose = require("mongoose");
const validator =  require("validator");

const nLSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
        }
    }
});

module.exports = mongoose.model("NL", nLSchema);