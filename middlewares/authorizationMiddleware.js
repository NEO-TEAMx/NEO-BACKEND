const { UNAUTHORIZEDApiError } = require("../Errors");

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


module.exports = {authorizePermissions, checkAdmin};