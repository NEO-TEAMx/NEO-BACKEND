const {attachCookieToRes,isTokenValid } = require("../../utils/jwt");
const {UnauthenticatedApiError} = require("../../Errors/index");
const Token = require("../../models/token.model/token");
const jwt = require('jsonwebtoken');

const authMiddleware = async(req,res,next) =>{
    let {accesstoken, refresh_token} = req.headers
    // const accessToken = token;
    // console.log(refresh_token)
    // console.log(accesstoken)
    // console.log(req.headers)

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
            const payload = jwt.verify(accesstoken, process.env.SECRET)
            
            req.user = payload;

            return next()
        }
     if(!accesstoken){   
        const payload = jwt.verify(refresh_token, process.env.SECRET);
        
        const existingToken = await Token.findOne({
            admin: payload.tokenUser.userId,
            // refreshToken: payload.refresh_token
        });
        
        if(!existingToken){
            return res.status(401).json({msg:"Authentication failed. Please login again!"})
        }
        const accessToken = jwt.sign(payload, process.env.SECRET);
        
        // res.json({accessToken})
        req.user = payload.tokenUser;

        

        next()
        
    }   
    } catch (error) {
        console.log(error)
        return res.status(402).json({msg:"Authentication failed. Please login again!"})

        // throw new UnauthenticatedApiError("Authentication Failed. Please login again!")
    }
}


module.exports = authMiddleware;