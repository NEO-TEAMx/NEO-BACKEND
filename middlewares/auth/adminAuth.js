const {attachCookieToRes,isTokenValid } = require("../../utils/jwt");
const {UnauthenticatedApiError} = require("../../Errors/index");
const Token = require("../../models/token.model/token");


const authMiddleware = async(req,res,next) =>{

    const {access_token,refresh_token} = req.signedCookies;

    // console.log(access_token)
    try {
        
        

        if(access_token){
            const payload = isTokenValid(access_token)
            req.user = payload.user;
            return next()
        }

        const payload = isTokenValid(refresh_token);
        const existingToken = await Token.findOne({
            admin: payload.user.userId,
            // refresh_token: payload.refresh_token
        });
        // console.log(existingToken)


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
        console.log(error)
        // throw new UnauthenticatedApiError("Authentication Failed. Please login again!")
    }
}


module.exports = authMiddleware;