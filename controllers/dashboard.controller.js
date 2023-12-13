const { StatusCodes } = require("http-status-codes");
const { NotFoundApiError, BadRequestApiError } = require("../Errors");
const User = require("../models/user.model");



const userDashboard = async(req,res) =>{
    
    const user = await User.findById(req.params.id).select('-password');
    if(!user){
        throw new NotFoundApiError("No user with such id")
    }

    return res.status(200).json({success:true, user})
}

const buyHash = async(req,res) =>{
    const {hash_amount} = req.body;
    const {_id:userId} = req.params;
    if(!hash_amount){
        throw new BadRequestApiError("Input the amount of hash to purchase!")
    }
    const hash = await User.findOne({id:userId});
    if(!hash){
        throw new NotFoundApiError("No user witj such id")
    }
    if(hash_amount > hash.total_balance){
        throw new BadRequestApiError("Credit your wallet to purchase more hash!")
    }
    if(hash.total_balance === 0){
        throw new BadRequestApiError("Please credit your wallet, to buy hash")
    }

    const rate = hash_amount * 0.000015; 

    hash.hash_rate += rate;
    hash.total_balance -= hash_amount;
    await hash.save();

    return res.status(StatusCodes.OK).json({success:true, msg: "Successfully purchased hash!", hash})
}

module.exports = {
    userDashboard,
    buyHash
}