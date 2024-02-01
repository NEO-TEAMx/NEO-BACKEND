const User = require("../models/user.model");
const Withdrawal = require("../models/withDrawal.model");
const {BadRequestApiError} = require("../Errors");
const { StatusCodes } = require("http-status-codes");
const { generateUniquieId } = require("../__helpers__/generateId");
const sendWithdrawalEmail = require("../EmailFormats/transactionMail");

const requestWithdrawl = async(req,res) =>{
    const {total_amount,walletAddress} = req.body;
    const charge = 5;
    const user = await User.findOne({_id:req.user.userId});
    // const {total_balance} = user;
    const transaction_id = generateUniquieId();

    if(!total_amount || !walletAddress){
        throw new BadRequestApiError("provide the needed value(s)")
    }

    if(!user){
        throw new BadRequestApiError("Please login again!")
    }

    if(user.total_balance < total_amount){
        throw new BadRequestApiError("Insufficient wallet balance.") 
    }

    req.body.user = req.user.userId;
    req.body.email = req.user.email;

    const payable_amount = (total_amount * charge)/100;

    user.total_balance -= total_amount;
    await user.save();

    // console.log(user.total_balance)
    const withdrawal = await Withdrawal.create({
        total_amount,
        charge,
        payable_amount,
        walletAddress,
        transaction_id,
        user: req.user.userId,
        email: req.user.email,
    });

    await sendWithdrawalEmail({
        email: user.email,
        transactionId: transaction_id,
        amount: total_amount,
        payableAmount: payable_amount
    });

    return res.status(StatusCodes.OK).json({success:true, msg: "Your withdrawal is being processed.", withdrawal})
}


const withdrawalHistory = async(req,res) =>{
    const userId = req.user.userId;
    
    const withdrawal = await Withdrawal.find({user:userId})
 
    if(withdrawal.length < 1){
        return res.status(StatusCodes.OK).json({success:true, msg: "Withdrawal history is empty"})
    }

    return res.status(StatusCodes.OK).json({success:true, count:withdrawal.length, withdrawal})
}



module.exports = {
    requestWithdrawl,
    withdrawalHistory
}