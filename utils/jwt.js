const jwt = require("jsonwebtoken");


const createJwt = ({payload}) =>{
    const token = jwt.sign(payload, process.env.SECRET,)
    return token;
}

const verifyToken = (token) => {
  const verifyT =  jwt.verify(token, process.env.SECRET,{algorithms:'Rs256'},(err,decoded)=>{
    if(err){
        err = {
            name: 'JsonWebTokenError',
            message: 'Invalid Token'
        },
        err = {
            name: 'TokenExpiredError',
            message: 'Token is expired'
        }
    }
  })
    return verifyT;
}

const jwtToken = ({payload}) =>{
    return jwt.sign(payload, process.env.SECRET, {algorithm:'RS256',expiresIn:'200d'}, (err,token)=>{
        if(err){
            console.log(err)
        }
        console.log(token)
        return token
    });
}

const attachCookieToRes = ({res,user,refreshToken}) =>{
    const accessTokenDuration = 1000 * 60 * 60 * 24 * 70;
    const reefreahTokenDuration = 1000 * 60 * 60 * 24 * 120;

    const accessTokenVal = jwtToken({payload: {user}});
    const refreshTokenVal = jwtToken({payload: {user, refreshToken}});

    res.cookie('access_token', accessTokenVal,{
        expires: new Date(Date.now + accessTokenDuration),
        signed: true,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    });

    res.cookie('refresh_token', refreshTokenVal, {
        expires: new Date(Date.now + reefreahTokenDuration),
        signed: true,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    });
}

module.exports = {createJwt, verifyToken, jwtToken, attachCookieToRes}