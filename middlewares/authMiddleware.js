const {verifyToken,attachCookieToRes } = require("../utils/jwt");
const {UnauthenticatedApiError} = require("../Errors/index");
const Token = require("../models/token");



const authMiddleware = async(req,res,next) =>{

    const {access_token, refresh_token} = req.signedCookies;

    console.log(access_token)
    try {
        if(access_token){
            const payload = verifyToken(access_token)
            req.user = payload.user;
            return next()
        }

        const payload = verifyToken(refresh_token);
        const existingToken = await Token.findOne({
            user: payload.user.userId,
            refresh_token: payload.refresh_token,
        });

        if(!existingToken || !existingToken?.isValid){
            throw new UnauthenticatedApiError("Authentication failed. Please login again!")
        }
        attachCookieToRes({
            res, 
            user:payload.user,
            refreshToken:existingToken.refresh_token
        })
        
        req.user = payload.user;
        next();

    } catch (error) {
        throw new UnauthenticatedApiError("Authentication Failed. Please login again!")
    }
}


module.exports = authMiddleware;