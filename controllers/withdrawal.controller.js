const User = require("../models/user.model");
const Withdrawal = require("../models/withDrawal.model");
const {BadRequestApiError} = require("../Errors");
const { StatusCodes } = require("http-status-codes");
const { generateUniquieId } = require("../__helpers__/generateId");

const requestWithdrawl = async(req,res) =>{
    const {total_amount,walletAddress} = req.body;

    if(!total_amount || !walletAddress){
        throw new BadRequestApiError("provide the needed value(s)")
    }

    req.body.user = req.user.userId;

    
    const user = await User.findOne({_id:req.user.userId})

    let {total_balance} = user;
    console.log(user.total_balance)
    if(!user){
        throw new BadRequestApiError("Please login again!")
    }

    if(total_balance < total_amount){
        throw new BadRequestApiError("Insufficient wallet balance.") 
    }

    const charge = 5;

    const payable_amount = (total_amount * charge)/100;

    total_balance = total_balance - total_amount;
    
    await user.save();

    const transaction_id = generateUniquieId();

    const withdrawal = await Withdrawal.create({
        total_amount,
        charge,
        payable_amount,
        walletAddress,
        transaction_id,
        user: req.user.userId,
    });

    
    return res.status(StatusCodes.OK).json({success:true, msg: "Your withdrawal is being processed.", withdrawal})
}


const withdrawalHistory = async(req,res) =>{
  const withdrawal = await Withdrawal.find({id:req.user._id});
    if(withdrawal.length < 1){
        return res.status(StatusCodes.OK).json({success:true, msg: "Withdrawal history is empty"})
    }

    return res.status(StatusCodes.OK).json({success:true, withdrawal})
}



module.exports = {
    requestWithdrawl,
    withdrawalHistory
}