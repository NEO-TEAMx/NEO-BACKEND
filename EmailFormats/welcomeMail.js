const {sendEmail} = require("../utils/sendEmailConfig");


const sendCeoMail = async({username, email}) =>{

    const  message = `

    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email</title>
    
        <style>
            @media screen and (max-width: 320px) {
                .container {
                    max-width: 100%;
                    padding: 10px !important;
                }
                .logo {
                    width: 60px;
                    height: 60px;
                }
                .contents {
                    margin: 0;
                }
                .image {
                    width: 300px !important;
                    height: 150px !important;
                }
                .btn {
                    padding: 8px 16px;
                    font-size: 14px;
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
    
    <body style="background: linear-gradient(
        90deg,
        hsla(30, 11%, 4%, 1) 0%,
        hsla(0, 0%, 0%, 1) 100%
      );
      ">
      <div style="background-image: url('https://i.ibb.co/c26qdh4/image.png'); background-size: cover; background-repeat: no-repeat; background-position: center center; background-attachment: fixed;">
        <div class="container" style="max-width: 600px; height: 100%; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; margin-top: 1rem;">
            <!-- Logo -->
            <div style="width: 80px; height: 80px; background-color: black; border-radius: 50%; border: 2px solid green; margin-bottom: 20px;">
                <a href="">
                    <img style="width: 100%; height: 100%;" src="https://i.ibb.co/3SfyXhY/neo-logo.png" alt="neo-logo" border="0">
                </a>
            </div>
            <div class="contents">
                <!-- Email Content -->
                <h1 style="color: #e2cfea; text-align: center; font-size: 24px; font-weight: 600; line-height: 24px; margin-bottom: 1rem; color: green;">Welcome to Neo-Protocol</h1>
                <p class="arrow" style="color: #e2cfea; text-align: center; font-size: 14px; line-height: 14px; margin-bottom: 2rem;">«Leading the Way with Innovative Mining Technologies»</p>
                <hr style="color: #a06cd5;">
    
                <h2 style="color: #e2cfea; text-align: start; font-size: 20px; font-weight: 600; line-height: 20px; margin-bottom: 2rem;">Hi Tuga,</h2>
                <p style="color: #e2cfea; text-align: start; font-size: 16px; line-height: 18px; margin-bottom: 1rem;">Your account has been successfully created. Sign in to your account to create new designs, be inspired by our templates and solve problems</p>
            </div>
            <div class="image" style="width: 380px; height: 200px; margin-top: 10px; margin-bottom: 2rem;">
                <a href=""><img style="width: 100%; height: 100%; border-radius: 12px;" src="https://i.ibb.co/x7GFfG2/neo-hero.jpg" alt="neo-hero" border="0"></a><br /><a target='_blank' href='https://imgbb.com/'></a><br />
            </div>
            <a style="align-self: center; display: inline-block; padding: 10px 20px; background-color: green; color: #fff; text-decoration: none; border-radius: 5px; font-size: 16px;" href="https://example.com" class="btn">Sign in now</a>
        </div>
        <p class="arrow" style="color: #e2cfea; text-align: start; font-size: 14px; line-height: 14px; margin-bottom: px;">With Love,</p>
        <h2 style="color: green; text-align: start; font-size: 20px; font-weight: 600; line-height: 20px;">Neo Team.</h2>
      </div>
    
    
    </body>
    
    </html>
    
    
    `;

    return sendEmail({
        to: email,
        subject: "Welcome to Neo cloud mining - Let's mine together",
        html: message
    });
}

module.exports = sendCeoMail;