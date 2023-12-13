const User = require("../models/user.model");



const userDashboard = async(req,res) =>{
    
    const user = await User.findById(req.params.id)
    return res.status(200).json({user})
}

module.exports = {
    userDashboard
}