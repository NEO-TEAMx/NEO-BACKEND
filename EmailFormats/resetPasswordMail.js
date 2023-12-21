const {sendEmail, sendMail} = require('../utils/sendEmailConfig');


const sendResetPaasswordEmail = async({username,email,token,origin}) =>{

    const resetURl = `${origin}/user/reset-password?token=${token}&email=${email}`
    const message = `
        <p>Please reset password by clicking on the following link below:
        <br/> 
        <a href='${resetURl}'>Reset Password</a></p>
    `;

    return sendMail({
        to: email,
        subject: 'Reset Password',
        html: `<div>
            <h3>Hello ${username}</h3>,
            <br/>
            <h5>A request has been made to reset the password to your Neo cloud mining account.</h5>
            ${message}
            <p>If you did not initiate this request, please contact our support team immediately.</p>
            <p>Thank you,</p>
            <br/>
            <p>Neo Team</p>
        </div>    
        ` 
    });
}


module.exports = sendResetPaasswordEmail;