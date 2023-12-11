const { UNAUTHORIZEDApiError } = require("../Errors");
const Admin = require("../models/admin.model");

function authorizePermissions(...roles){
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
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

function CheckAdminType(...types){
    return (req,res,next) =>{
        if(!types.includes(req.user.adminType)){
            throw new UNAUTHORIZEDApiError("Forbidden Route")
        }
        next()
    }

}

module.exports = {authorizePermissions, checkAdmin, CheckAdminType};