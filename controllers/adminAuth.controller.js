const {StatusCodes} = require("http-status-codes");
const Admin = require("../models/admin.model");
const Token = require("../models/token.model/token");
const {attachCookieToRes} =  require("../utils/jwt");
const {BadRequestApiError, NotFoundApiError} = require("../Errors/index");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const adminSignup = async(req,res) =>{
    const {username,email,password} = req.body;

    const isUsernameAlreadyExist = await Admin.findOne({username});
    const isEmailAlreadyExist = await Admin.findOne({email});
    const limit = (await Admin.countDocuments({}) === 5)

    if(limit){
        throw new BadRequestApiError("You cannot create an admin account currently!! Try again later");
    }

    if(isUsernameAlreadyExist){
        throw new BadRequestApiError("Username already exist. choose another one")
    }

    if(isEmailAlreadyExist){
        throw new BadRequestApiError("Email already exist.")
    }

    if(password.length < 8){
        throw new BadRequestApiError("Password should be at least 8 characters")
    }
    

    const isMainAdmin = (await Admin.countDocuments({})) === 0;
    const isDepositAdmin = (await Admin.countDocuments({})) === 1;
    const isWithdrawalAdmin = (await Admin.countDocuments({})) === 2;
    
    if(isMainAdmin){
        const adminType = 'main-admin';
        const adminId = 'adm39t3v2';
        const admin = await Admin.create({username,email,password,adminType,adminId});
        const tokenUser = { username: admin.username, email: admin.email,userId: admin._id, adminType: admin.adminType,role:admin.role };

        const userAgent = req.headers['user-agent']
        const ip = req.ip
        let refresh_token = crypto.randomBytes(40).toString('hex');
        
        const userToken = {refresh_token,userAgent,ip,admin:admin._id}
        

        await Token.create(userToken)
        // attachCookieToRes({res, user:tokenUser, refreshToken:refresh_token})
        const accessToken = jwt.sign(tokenUser, process.env.SECRET,{expiresIn:'70d'});
        const refreshToken = jwt.sign({tokenUser,refresh_token}, process.env.SECRET,{expiresIn:'30d'});
                
        const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30;

        return res
            .header("refresh_token", refreshToken)
            .header('Authorization', accessToken).send(tokenUser)
        

    //   return  res.status(StatusCodes.OK).json({ success:true, admin: tokenUser });
        
    }else if(isDepositAdmin){
        const adminType = 'deposit-admin';
        const adminId = 'adm6ck9s2';
        const admin = await Admin.create({username,email,password,adminType,adminId});
        const tokenUser = { username: admin.username, email: admin.email,userId: admin._id, adminType: admin.adminType,role:admin.role };

        const userAgent = req.headers['user-agent']
        const ip = req.ip
        let refresh_token = crypto.randomBytes(40).toString('hex');
        
        const userToken = {refresh_token,userAgent,ip,admin:admin._id}
        

        await Token.create(userToken)
        // attachCookieToRes({res, user:tokenUser, refreshToken:refresh_token})
        
        const accessToken = jwt.sign(tokenUser, process.env.SECRET,{expiresIn:'70d'});
        const refreshToken = jwt.sign({tokenUser,refresh_token}, process.env.SECRET,{expiresIn:'30d'});
                
        const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30;

        return res
            .header("refresh_token", refreshToken)
            .header('Authorization', accessToken).send(tokenUser)
        

        // return res
        //     .cookie('refresh_token', refreshToken,{httpOnly:true,expires: new Date(Date.now() + refreshTokenDuration),})
        //     .header('Authorization', accessToken).send(tokenUser)
        


    //   return  res.status(StatusCodes.OK).json({ success:true, admin: tokenUser });
    }else if(isWithdrawalAdmin){
        const adminType = 'withdrawal-admin';
        const adminId = 'adm72n9e1';
        const admin = await Admin.create({username,email,password,adminType,adminId});
        const tokenUser = { username: admin.username, email: admin.email,userId: admin._id, adminType: admin.adminType,role:admin.role };

        const userAgent = req.headers['user-agent']
        const ip = req.ip
        let refresh_token = crypto.randomBytes(40).toString('hex');
        
        const userToken = {refresh_token,userAgent,ip,admin:admin._id}
        

        await Token.create(userToken)
        // attachCookieToRes({res, user:tokenUser, refreshToken:refresh_token})
 
        const accessToken = jwt.sign(tokenUser, process.env.SECRET,{expiresIn:'70d'});
        const refreshToken = jwt.sign({tokenUser,refresh_token}, process.env.SECRET,{expiresIn:'30d'});
                
        const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30;

        return res
            .header("refresh_token", refreshToken)
            .header('Authorization', accessToken).send(tokenUser)
        

        // return res
        //     .cookie('refresh_token', refreshToken,{httpOnly:true,expires: new Date(Date.now() + refreshTokenDuration),})
        //     .header('Authorization', accessToken).send(tokenUser)
        



//       return  res.status(StatusCodes.OK).json({ success:true, admin: tokenUser });
    }else{
        const adminType = 'moderators';
        
        let adminId = 'adm094jf2';
        const u = await Admin.findOne({adminId})
        if(u){
            adminId = 'admf9w3m0';
        }
        
        const admin = await Admin.create({username,email,password,adminType,adminId});
        const tokenUser = { username: admin.username, email: admin.email,userId: admin._id, adminType: admin.adminType,role:admin.role };

        const userAgent = req.headers['user-agent']
        const ip = req.ip
        let refresh_token = crypto.randomBytes(40).toString('hex');
        
        const userToken = {refresh_token,userAgent,ip,admin:admin._id}
        

        await Token.create(userToken)
        // attachCookieToRes({res, user:tokenUser, refreshToken:refresh_token})
   
        const accessToken = jwt.sign(tokenUser, process.env.SECRET,{expiresIn:'70d'});
        const refreshToken = jwt.sign({tokenUser,refresh_token}, process.env.SECRET,{expiresIn:'30d'});
                
        const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30;

        return res
            .header("refresh_token", refreshToken)
            .header('Authorization', accessToken).send(tokenUser)
        

        // return res
        //     .cookie('refresh_token', refreshToken,{httpOnly:true,expires: new Date(Date.now() + refreshTokenDuration),})
        //     .header('Authorization', accessToken).send(tokenUser)
        


    //   return  res.status(StatusCodes.OK).json({ success:true, admin: tokenUser });
    }

   
}


const adminLogin = async(req,res) =>{

    const {username,password,email} = req.body;

    if( !(email&&password)){
        throw new BadRequestApiError("Please provide the needed value(s)")
    }

    const admin = await Admin.findOne({email})

    if(!admin){
        throw new BadRequestApiError("Invalid credentials")
    }
    
    let refresh_token = ''
    const isPasswordCorrect = await admin.comparePassword(password)
    
    if(!isPasswordCorrect){
        throw new BadRequestApiError("Invalid Credential(s)")
    }

    const tokenUser = { username: admin.username, email: admin.email,userId: admin._id, adminType: admin.adminType,role:admin.role};

    const existingToken = await Token.findOne({admin: admin._id});
    if(existingToken){
        const {isValid} = existingToken;
        if(!isValid){
            throw new CustomError.UnauthenticatedError('Temporarily prohibited from the site');
        }
        refresh_token = existingToken.refresh_token;
        const accessToken = jwt.sign(tokenUser, process.env.SECRET,{expiresIn:'70d'});
        const refreshToken = jwt.sign({tokenUser,refresh_token}, process.env.SECRET,{expiresIn:'30d'});
                
        const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30;

        return res
            .cookie('refresh_token', refreshToken,{
                // secure: process.env.NODE_ENV === 'production',
                httpOnly: false,
                secure:false,
                expires: new Date(Date.now() + refreshTokenDuration),
                SameSite: 'None'
            })
            .header('Authorization', accessToken).send(tokenUser)
        // return res
        //     .header("Refresh_token", refreshToken)
        //     .header('Authorization', accessToken).send(tokenUser)
        

       
    }
    refresh_token = crypto.randomBytes(40).toString("hex")

    const userAgent = req.headers['user-agent']
    const ip = req.ip;
    const userToken = {refresh_token,userAgent,ip,admin:admin._id};
    
    await Token.create(userToken);
    // attachCookiesToResponse({res, user:tokenUser})
    // attachCookieToRes({res, user:tokenUser, refreshToken:refresh_token});  
    
    const accessToken = jwt.sign(tokenUser, process.env.SECRET,{expiresIn:'70d'});
    const refreshToken = jwt.sign({tokenUser,refresh_token}, process.env.SECRET,{expiresIn:'30d'});
                
    const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30;

    // return res
    //         .header("Refresh_token", refreshToken)
    //         .header('Authorization', accessToken).send(tokenUser)
        

    return res
            .cookie('refresh_token', refreshToken,{
                httpOnly:false,
                expires: new Date(Date.now() + refreshTokenDuration),
                // secure: process.env.NODE_ENV === 'production',
                secure: false,
                SameSite: 'None'
            })
            .header('Authorization', accessToken).send(tokenUser)
        
    


}


const adminUpdatePassword = async(req,res) =>{

    const {oldPassword, newPassword, confirmPassword} = req.body
    // console.log(req.user.userId)
    if(!oldPassword || !newPassword || !confirmPassword){
        throw new BadRequestApiError("Please provide the needed value(s)")
    }
    const admin = await Admin.findOne({_id:req.user.userId})
    const isPasswordCorrect = await admin.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new BadRequestApiError("Please provide the needed value(s)")
    }
    admin.password = newPassword;

    await admin.save();

    return res.status(StatusCodes.OK).json({success:true, msg: 'Success! Password Updated.' });

}


const getAllAdmin = async(req,res) =>{
    const getAll = await Admin.find({}).select('-password');

    return res.status(200).json({success:true, count:getAll.length ,getAll})
}

const deleteAdmin = async(req,res) =>{

    const admin = await Admin.findById(req.params.id);
    if(!admin){
        throw new NotFoundApiError("No admin founf with such id")
    }

    await admin.deleteOne();

    return res.status(200).json({success:true, msg:"Admin deleted suucessfully!!!"})
}

const showCurrentUser = async (req, res) => {
    // console.log(req.signedCookies)
    // console.log(req)
   return res.status(StatusCodes.OK).json({ admin: req.user });
};

module.exports = {
    adminLogin,
    adminSignup,
    adminUpdatePassword,
    getAllAdmin,
    deleteAdmin,
    showCurrentUser,
}