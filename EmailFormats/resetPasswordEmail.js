const {sendEmail} = require('../utils/sendEmailConfig');


const sendResetPaasswordEmail = async({username,email,token,origin}) =>{

    const resetURl = `${origin}/html/new-password.html?token=${token}&email=${email}`
    const message = `

    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password-reset</title>
    </head>
    
    <body style="background: #202124; box-sizing: border-box; padding: 0; margin: 0;">
    
        <div class="container p-5">
            <div class="flex" style="display: flex; justify-content: space-between;">
                <div>
                    <h2 style="color: #28a745; font-family: 'Times New Roman', Times, serif; font-size: 18px;">Neoprotocol</h2>
                </div>
            </div>
    
            <div class="hold" style="display: flex; align-items: center; justify-content: center;">
                <div class="img-container" style="width: 200px; height: 200px; background-color: transparent; border-radius: 50%; overflow: hidden;">
                    <img src="./assets/NEO LOGO P.png" alt="" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
            </div>
    
            <div class="write-up" style="margin-top: 2rem;">
                <h2 style="color:#fff; font-size:16px; font-weight:700; margin-bottom:16px;">Hello ${username},</h2>
                <p style="font-size:14px; color:#fff; font-weight:400; margin-top:10px; margin-bottom:20px;">
                    No worries, Click the button below to reset and choose a new password.
                </p>
                <button style=" border: 1px solid #28a745 !important;" class="btn text-success btn-border-danger mb-3" >
                    <a href="${resetURl}"></a>
                </button>
            </div>
           
    
            <div>
                <p style="font-size:14px; color:#fff; font-weight:400; margin-bottom:10px;">With Love,</p>
                <p style="font-size:16px; color:#fff; font-weight:600; margin-bottom:2rem;">The Neo Team</p>
            </div>
    
            <table role="presentation" style="width:100%; min-width:100%; border-radius:6px; border:2px solid transparent;">
                <tbody>
                    <tr>
                        <td style="font-size:0; text-align:start;">
                            <div style="font-size:14px; line-height:1.5rem;">
                                <p style="margin-top: 12px;">
                                    <a style="color:#ff5663; text-decoration:underline;" rel="noreferrer">Unsubscribe</a>
                                </p>
                            </div>
                        </td>
                        <td>
                            <p style="font-size:12px; line-height:1.5rem; color:#fff; margin-top:0px; text-align:right; margin-bottom:0px;">
                                Copyright © Neoprotocol
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    
        <!-- External CSS and JS Libraries -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <script src="https://kit.fontawesome.com/9a3c5f73a5"></script>
    
        <!-- Media query for smaller screens -->
        <style>
            @media screen and (max-width: 768px) {
                .img-container {
                    margin-top: 2rem;
                    width: 120px;
                    height: 120px;
                    background-color: transparent;
                    border-radius: 50%;
                    overflow: hidden;
                    /* Ensure the image stays within the container */
                }
    
                .follow-us a {
                    width: 30px;
                    height: 30px;
                    padding: 5px;
                }
    
                .follow-us a i {
                    font-size: 12px;
                }
    
                .reshape {
                    font-size: 22px;
                }
            }
        </style>
    
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