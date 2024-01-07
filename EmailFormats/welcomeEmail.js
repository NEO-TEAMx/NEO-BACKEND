const {sendEmail, sendMail} = require('../utils/sendEmailConfig');


const sendCeoMail = async({username,email}) =>{

    const message = `
        <div>
            <p>
                Welcome to the crypto mining adventure at Neo cloud mining.
                <br/>
                Our team of experts is dedicated to optimizing your mining experience, ensuring seamless operations, and staying ahead of industry trends.    
            </p>
            <p>
                Feel free to explore our platform's features and should you have any inquiries or suggestions, our supprt team is readily available to assist you.
                We value your feedbacks as it plays a crucial role in shaping the evolution of our services.
            </p>
            <p>
                Thank you for choosing Neo mining. We look forward to a mutually rewarding partnership and achieving new heights in the world of crypto mining.
            </p>
            <p>
                Best regards,
                </br>
                Xu chin yu
                </br>
                C.E.O
            </p>
        </div>
    `;

    return sendEmail({
        to: email,
        subject: "Welcome to Neo cloud mining - Let's mine together",
        html: `<div>
            <h4> Hello, ${username}</h4>
        
            ${message}
        </div>
        `
    })

    
}


module.exports = sendCeoMail;