const User = require("../models/user.model");
const {BadRequestApiError,NotFoundApiError} = require("../Errors")
const Utoken = require("../models/token.model/uToken");
const crypto = require("crypto");
const { attachCookieToRes } = require("../utils/jwt");
const { default: isEmail } = require("validator/lib/isEmail");

const register = async(req,res) =>{
    const {username,email,password,confirmPassword} =  req.body;
    const isEmailTaken = await User.findOne({email});
    const isUsernameTaken = await User.findOne({username});

    if(!username||!email||!password||!confirmPassword){
        throw new BadRequestApiError("Please provide the needed value(s)")
    }

    if(isEmailTaken){
        throw new BadRequestApiError("Email already registered")
    }

    if(isUsernameTaken){
        throw new BadRequestApiError("Username already taken. Pick another username")
    }

    if(password !== confirmPassword){
        throw new BadRequestApiError("Password and confirm password does not match!")
    }

    if(password.length < 8){
        throw new BadRequestApiError("Password should be at least 8 characters")
    }

    const user = await User.create({});

    const tokenUser = {
        username: user.username,
        email: user.email,
        role: user.role,
        referral_link: user.referral_link,
    };

    const userAgent = req.headers['user-agent']
    const ip = req.ip
    let refresh_token = crypto.randomBytes(40).toString('hex');
        
    const userToken = {refresh_token,userAgent,ip,admin:admin._id}
        

    await Utoken.create(userToken)
    
    attachCookieToRes({res, user:tokenUser, refreshToken:refresh_token})
    
    // send email from ceo

    return res.status(200).json({success:true, msg: "User have successfully registered", user:tokenUser })
}

function helper(arg,tk,res){
    if(arg){
        const {isValid} = arg;
        if(!isValid){
            throw new CustomError.UnauthenticatedError('Temporarily prohibited from the site');
        }
        refresh_token = arg.refresh_token;
        attachCookieToRes({res, user:tk, refreshToken:refresh_token});
    
        res.status(200).json({success:true, user: tk});
        return;
    }
}

const login = async(req,res) =>{
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        throw new BadRequestApiError("Please provide the needed value(s)")
    }

    const isUsernameExist = await User.findOne({username});
    const isEmailExist = await User.findOne({email});
    let refresh_token = '';

    if(!isUsernameExist || !isEmailExist){
        throw new BadRequestApiError("Please provide the correct username or email")
    }

    if(isUsernameExist){
        const isPasswordCorrect = await isUsernameExist.comparePassword(password)
        if(!isPasswordCorrect){
            throw new BadRequestApiError("Invalid credential(s)")
        }
        const tokenUser = {
            username: isUsernameExist.username,
            email: isUsernameExist.email,
            role: isUsernameExist.role,
            referral_link: isUsernameExist.referral_link
        }
        const existingToken = await Utoken.findOne({user:isUsernameExist._id});
        helper(existingToken,tokenUser,res);
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
        attachCookieToRes({res,user:tokenUser,refreshToken:refresh_token});
        return res.status(200).json({success:true, user: tokenUser}); 
    }

    if(isEmailExist){
        const isPasswordCorrect = await isEmailExist.comparePassword(password)
        if(!isPasswordCorrect){
            throw new BadRequestApiError("Invalid credential(s)")
        }
        const tokenUser = {
            username: isEmailExist.username,
            email: isEmailExist.email,
            role: isEmailExist.role,
            referral_link: isEmailExist.referral_link
        }
        const existingToken = await Utoken.findOne({user:isEmailExist._id});
        helper(existingToken,tokenUser,res);
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
        attachCookieToRes({res,user:tokenUser,refreshToken:refresh_token})
        return res.status(200).json({success:true, user: tokenUser}); 
    }

}

const logout = async(req,res) =>{

    await Utoken.findOneAndDelete({user: req.user.userId})

    res.cookie('access_token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });

    res.cookie('refresh_token', 'logout', {
        httpOnly: true,
        expires: new Date(Date.now()),
    });

  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
}

const forgetPassword = async(req,res) =>{
    const {email} = req.body;
  
    if(!email){
      throw new BadRequestApiError('Please provide valid email')
    }
  
    const user = await User.findOne({email});
  
    if(user){
      const passwordToken = crypto.randomBytes(70).toString('hex');
  
      // send forgot password link email

      // const origin = 'http://localhost:3000'
      // await sendResetPaassword({
      //   name: user.name,
      //   email: user.email,
      //   token: passwordToken,
      //   origin,
      // });
  
      const tenMins = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMins);
      
      user.passwordToken = createHash(passwordToken)
      user.passwordTokenExpirationDate = passwordTokenExpirationDate
  
      await user.save();
      res.status(201).json({user:user, passwordToken})
    //   console.log(user)
    }
    // console.log(user)
    // res.status(200).json({msg: `Please check your email for rest password link`});
}

const resetPassword = async(req,res) =>{
  
    const {token,email,password,confirmPassword} = req.body;
  
    if(!token || !email || !password || confirmPassword){
      throw new BadRequestApiError('Please provide needed value(s)')
    }
  
    if(password !== confirmPassword){
        throw new BadRequestApiError("Password and confrim password are not the same")
    }

    const user = await User.findOne({email});
    if(user){
      const currentDate = new Date();
  
      if(
        user.passwordToken === createHash(token) && 
        user.passwordTokenExpirationDate > currentDate
        )
      {
        user.password = password
        user.passwordToken = null,
        user.passwordTokenExpirationDate = null,
  
        await user.save();
        res.status(201).json({msg: 'Password successfully reseted'})
      }
    }  
  
}

const updatePassword = async(req,res) =>{

    const {oldPassword, newPassword, confirmPassword} = req.body
    // console.log(req.user.userId)
    if(!oldPassword || !newPassword || !confirmPassword){
        throw new BadRequestApiError("Please provide the needed value(s")
    }
    const user = await User.findOne({_id:req.user.userId})
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
        throw new BadRequestApiError('Invalid Credentials');
    }
    user.password = newPassword;

    await user.save();

    return res.status(StatusCodes.OK).json({success:true, msg: 'Success! Password Updated.' });

}

module.exports = {
    register,
    login,
    logout,
    resetPassword,
    forgetPassword,
    updatePassword
}