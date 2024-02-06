const {attachCookieToRes,isTokenValid } = require("../../utils/jwt");
const {UnauthenticatedApiError} = require("../../Errors/index");
const Token = require("../../models/token.model/token");
const jwt = require('jsonwebtoken');

const authMiddleware = async(req,res,next) =>{
    const accessToken = req.headers['authorization'];
    const refresh_token = req.cookies['refresh_token'];

    
    if(!accessToken && !refresh_token){
        return res.status(401)
            .json({msg:"Authentication failed. Please login"})

    }
    try {
        
        

        if(accessToken){
            if(!refresh_token){
                return res.status(401)
                        .json({msg:"Please login again!!"})
            } 
            const payload = jwt.verify(accessToken, process.env.SECRET)
            
            req.user = payload;

            return next()
        }
     if(!accessToken){   
        const payload = jwt.verify(refresh_token, process.env.SECRET);
        
        const existingToken = await Token.findOne({
            admin: payload.tokenUser.userId,
            // refreshToken: payload.refresh_token
        });
        // console.log(existingToken)


        if(!existingToken){
            return res.status(402).json({msg:"Authentication failed. Please login again!"})
            // throw new UnauthenticatedApiError("Authentication failed. Please login again!")
        }
        const accessToken = jwt.sign(payload, process.env.SECRET);
        
        res.header('Authorization', accessToken);
        req.user = payload.tokenUser;
        return next();
        
    }   
    } catch (error) {
        console.log(error)
        return res.status(402).json({msg:"Authentication failed. Please login again!"})

        // throw new UnauthenticatedApiError("Authentication Failed. Please login again!")
    }
}


module.exports = authMiddleware;