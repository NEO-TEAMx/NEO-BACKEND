const {sendEmail} =  require("../utils/sendEmailConfig");


const SendNewsLetterMail = async({email}) =>{
    const message = `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            @media screen and (max-width: 320px) {
                .container {
                    max-width: 100% !important;
                    padding: 10px !important;
                }
    
                .logo {
                    width: 60px !important;
                    height: 60px !important;
                }
    
                .contents {
                    margin: 0 !important;
                }
    
                .image {
                    width: 300px !important;
                    height: 150px !important;
                }
    
                .btn {
                    padding: 8px 16px !important;
                    font-size: 14px !important;
                }
    
                h1 {
                    font-size: 16px !important;
                }
    
                .arrow {
                    font-size: 12px !important;
                }
    
                /* background: #102b3f; */
            }
        </style>
    </head>
    <!-- Newsletter mail-->
    <body style="background: linear-gradient(
        90deg,
        hsla(30, 11%, 4%, 1) 0%,
        hsla(0, 0%, 0%, 1) 100%
      );">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0"
            style=" margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; margin-top: 1rem; background-image: url('https://i.ibb.co/c26qdh4/image.png'); background-size: cover; background-repeat: no-repeat; background-position: center center; background-attachment: fixed;">
            <tr>
                <td align="center" style="padding: 40px 0;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="">
                        <tr>
                            <td align="center">
                                <!-- Logo -->
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
                                                style="text-align: center; font-size: 16px; font-weight: 600; line-height: 16px; margin-bottom: 1rem; color: green;">
                                                Welcome to Our Newsletter!</h1>
                                            <p class="arrow"
                                                style="color: #e2cfea; text-align: center; font-size: 10px; line-height: 10px; margin-bottom: 2rem;">
                                                We are thrilled to welcome you to our newsletter community! 🎉»</p>
                                            <hr style="color: #a06cd5;">
                                            <h2
                                                style="color: #e2cfea; text-align: start; font-size: 20px; font-weight: 600; line-height: 20px; margin-bottom: 2rem;">
                                                Hello ${email},</h2>
                                            <p
                                                style="color: #fff; text-align: start; font-size: 14px; line-height: 1.5; margin-bottom: 1rem;">
                                                Thank you for subscribing and expressing interest in staying updated with
                                                the latest news, promotions, and exciting developments from Neo-Protocol. As
                                                a member of our newsletter, you'll be among the first to know about:</p>
                                            <ul style="list-style-type: disc; padding-left: 20px;">
                                                <li style="font-size: 14px; line-height: 1.5; color: #e2cfea;">Insights into
                                                    mining industry trends</li>
                                                <li style="font-size: 14px; line-height: 1.5; color: #e2cfea;">New Features
                                                    and upgrades</li>
                                                <li style="font-size: 14px; line-height: 1.5; color: #e2cfea;">Helpful tips
                                                    and insights</li>
                                                <li style="font-size: 14px; line-height: 1.5; color: #e2cfea;">Exciting
                                                    events and community updates</li>
                                            </ul>
                                            <p
                                                style="color: #fff; text-align: start; font-size: 14px; line-height: 1.5; margin-bottom: 1rem;">
                                                We value your trust and are committed to delivering valuable content
                                                straight to your inbox. If you ever have any questions, feedback, or
                                                suggestions, feel free to reach out to us at <a
                                                href="mailto:Neoprotocol.help@gmail.com">Neoprotocol.help@gmail.com</a>
                                                Stay tuned for our upcoming newsletter editions and get ready to explore all
                                                that's happening in the world of crypto mining.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            
                                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                    <tr>
                                        <td>
                                            <p class="arrow"
                                                style="color: #fff; text-align: start; font-size: 14px; line-height: 14px; margin-bottom: 10px; align-self: flex-start;">
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
                </td>
            </tr>
        </table>
    </body>
    
    </html>
    
    `;


    return sendEmail({
        to: email,
        subject: "News Letter Subscription",
        html: message
    });
}

module.exports = SendNewsLetterMail;