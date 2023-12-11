const {attachCookieToRes,isTokenValid } = require("../../utils/jwt");
const {UnauthenticatedApiError} = require("../../Errors/index");
const Utoken = require("../../models/token.model/uToken");


const userAuthMiddleware = async(req,res,next) =>{

    const {access_token,refresh_token} = req.signedCookies;

    // console.log(access_token)
    try {
        
        

        if(access_token){
            const payload = isTokenValid(access_token)
            req.user = payload.user;
            return next()
        }

        const payload = isTokenValid(refresh_token);
    //    console.log(payload)

        const existingToken = await Utoken.findOne({
            user: payload.user.userId,
            refresh_token: payload.refreshToken
        });
        // console.log(existingToken)


        if(!existingToken){
            return res.status(401).json({msg:"Authentication failed. Please login again!"})
            // throw new UnauthenticatedApiError("Authentication failed. Please login again!")
        }
        attachCookieToRes({
            res, 
            user:payload.user,
            refreshToken:existingToken.refresh_token
        })
        
        req.user = payload.user;
        next();

    } catch (error) {
        // console.log(error)
        throw new UnauthenticatedApiError("Authentication Failed. Please login again!")
    }
}


module.exports = userAuthMiddleware;