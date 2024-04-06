const {sendEmail} =  require("../utils/sendEmailConfig");


const SendNewsLetterMail = async({email}) =>{
    const message = `
    
    
    
    
    `;


    return sendEmail({
        to: email,
        subject: "News Letter Subscription",
        html: message
    });
}

module.exports = SendNewsLetterMail;