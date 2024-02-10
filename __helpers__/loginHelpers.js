const {BadRequestApiError,UnauthenticatedApiError} = require("../Errors/index");
const {attachCookieToRes } = require("../utils/jwt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken")

function helperLogin(arg,tk,res){
    if(arg){
        const {isValid} = arg;
        if(!isValid){
            throw new UnauthenticatedApiError('Temporarily prohibited from the site');
        }
        refresh_token = arg.refresh_token;
        attachCookieToRes({res, user:tk, refreshToken:refresh_token});
    
        return res.status(200).json({success:true, user: tk});
        
    }
}

async function usernameLogin (isUsernameExist,refresh_token,password,Utoken,res,req){
    try {
        
            const isPasswordCorrect = await isUsernameExist.comparePassword(password)
            if(!isPasswordCorrect){
              return res.status(400).json({success:false, msg:"Invalid credential(s)"})
            }
            const tokenUser = {
                userId: isUsernameExist._id,
                username: isUsernameExist.username,
                email: isUsernameExist.email,
                role: isUsernameExist.role,
                referral_link: isUsernameExist.referral_link
            }
            const existingToken = await Utoken.findOne({user:isUsernameExist._id});
            // helperLogin(existingToken,tokenUser,res);
            if(existingToken) {
                refresh_token = existingToken.refresh_token;
                // attachCookieToRes({res, user:tokenUser, refreshToken:refresh_token});
                const accessToken = jwt.sign(tokenUser, process.env.SECRET,{expiresIn:'2d'});
                const refreshToken = jwt.sign({tokenUser,refresh_token}, process.env.SECRET,{expiresIn:'30d'});
                const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30;

                return res
                    .cookie('refresh_token', refreshToken,{
                        httpOnly:true,
                        expires: new Date(Date.now() + refreshTokenDuration),
                        // secure: process.env.NODE_ENV === 'production',
                        secure: true,
                        SameSite: 'None'
                        // httpOnly:true,expires: new Date(Date.now() + refreshTokenDuration)
                    })
                    .header('Authorization', accessToken).send(tokenUser)             

                // return res.status(200).json({success:true, user: tokenUser,  accessToken, refreshToken});
            }
            refresh_token = crypto.randomBytes(40).toString("hex")
            const userAgent = req.headers["user-agent"]
            const ip = req.ip;
            const userToken = {
                refresh_token,
                userAgent,
                ip,
                user:isUsernameExist._id
            }
            await Utoken.create(userToken);
            
            const accessToken = jwt.sign(tokenUser, process.env.SECRET,{expiresIn:'2d'});
            const refreshToken = jwt.sign({tokenUser, refresh_token}, process.env.SECRET,{expiresIn:'30d'});
            const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30;



            // attachCookieToRes({res,user:tokenUser,refreshToken:refresh_token});
            // return res.status(200).json({success:true, user: tokenUser, accessToken, refreshToken}); 
            return res
                .cookie('refresh_token', refreshToken,{
                    httpOnly:true,
                    expires: new Date(Date.now() + refreshTokenDuration),
                    // secure: process.env.NODE_ENV === 'production',
                    secure: true,
                    SameSite: 'None'
                    // httpOnly:true,expires: new Date(Date.now() + refreshTokenDuration)
                })
                .header('Authorization', accessToken).send(tokenUser)
        
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, msg:"Invalid credential(s)"})
    }
}

async function emailLogin(isEmailExist,refresh_token,password,Utoken,res,req){
    try {
        
            const isPasswordCorrect = await isEmailExist.comparePassword(password)
            if(!isPasswordCorrect){
               return res.status(400).json({success:false, msg:"Invalid credential(s)"})
            }
            const tokenUser = {
                userId: isEmailExist._id,
                username: isEmailExist.username,
                email: isEmailExist.email,
                role: isEmailExist.role,
                referral_link: isEmailExist.referral_link
            }
            const existingToken = await Utoken.findOne({user:isEmailExist._id});
            // helperLogin(existingToken,tokenUser,res);
            if(existingToken) {
                refresh_token = existingToken.refresh_token;

                const accessToken = jwt.sign(tokenUser, process.env.SECRET,{expiresIn:'2d'});
                const refreshToken = jwt.sign({tokenUser, refresh_token}, process.env.SECRET,{expiresIn:'30d'});
                const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30;
                // attachCookieToRes({res, user:tokenUser, refreshToken:refresh_token}); 
                // return res.status(200).json({success:true, user: tokenUser, accessToken, refreshToken});
                return res
                    .cookie('refresh_token', refreshToken,{
                        httpOnly:true,
                        expires: new Date(Date.now() + refreshTokenDuration),
                        // secure: process.env.NODE_ENV === 'production',
                        secure: true,
                        SameSite: 'None'
                        // httpOnly:true,expires: new Date(Date.now() + refreshTokenDuration)
                    })
                    .header('Authorization', accessToken).send(tokenUser)

            }
            refresh_token = crypto.randomBytes(40).toString("hex");
            const userAgent = req.headers["user-agent"]
            const ip = req.ip;
            const userToken = {
                refresh_token,
                userAgent,
                ip,
                user: isEmailExist._id
            }
            await Utoken.create(userToken);

            const accessToken = jwt.sign(tokenUser, process.env.SECRET,{expiresIn:'2d'});
            const refreshToken = jwt.sign({tokenUser, refresh_token}, process.env.SECRET,{expiresIn:'30d'});
            const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30;
            // attachCookieToRes({res,user:tokenUser,refreshToken:refresh_token});

            return res
                .cookie('refresh_token', refreshToken,{
                    // httpOnly:true,
                    httpOnly:true,
                    expires: new Date(Date.now() + refreshTokenDuration),
                    // secure: process.env.NODE_ENV === 'production',
                    secure: true,
                    SameSite: 'None'
                    // expires: new Date(Date.now() + refreshTokenDuration)
                })
                .header('Authorization', accessToken).send(tokenUser)
            
            // return res.status(200).json({success:true, user: tokenUser, accessToken, refreshToken,}); 
         
    } catch (error) {
        console.log(error)
        res.status(400).json({success:false, msg:"Invalid credential(s)"})
    }
      
    
}
module.exports = {helperLogin, usernameLogin, emailLogin}