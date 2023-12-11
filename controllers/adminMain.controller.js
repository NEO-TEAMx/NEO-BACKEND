const User = require("../models/user.model");
const {BadRequestApiError,NotFoundApiError} = require("../Errors");
const {StatusCodes} = require("http-status-codes");


const getAllUsers = async(req,res) =>{
    const users = await User.find({});
    return res.status(StatusCodes.OK).json({success:true, count: users.length, users})
}





module.exports = {
    getAllUsers
}