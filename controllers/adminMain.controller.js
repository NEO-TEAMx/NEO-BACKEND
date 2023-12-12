const User = require("../models/user.model");
const Deposit = require("../models/deposit.model");
const {BadRequestApiError,NotFoundApiError} = require("../Errors");
const {StatusCodes} = require("http-status-codes");


const getAllUsers = async(req,res) =>{
    const users = await User.find({});
    return res.status(StatusCodes.OK).json({success:true, count: users.length, users})
}

const approveDeposit = async(req,res) =>{
    const {id:userId} = req.params;
    const {total_balance} = req.body;
    if(!total_balance){
        throw new BadRequestApiError("Please provide the amount")
    } 
    const apD = await User.findByIdAndUpdate({_id:userId},{
        total_balance:total_balance 
    },{runValidators:true, new:true});
    // const bool = await Deposit.findOne({_id:req.params.id})
    const bool = await Deposit.findById(req.params.id)
    console.log(bool)
    bool.approved = true;
    await bool.save();

    return res.status(StatusCodes.OK).json({success:true, msg: "User balance updated successfully", apD, bool})
}



module.exports = {
    getAllUsers,
    approveDeposit,
}