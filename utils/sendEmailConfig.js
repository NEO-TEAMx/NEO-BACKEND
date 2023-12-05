const nodemailer = require("nodemailer");
const nodemailerConfig = require("../config/nodemailer.config");


const sendEmail = ({to,subject,html}) =>{

    const transportter = nodemailer.createTransport(nodemailerConfig)

    
    return transportter.sendMail({
        from: 'Neo coin',
        to,
        subject,
        html,
    });
};

module.exports = sendEmail;