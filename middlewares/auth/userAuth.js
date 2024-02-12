const {attachCookieToRes,isTokenValid } = require("../../utils/jwt");
const {UnauthenticatedApiError, UNAUTHORIZEDApiError} = require("../../Errors/index");
const Utoken = require("../../models/token.model/uToken");
const jwt = require("jsonwebtoken");

const userAuthMiddleware = async(req,res,next) =>{
    let {accesstoken, refresh_token} = req.headers

    if(!accesstoken && !refresh_token){
        return res.status(401)
            .json({msg:"Authentication failed. Please login"})
    }
        
    try {
        
        if(accesstoken){      
            if(!refresh_token){
                return res.status(401)
                        .json({msg:"Please login again!!"})
            }  
            const payload = jwt.verify(accesstoken,process.env.SECRET)
            
            req.user = payload;
           return  next()
        }
        
        if(!accesstoken){
        const payload = jwt.verify(refresh_token, process.env.SECRET);
        
        const existingToken = await Utoken.findOne({
            user:payload.tokenUser.userId,
            refresh_token: payload.refresh_token
        });
        
        if(!existingToken){
            return res.status(401)
                .json({msg:"Authentication failed. Please login again!"})
        }
        const accessToken = jwt.sign(payload, process.env.SECRET);
        
        // res.header('Authorization', accessToken);
        req.user = payload.tokenUser;
        return next();
        }
    } catch (error) {    
        console.log(error)
        throw new UnauthenticatedApiError('Authentication failed!!')
    }
}


module.exports = userAuthMiddleware;