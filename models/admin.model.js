const mongoose = require("mongoose");
const validator =  require("validator");
// const bcrypt = require("bcrypt");
const argon = require("argon2");

const adminSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        trim: true,
        minlength: [2, 'Username should not be less than 2 characters'],
        unique: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
        },
        unique: true
    },
    adminId: {
        type: String,
        required: true,
    },
    role:{
        type:   String,
        required: true,
        default: 'admin'
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "Password must not be less than 8 characters"]
    },
    adminType: {
        type: String,
        required: true,
        enum: ["main-admin", "deposit-admin", "withdrawal-admin", "moderators"]
    }
});

// adminSchema.pre("save", async function(){
//     if(!this.isModified("password")) return;
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

// adminSchema.methods.comparePassword = async function(cp){
//     return isMatch = await bcrypt.compare(cp, this.password);
//     // return isMatch;
// }
// Hash the password before saving the user
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await argon.hash(this.password); // Argon2 automatically handles salting
    next();
  } catch (err) {
    return next(err);
  }
});

// Compare the password during login
adminSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon.verify(this.password, candidatePassword);
  } catch (err) {
    throw new Error('Password comparison failed');
  }
};


module.exports = mongoose.model("AdminModel", adminSchema);