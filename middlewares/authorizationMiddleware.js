const { UNAUTHORIZEDApiError } = require("../Errors");
const Admin = require("../models/admin.model");

function authorizePermissions(...roles){
    return (req,res,next) =>{
        if(!roles.include(req.user.role)){
            throw new UNAUTHORIZEDApiError('Route is Forbidden!!!')
        }
        next();
    }
}

function checkAdmin(req,res,next){
    if(req.user.role !== 'admin'){
        throw new UNAUTHORIZEDApiError('Forbidden Route!!!')
    }
    next();
}

async function CheckAdminType(req,res,next){
    if(req.user.adminType === "main-admin"){
        console.log("main admin")
    }
}

module.exports = {authorizePermissions, checkAdmin, CheckAdminType};