const {sendEmail} = require('../utils/sendEmailConfig');


const sendWithdrawalEmail = async({email,transactionId,amount,payableAmount}) =>{

    
    const message = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
    
    </head>
    <!-- Withdrawal mail-->
    <body style="background: linear-gradient(90deg, hsla(30, 11%, 4%, 1) 0%, hsla(0, 0%, 0%, 1) 100%);">
     
    
        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
            style="margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; margin-top: 1rem; background-image: url('https://i.ibb.co/c26qdh4/image.png'); background-size: cover; background-repeat: no-repeat; background-position: center center; background-attachment: fixed;">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="">
                        <tr>
                            <td align="center">
                                <!-- comp-name -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                                    style="width: 100%; margin-bottom: 2rem;">
                                    <tr>
                                        <td>
                                            <h2
                                                style="color: green; text-align: start; font-size: 22px; font-weight: 600; line-height: 22px; margin-top: 0;">
                                                Neoprotocol</h2>
                                        </td>
                                    </tr>
                                </table>
    
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                    <tr>
                                        <td
                                            style="width: 80px; height: 80px; background-color: black; border-radius: 50%; border: 2px solid green; margin-bottom: 20px;">
                                            <a href="#">
                                                <img style="display: block; width: 100%; height: auto;"
                                                    src="https://i.ibb.co/3SfyXhY/neo-logo.png" alt="neo-logo" border="0">
                                            </a>
                                        </td>
                                    </tr>
                                </table>
                                <!-- Email Content -->
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0"
                                    style="margin-bottom: 1rem;">
                                    <tr>
                                        <td>
                                            <h1
                                                style="text-align: center; font-size: 20px; font-weight: 600; line-height: 20px; margin-bottom: 1rem; color: green;">
                                                WITHDRAWAL</h1>
                                            <hr style="color: #a06cd5;">
                                            <h2
                                                style="color: #fff; text-align: start; font-size: 20px; font-weight: 600; line-height: 20px; margin-bottom: 2rem;">
                                                Hello ${email},</h2>
                                            <p
                                                style="color: #fff; text-align: start; font-size: 15px; line-height: 1.5x; margin-bottom: 1rem;">
                                                We are delighted to inform you that your withdrawal request has been
                                                processed successfully.</p>
                                        </td>
                                    </tr>
                                </table>
    
                                <!-- Deposit Table -->
                                <h1
                                    style="text-align: center; font-size: 16px; font-weight: 600; line-height: 16px; margin-bottom: 1rem; color: green;">
                                    Transaction-Details
                                </h1>
                                <table role="presentation" cellspacing="0" cellpadding="0" border="1"
                                    style="width: 100%; border-collapse: collapse; margin-bottom: 1rem; color: #fff;">
                                    <thead>
                                        <tr>
                                            <th style="padding: 8px;">Tx-Id </th>
                                            <th style="padding: 8px;">Amount</th>
                                            <th style="padding: 8px;">Tax</th>
                                            <th style="padding: 8px;">Net-Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        
                                        <tr>
                                            <td style="padding: 8px; overflow: hidden;">${transactionId}</td>
                                            <td style="padding: 8px;">${amount}</td>
                                            <td style="padding: 8px;">5%</td>
                                            <td style="padding: 8px;">${payableAmount}</td>
                                        </tr>
                                        <!-- Add more rows as needed -->
                                    </tbody>
                                </table>
    
    
                                <!-- Signature -->
                                <p
                                    style="color: #fff; text-align: start; font-size: 14px; line-height: 14px; margin-bottom: 10px;">
                                    With Love,</p>
                                <h2
                                    style="color: green; text-align: start; font-size: 20px; font-weight: 600; line-height: 20px; margin-top: 0;">
                                    Neo Team.</h2>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    
    </html>
    
    `;

    return sendEmail({
        to: email,
        subject: `Withdrawal request processed - Transaction ID: ${transactionId}`,
        html: message
    });
}


module.exports = sendWithdrawalEmail;