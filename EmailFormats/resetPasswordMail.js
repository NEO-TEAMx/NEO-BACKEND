const {sendEmail, sendMail} = require('../utils/sendEmailConfig');


const sendResetPaasswordEmail = async({username,email,token,origin}) =>{

    const resetURl = `${origin}/html/new-password.html?token=${token}&email=${email}`
    const message = `
        <p>Please reset password by clicking on the following link below:
        <br/> 
        <a href='${resetURl}'>Reset Password</a></p>
    `;

    return sendEmail({
        to: email,
        subject: 'Reset Password',
        html: `<div>
            <h3>Hello ${username},</h3>
            <br/>
            <p>A request has been made to reset the password to your Neo cloud mining account.</p>
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