const mongoose = require("mongoose");
const validator =  require("validator");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
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
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    referral_link:{
        type: String,
        required: true,
        trim: true
    }
},{timestamps:true, toJSON:{virtuals:true}, toObject:{virtuals:true}});

userSchema.pre("save", async function(){
   if(!this.isModified("password")) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function(cp){
    return isMatch = await bcrypt.compare(cp,this.password)
}; 

module.exports = mongoose.model("User", userSchema);