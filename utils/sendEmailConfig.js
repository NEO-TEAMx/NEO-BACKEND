const nodemailer = require("nodemailer");
const nodemailerConfig = require("../config/nodemailer.config");
const sgMail = require("@sendgrid/mail");

const sendEmail = ({to,subject,html}) =>{

    const transportter = nodemailer.createTransport(nodemailerConfig)

    
    return transportter.sendMail({
        from: 'Neo coin',
        to,
        subject,
        html,
    });
};

const sendMail = ({to,subject,html}) =>{
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        from: 'Neo coin',
        to,
        subject,
        html,
    }
    sgMail.send(msg).then(() =>{console.log("Email sent")}).catch((error) =>{
        console.log(error)
    });
}

module.exports = {sendEmail, sendMail};