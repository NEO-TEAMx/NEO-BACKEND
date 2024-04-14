const {sendEmail} = require("../utils/sendEmailConfig");


const sendCeoMail = async({username, email}) =>{

    const  message = `

    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <script src="https://kit.fontawesome.com/9a3c5f73a5.js" crossorigin="anonymous"></script>
        <style>
            body {
                background: #202124;
                /* background: #f6f8fd; */
            }
    
            h2 {
                font-family: 'Times New Roman', Times, serif;
            }
    
            .flex {
                display: flex;
                justify-content: space-between;
            }
    
            .img-container {
                overflow: hidden;
                width: 120px;
                height: 120px;
                border: 2px solid green;
                border-radius: 50%;
                background: black
            }
    
            .img-container img {
                width: 100%;
                height: auto;
                image-rendering: pixelated;
            }
    
            .center-img {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 5rem;
            }
    
            .hold {
                text-align: center;
            }
    
    
            .hold .welcome h2 {
                position: relative;
                top: -45px;
                text-shadow: 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #fff; /* Adjust blur radius values */
                font-weight: 800;
            }
    
            
            .follow-us {
                width: 100%;
                height: 100%;
                display: flex;
                align-self: flex-end;
                justify-content: end;
                align-items: end;
            }
    
            .follow-us a {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                width: 50px;
                height: 50px;
                padding: 10px;
                border-radius: 50%;
                background-color: #28a745;
                text-decoration: none;
                margin-left: 10px;
            }
    
            .follow-us a i {
                color: #fff;
                font-size: 20px;
            }
    
            @media screen and (max-width: 768px){
       
            .img-container {
                overflow: hidden;
                width: 100px;
                height: 100px;
                border: 2px solid green;
                border-radius: 50%;
                background: black
            }
    
            .center-img {
                margin-top: 2rem;
            }
    
            .hold .welcome h2 {
                position: relative;
                top: -35px;
            }
    
            .follow-us a {
                display: inline-flex;
                justify-content: center;
                align-items: center;
                width: 30px;
                height: 30px;
                padding: 5px;
                border-radius: 50%;
                background-color: #28a745;
                text-decoration: none;
                margin-left: 10px;
            }
    
            .follow-us a i {
                color: #fff;
                font-size: 12px;
            }
    
            .reshape {
                font-size: 22px;
            }
            }
    
        </style>
    </head>
    
    <body>
        <div class="container p-5">
            <div class="flex">
                <div>
                    <h2 class="text-success">Neoprotocol</h2>
                </div>
            
            </div>
    
            <div class="hold">
                <div class="center-img">
                    <div class="img-container">
                        <img src="./assets/neo-logo.png" alt="">
                    </div>
                </div>
                <div class="welcome">
                    <h2 class="text-success">Welcome to neo</h2>
                </div>
            </div>
    
    
            <div class="write-up">
                <h2 style="color:#fff;font-size:20px;line-height:25px;font-weight:700;padding:0;margin-bottom:16px">
                    Hello ${username},
                </h2>
                <p
                    style="font-size:18px;font-family:DM Sans,'Google Sans',sans-serif;line-height:32px;color:#fff;font-weight:400;margin-top:10px;margin-bottom:32px">
                    Welcome to the crypto mining adventure at Neo cloud mining.
                    <br/>
                    Our team of experts is dedicated to optimizing your mining experience, ensuring seamless operations, and staying ahead of industry trends.        
                </p>
                <p
                    style="font-size:18px;font-family:DM Sans,'Google Sans',sans-serif;line-height:1.6;color:#fff;font-weight:400;margin-top:10px;margin-bottom:32px">
                    Feel free to explore our platform's features and should you have any inquiries or suggestions, our supprt team is readily available to assist you.
                   We value your feedbacks as it plays a crucial role in shaping the evolution of our services.
         
                </p>
                <p
                    style="font-size:18px;font-family:DM Sans,'Google Sans',sans-serif;line-height:1.6;color:#fff;font-weight:400;margin-top:10px;margin-bottom:32px">
                    Thank you for choosing Neo mining. We look forward to a mutually rewarding partnership and achieving new heights in the world of crypto mining.
                   
                </p>
                
            </div>
    
            <div>
    
                <p
                    style="font-size:18px;font-family:'Neue Haas Grotesk Text Pro',DM Sans,'Google Sans',sans-serif;line-height:1.6;color:#fff;font-weight:400;margin-top:24px;margin-bottom:1rem">
                    We are excited to have you onboard.
                </p>
                <p
                    style="font-size:18px;font-family:'Neue Haas Grotesk Text Pro',DM Sans,'Google Sans',sans-serif;line-height:1.6;color:#fff;font-weight:400;margin-top:24px;margin-bottom:1rem">
                    Need help? Kindly reach out to our support
                    team at <br>
                    <a style="text-decoration:none" href="mailto:neo.cloud.mining@gmail.com" rel="noreferrer"
                        target="_blank"><span class="text-success" style="font-weight:700">help@Neo.com</span></a>
                </p>
            </div>
    
            <div>
                <p
                    style="font-size:16px;font-family:DM Sans,'Google Sans',sans-serif;line-height:1.2;color:#fff;font-weight:400;margin-bottom:0.2rem">
                    With Love,
                </p>
                <p
                    style="font-size:16px;font-family:DM Sans,'Google Sans',sans-serif;line-height:1.2;color:#fff;font-weight:600;margin-bottom:2rem">
                    The Neo Team
                </p>
            </div>
    
            <table role="presentation" style="width:100%;min-width:100%;border-radius:6px;border:2px solid transparent">
                <tbody>
                    <tr>
                        <td style="vertical-align:top;text-align:left;border:0">
                            <h2 class="text-success reshape">Neoprotocol</h2>
                        </td>
    
                        <td style="text-align:center;background:no-repeat 50%;border:0">
                            <div
                                style="font-size:16px;line-height:1.5rem;font-weight:400;font-family:DM Sans,'Google Sans',sans-serif;color:#000;margin-top:0px;margin-bottom:0px">
                                <div class="follow-us">
                                    <a href="" class="bg-success">
                                        <i class="fa-brands fa-twitter"></i>
                                    </a>
    
                                    <a href="" class="bg-success">
                                        <i class="fa-brands fa-linkedin-in"></i>
                                    </a>
    
                                    <a href="" class="bg-success">
                                        <i class="fa-brands fa-instagram"></i>
                                    </a>
    
                                    <a href="" class="bg-success">
                                        <i class="fa-brands fa-facebook-f"></i>
                                    </a>
                                </div>
    
                            </div>
                        </td>
                    </tr>
    
    
                    <tr>
                        <td style="font-size:0!important;line-height:100%;text-align:center">
                            <div style="font-size:0;min-width:0!important;vertical-align:top;text-align:left">
                                <p
                                    style="margin-top: 15px;font-size:14px;line-height:1.5rem;font-weight:400;font-family:DM Sans,'Google Sans',sans-serif">
    
                                    <a style="font-family:DM Sans,'Google Sans',sans-serif;color:#ff5663;text-decoration:underline"
                                        rel="noreferrer">
                                        Unsubscribe
                                    </a>
                                </p>
                            </div>
                        </td>
                        <td>
                            <p
                                style="font-size:14px;line-height:1.5rem;font-weight:400;font-family:DM Sans,'Google Sans',sans-serif;color:#fff;margin-top:0px;width:100%;text-align:right;margin-bottom:0px">
                                Copyright ©
                                Neoprotocol
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
    
        </div>
    
    
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>
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