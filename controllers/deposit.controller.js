const Deposit = require("../models/deposit.model");
const {BadRequestApiError} = require("../Errors");
const { StatusCodes } = require("http-status-codes");
const { generateUniquieId } = require("../__helpers__/generateId");
const sendDepositEmail = require("../EmailFormats/depositMail");

const requestDeposit = async(req,res) =>{
    
    const {amount} = req.body;
    if(!amount){
        throw new BadRequestApiError("Provide the needed value(s)")
    }

    if(amount<1){
        throw new BadRequestApiError("Amount should not be less than 1 usdt")
    }
    req.body.email = req.user.email;
    req.body.transaction_id = generateUniquieId();
    req.body.user = req.user.userId;
    
    const deposit = await Deposit.create(req.body);

    await sendDepositEmail({
        email: req.body.email,
        username: req.user.username,
        transactionId: req.body.transaction_id,
        amount: amount 
    })

    return res.status(StatusCodes.OK).json({success:true, deposit})

}


const DepositlHistory = async(req,res) =>{
  const deposit = await Deposit.find({id:req.user._id});
    if(deposit.length < 1){
        return res.status(StatusCodes.OK).json({success:true, msg: "Deposit history is empty"})
    }

    return res.status(StatusCodes.OK).json({success:true, deposit})
}



module.exports = {
    requestDeposit,
    DepositlHistory
}