const {attachCookieToRes,isTokenValid } = require("../../utils/jwt");
const {UnauthenticatedApiError, UNAUTHORIZEDApiError} = require("../../Errors/index");
const Utoken = require("../../models/token.model/uToken");
const jwt = require("jsonwebtoken");

const userAuthMiddleware = async(req,res,next) =>{
    const accessToken = req.headers['authorization'];
    const refresh_token = req.cookies['refresh_token'];

    if(!accessToken && !refresh_token){
        return res.status(401)
            .json({msg:"Authentication failed. Please login"})
    }
    // const {access_token,refresh_token} = req.signedCookies;
    
    try {
        
        if(accessToken){      
            if(!refresh_token){
                return res.status(401)
                        .json({msg:"Please login again!!"})
            }  
            const payload = jwt.verify(accessToken,process.env.SECRET)
            // console.log(payload)
            req.user = payload;
           return  next()
        }
        
        if(!accessToken){
        const payload = jwt.verify(refresh_token, process.env.SECRET);
        console.log(payload)
        const existingToken = await Utoken.findOne({
            user:payload.tokenUser.userId,
            refresh_token: payload.refresh_token
        });
        // console.log(existingToken)
        if(!existingToken){
            return res.status(401)
                .json({msg:"Authentication failed. Please login again!"})
        }
        const accessToken = jwt.sign(payload, process.env.SECRET);
        console.log(accessToken)
        // console.log(res.header[Authorization])
        res.header('Authorization', accessToken);
        req.user = payload.tokenUser;
        return next();
        }
    } catch (error) {    
        console.log(error)
        throw new UnauthenticatedApiError('Authentication failed!!')
    }
}


module.exports = userAuthMiddleware;