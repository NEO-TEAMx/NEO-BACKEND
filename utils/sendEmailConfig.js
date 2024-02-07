const nodemailer = require("nodemailer");
const nodemailerConfig = require("../config/nodemailer.config");
const sgMail = require("@sendgrid/mail");

const sendEmail = ({to,subject,html}) =>{

    const transporter = nodemailer.createTransport(nodemailerConfig)

    // transporter.sendMail
    
    return transporter.sendMail({
        from: 'Neo cloud',
        to,
        subject,
        html,
    } , (error, info) =>{
        if(error){
            // console.log(error)
            return null;

            // console.log(error)
        }else{
            // console.log("email sent")
            // console.log(info.response)
            return true
        }
    });
};

const sendMail = ({to,subject,html}) =>{
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        from: 'Neo cloud',
        to,
        subject,
        html,
    }
    sgMail.send(msg).then(() =>{console.log("Email sent")}).catch((error) =>{
        console.log(error)
    });
}

module.exports = {sendEmail, sendMail};