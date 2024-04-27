const {sendEmail} = require('../utils/sendEmailConfig');


const sendResetPaasswordEmail = async({username,email,token,origin}) =>{

    const resetURl = `${origin}/html/new-password.html?token=${token}&email=${email}`
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
<!-- password reset mail-->
<body style="background: linear-gradient(
    90deg,
    hsla(30, 11%, 4%, 1) 0%,
    hsla(0, 0%, 0%, 1) 100%
  );">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" style=" margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; margin-top: 1rem; background-image: url('https://i.ibb.co/c26qdh4/image.png'); background-size: cover; background-repeat: no-repeat; background-position: center center; background-attachment: fixed;">
        <tr >
            <td align="center"style="padding: 40px 0;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="">
                    <tr>
                        <td align="center">
                            <!-- comp-name -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%; margin-bottom: 2rem;">
                                <tr>
                                    <td>
                                     <h2 style="color: green; text-align: start; font-size: 22px; font-weight: 600; line-height: 22px; margin-top: 0;">Neoprotocol</h2>
                                    </td>
                                </tr>
                            </table>
                            <!-- Logo -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                <tr>
                                    <td style="width: 200px; height: 200px; background-color: black; border-radius: 50%; border: 2px solid green; margin-bottom: 20px;">
                                        <a href="#">
                                            <img style="display: block; width: 100%; height: auto;" src="https://i.ibb.co/897hvhx/NEO-LOGO-P.png" alt="neo-logo" border="0">
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <!-- Email Content -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 1rem;">
                                <tr>
                                    <td>
                                        <h2 style="color: #fff; text-align: start; font-size: 20px; font-weight: 600; line-height: 20px; margin-bottom: 2rem;">Hello ${username},</h2>
                                        <p style="color: #fff; text-align: start; font-size: 16px; line-height: 1.5; margin-bottom: 1rem;">No worries, Click the button below to reset and choose a new password.</p>
                                    </td>
                                </tr>
                            </table>
                    
                            <!-- Button -->
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-bottom: 1rem;">
                                <tr>
                                    <td align="center">
                                        <a href="${resetURl}" style="display: inline-block; padding: 10px 20px; background-color: transparent; border: 1px solid green; color: green; text-decoration: none; border-radius: 5px; font-size: 16px;" class="btn">Reset Password</a>
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 100%;">
                                <tr>
                                    <td>
                                        <p class="arrow" style="color: #fff; text-align: start; font-size: 14px; line-height: 1.5; margin-bottom: 10px; align-self: flex-start;">With Love,</p>
                                        <h2 style="color: green; text-align: start; font-size: 20px; font-weight: 600; line-height: 20px; margin-top: 0;">Neo Team.</h2>
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
        subject: 'Reset Password',
        html: message
    });
}


module.exports = sendResetPaasswordEmail;