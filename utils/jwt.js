const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
  const token = jwt.sign(payload, process.env.SECRET)
  return token;
};

const isTokenValid = ( token ) => jwt.verify(token, process.env.SECRET);

const attachCookieToRes = ({res,user,refreshToken}) =>{
    const accessTokenDuration = 1000 * 60 * 60 * 24 * 70;
    const refreshTokenDuration = 1000 * 60 * 60 * 24 * 120;

   
    const accessTokenVal = createJWT({payload: {user}});
    const refreshTokenVal = createJWT({payload: {user, refreshToken}})

    res.cookie('access_token', accessTokenVal,{
        expires: new Date(Date.now() + accessTokenDuration),
        signed: true,
        secure: false,
        // secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
    });
    // signed:true,httpOnly:true,secure:false,
    res.cookie('refresh_token', refreshTokenVal, {
        expires: new Date(Date.now() + refreshTokenDuration),
        signed: true,
        sameSite:false,
        // secure: false,
        // httpOnly: false
        // secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        secure: false
    });

    // res.cookie('user', 'username', {
    //     httpOnly: true,
    //     secure: false
    // })
}


module.exports = {attachCookieToRes,isTokenValid}