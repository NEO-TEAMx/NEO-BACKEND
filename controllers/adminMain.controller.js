const User = require("../models/user.model");
const Deposit = require("../models/deposit.model");
const {BadRequestApiError,NotFoundApiError} = require("../Errors");
const {StatusCodes} = require("http-status-codes");
const Withdrawal = require("../models/withDrawal.model");

const getAllUsers = async(req,res) =>{
    const {email} = req.query;
    const queryObject = {};
    if(email){
        queryObject.email = {$regex: email, $options:'i'}
    }

    let result = await User.find(queryObject).select('-password');;
    const users = result;
    return res.status(StatusCodes.OK).json({success:true, count: users.length, users})
}

const allDeposit = async(req,res)=>{
    const {transaction_id, email} = req.query;
    const queryObject = {};

    if (email) {
        queryObject.email = { $regex: email, $options: 'i' };
    }

    if (transaction_id) {
        queryObject.transaction_id = { $regex: transaction_id, $options: 'i' };
    }

    let result = await Deposit.find(queryObject);

    const deposit = result;

    return res.status(StatusCodes.OK).json({success:true, count: deposit.length,deposit});
}

const allWithdrawal = async(req,res) =>{
    const {transaction_id,email} = req.query;
    const queryObject ={};
    if(email){
        queryObject.email = {$regex: email, $options: 'i'}
    }

    if(transaction_id){
        queryObject.transaction_id = {$regex:transaction_id, $options: 'i'}
    }

    let result = await Withdrawal.find(queryObject);
    const withdrawal = result;
    return res.status(StatusCodes.OK).json({success:true, withdrawal})
}

const approveWithdrawal = async(req,res)=>{
    const {id:withdrawalId} = req.params;
    const withdrawalApprove = await Withdrawal.findOne({_id:withdrawalId});
    if(!withdrawalApprove){
        throw new NotFoundApiError("No withdrawal found")
    }
    withdrawalApprove.approved = true;

    await withdrawalApprove.save();

    return res.status(StatusCodes.OK).json({success:true, withdrawalApprove});
}

const approveDeposit = async(req,res) =>{

    const {id:depositId} = req.params; 
    
    const depositAprrove = await Deposit.findOne({_id:depositId});
    if(!depositAprrove){
        throw new NotFoundApiError("No deposit with id "+ depositId);
    } 

    depositAprrove.approved = true;
    await depositAprrove.save();
    
    return res.status(StatusCodes.OK).json({success:true, msg: "Deposit successfully approved", depositAprrove})
}

const addDeposit = async(req,res) =>{
    const {id:userId} = req.params;
    const {amount} = req.body;
    if(!amount){
        throw new BadRequestApiError("Amount must be provided!")
    }

    const user = await User.findOne({_id:userId});
    if(!user){
        throw new BadRequestApiError("No user found")
    }
    user.total_balance += amount;

    //referral logic
    if(user.referredBy){
        const referringUser = await User.findById(user.referredBy);

        if(referringUser){
            let val = (10*amount)/100; // user gets 10% of the amount bing deposited
            val += referringUser.total_balance
            await referringUser.save();
        }
    }

    await user.save();
    return res.status(StatusCodes.OK).json({success:true, msg: "Deposit successfully made", user})
}

module.exports = {
    getAllUsers,
    approveDeposit,
    addDeposit,
    approveWithdrawal,
    allDeposit,
    allWithdrawal,
}