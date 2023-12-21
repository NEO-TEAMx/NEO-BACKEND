const {sendEmail, sendMail} = require('../utils/sendEmailConfig');


const sendDepositEmail = async({email,transactionId,amount}) =>{

    
    const message = `
        <p>
            You have made a deposit transaction of ${amount} with the transactionId ${transactionId}, has been processed.
            If you have any question or concerns regarding this transaction, please contact our support team.
            <br/>
            Best regards,
        </p>
        <br/>
        <a href="">Neo support team<a>
        
    `;

    return sendEmail({
        to: email,
        subject: 'Deposit request',
        html: `<div>
            <h4>Hello, ${username}</h4>
            <br/>
            ${message}
            <p>Regards, Neo team.</P>
        </div>
        ` 
    });
}


module.exports = sendDepositEmail;