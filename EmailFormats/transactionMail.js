const {sendEmail, sendMail} = require('../utils/sendEmailConfig');


const sendWithdrawalEmail = async({email,transactionId,amount,payableAmount}) =>{

    
    const message = `
        <div>
            <p>We are pleased to inform you that your withdrawal request has been successfully processed.</p>
            <h5>Transaction Details:</h5>
            <ul>
                <li>Transaction ID: ${transactionId}</li>
                <li>Amount: ${amount}</li>
                <li>Tax: 5%</li>
                <li>Payable amount: ${payableAmount}</li>
            </ul>
            <p>
                If you have any concerns or further inquiries, feel free to reach out to our support team.
            </p>
        </div>
        
    `;

    return sendEmail({
        to: email,
        subject: `Withdrawal request processed - Transaction ID: ${transactionId}`,
        html: `<div>
            <h4>Hello, ${email}</h4>
            <br/>
            ${message}
            <p>Regards, Neo team.</P>
        </div>
        ` 
    });
}


module.exports = sendWithdrawalEmail;