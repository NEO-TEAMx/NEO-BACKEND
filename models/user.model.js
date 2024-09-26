const mongoose = require("mongoose");
const validator =  require("validator");
// const bcrypt = require("bcrypt");
const argon = require("argon2");
const moment = require("moment");

const userSchema = new mongoose.Schema({

    username: {
        type:String,
        required:[true, "Please provide a username"],
        unique: true,
        trim: true,
        minLength: [1, "Username must be at leaset 1 character"],
    },
    password: {
        type: String,
        required: true,
        minLength: [8, "Password must be at least 8 characters"]
    },
    email: {
        type: String,
        required:true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please provide valid email',
        }
    },
    role: {
        type: String,
        default: "user",
    },
    total_balance: {
        type:Number,
        default: 0
    },
    mining_status: {
        type: Boolean,
        default: false
    },
    mining_duration :{
        type: Date,
        // default: () => moment.duration(24, 'hours')
        default:null
    },
    yield_balance: {
        type:  Number,
        default:0
    },
    hash_rate: {
        type:Number,
        default: 0
    },
    yield_time: {
        type: Date,
        // default: () => moment().add(24, 'hours').toDate()
        default:null
    },
    yield_percentage: {
        type: Number,
        default: 0
    },
    passwordToken: {
        type: String
    },
    passwordTokenExpirationDate: {
        type: Date,
    },
    referralCode: {
        type:String,
        unique: true,
        // default: shortid.generate
    },
    referredBy: {
        type:mongoose.Types.ObjectId,
        ref: "User"
    },
    referral_link:{
        type: String,
        required: true,
        trim: true
    }
},{timestamps:true, toJSON:{virtuals:true}, toObject:{virtuals:true}});


// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await argon.hash(this.password); // Argon2 automatically handles salting
    next();
  } catch (err) {
    return next(err);
  }
});

// Compare the password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await argon.verify(this.password, candidatePassword);
  } catch (err) {
    throw new Error('Password comparison failed');
  }
};

module.exports = mongoose.model("User", userSchema);