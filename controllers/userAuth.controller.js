const User = require("../models/user.model");
const {BadRequestApiError,NotFoundApiError} = require("../Errors")
const Utoken = require("../models/token.model/uToken");
const crypto = require("crypto");
const { attachCookieToRes } = require("../utils/jwt");
const shortid = require("shortid");
const {StatusCodes} = require("http-status-codes");
const {emailLogin,usernameLogin} = require("../__helpers__/loginHelpers");
const {isPasswordStrong} = require("../__helpers__/isPasswordStrong");
const sendCeoMail = require("../EmailFormats/welcomeEmail");
const sendResetPaasswordEmail = require("../EmailFormats/resetPasswordMail");
const jwt =  require("jsonwebtoken");

const register = async(req,res) =>{
    const {username,email,password,confirmPassword,referralCode} =  req.body;
    // const {referralCode} = req.query;
    const isEmailTaken = await User.findOne({email});
    const isUsernameTaken = await User.findOne({username});
    const genRefCode = shortid.generate();
    const isStrongpassword = isPasswordStrong(password);

    
    // if(referralCode){
    //     const x = await User.findOne({referralCode})
    //     return referringUser = x.username
    // }
    const referringUser = referralCode  ? (await User.findOne({referralCode})) : null;
    const referral_link = `http://localhost:8081/html/signup.html?referralCode=${genRefCode}`

    // const referral_link = `https://neoprotocol.netlify.app/html/signin.html?referralCode=${genRefCode}`

    if(!username||!email||!password||!confirmPassword){
        throw new BadRequestApiError("Please provide the needed value(s)")
    }
    
    if(isEmailTaken){
        throw new BadRequestApiError("Email already registered")
    }

    if(isUsernameTaken){
        throw new BadRequestApiError("Username already taken. Pick another username")
    }
    if(!isStrongpassword){
        throw new BadRequestApiError(
            "Password must contain an uppercase and smallcase letters, a number and a special character"
        )
    }
    if(password !== confirmPassword){
        throw new BadRequestApiError("Password and confirm password does not match!")
    }

    if(password.length < 8){
        throw new BadRequestApiError("Password should be at least 8 characters")
    }
    
    // console.log(referringUser)
    if(!referringUser){
        throw new NotFoundApiError("Referral code does not exist")
    }

    const user = await User.create({
        email,
        username,
        password,
        referralCode: genRefCode,
        referral_link: referral_link,
        referredBy:referringUser,
    });

    const tokenUser = {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        referral_link: user.referral_link,
    };

    const userAgent = req.headers['user-agent']
    const ip = req.ip
    let refresh_token = crypto.randomBytes(40).toString('hex');
        
    const userToken = {refresh_token,userAgent,ip,user:user._id}
        

    await Utoken.create(userToken)
    
    // attachCookieToRes({res, user:tokenUser, refreshToken:refresh_token})

    const accessToken = jwt.sign(tokenUser, process.env.SECRET,{expiresIn:'70d'});
    const refreshToken = jwt.sign({tokenUser,refresh_token}, process.env.SECRET,{expiresIn:'30d'});
                
    const refreshTokenDuration = 1000 * 60 * 60 * 24 * 30;

    // if(referringUser){
    //     // referringUser.hash_rate += 1
    //     referringUser.hash_rate += 2
    //     await referringUser.save();
    // }

    // send email from ceo
    await sendCeoMail({username: username, email:email})

    return res
        .cookie('refresh_token', refreshToken,{httpOnly:true,expires: new Date(Date.now() + refreshTokenDuration),})
        .header('Authorization', accessToken).send(tokenUser)
        
    
    // return res.status(200).json({success:true, msg: "User have successfully registered", user:tokenUser, accessToken, refreshToken })
}

const login = async(req,res) =>{
    const {username, email, password} = req.body;
    if((!username || !password) && (!email || !password)){
        throw new BadRequestApiError("Please provide the needed value(s)")
    }

    const isUsernameExist = await User.findOne({username});
    const isEmailExist = await User.findOne({email});
    let refresh_token = '';

    if((!isUsernameExist) && (!isEmailExist)){
         throw new BadRequestApiError("Invalid credential(s)")
    }

    if(isEmailExist){
        return emailLogin(isEmailExist,refresh_token,password,Utoken,res,req);
    }else if(isUsernameExist){
        return usernameLogin(isUsernameExist,refresh_token,password,Utoken,res,req);
    }
    

}

const logout = async(req,res) =>{

    await Utoken.findOneAndDelete({user: req.user.userId})

    
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

      const origin = 'https://neoprotocol.netlify.app'
     
        await sendResetPaasswordEmail({
            username: user.username,
            email: user.email,
            token: passwordToken,
            origin,
        })

        const tenMins = 1000 * 60 * 10;
        const passwordTokenExpirationDate = new Date(Date.now() + tenMins);

        const hashString = (string) =>{
            crypto.createHash('md5').update(string).digest('hex');
        }
        
      
        user.passwordToken = hashString(passwordToken);
        user.passwordTokenExpirationDate = passwordTokenExpirationDate
  
        await user.save();
        //   res.status(201).json({user:user, passwordToken})
        //   console.log(user)
    }
    // console.log(user)
    res.status(200).json({msg: `Please check your email for rest password link`});
}

const resetPassword = async(req,res) =>{
  
    const {token,email,password,confirmPassword} = req.body;
    const isStrongPassword = isPasswordStrong(password);
    const isStrongConfirmPassword = isPasswordStrong(confirmPassword)

    if(!token || !email || !password || confirmPassword){
      throw new BadRequestApiError('Please provide needed value(s)')
    }
    
    if(!isStrongConfirmPassword || isStrongPassword){
        throw new BadRequestApiError("Password must contain an uppercase and smallcase letters, a number and a special character")
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
    const {oldPassword, newPassword, confirmPassword} = req.body;
    const isStrongPassword = isPasswordStrong(password);
    const isStrongConfirmPassword = isPasswordStrong(confirmPassword)
    
    // console.log(req.user.userId)
    if(!oldPassword || !newPassword || !confirmPassword){
        throw new BadRequestApiError("Please provide the needed value(s")
    }
    if(!isStrongPassword||isStrongConfirmPassword){
        throw new BadRequestApiError(
            "Password must contain an uppercase and smallcase letters, a number and a special character"
        )
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

const showMe = async(req,res) =>{
   return res.status(StatusCodes.OK).json({ user: req.user });
}


module.exports = {
    register,
    login,
    logout,
    resetPassword,
    forgetPassword,
    updatePassword,
    showMe
}