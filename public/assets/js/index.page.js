const baseUrl = 'https://neoprotocol.onrender.com/api/v1/';
// const baseUrl = 'http://localhost:4040/api/v1/';

const currentYear = new Date().getFullYear();
const year = document.querySelector("#currentYear");
const forgotPassword = document.querySelector("#forgotPassword");

year.innerText = currentYear;
// if (year) {
//     year.innerText = currentYear;
// }

function clearErrors(){
    const errMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg')
    errMsg.textContent = '',
    successMsg.textContent =  ''
}

function displayError(msg){
    const errMsg = document.getElementById("errorMsg");
    errMsg.innerHTML += `<p class="text-center lead mb-4" >${msg}</p>`
    setTimeout(clearErrors, 7000)
}
function displaysuccess(msg){
    const errMsg = document.getElementById("successMsg");
    errMsg.innerHTML += `<p class="text-center lead mb-4" >${msg}</p>`
    setTimeout(clearErrors, 7000)
}

function setToken(val, expDur){
    localStorage.setItem('accessToken', val)
    localStorage.setItem('expires', expDur)
}

function getRefCode(){
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get("referralCode")
}

function showPreloader(){
    document.querySelector(".spinner").style.display = 'block';
    document.querySelector(".holder").classList.add("hiddenBody");
    document.body.classList.add("overlay");
}

function hidePreloader(){
    document.querySelector(".spinner").style.display = 'none';
    document.querySelector(".holder").classList.remove("hiddenBody");
    document.body.classList.remove("overlay");
}

document.addEventListener("DOMContentLoaded", function() {
    showPreloader();
});

window.addEventListener("load", function() {
    hidePreloader();
});


// function getToken

async function submitSignupForm(){
    const usernameInput = document.querySelector("#username");
    const emailInput = document.querySelector("#email");
    const passwordInput = document.querySelector("#password");
    const confirmPasswordInput = document.querySelector("#confirmPassword");
    const urlParams =  new URLSearchParams( window.location.search)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const formp = document.querySelector(".form");
    const btn = document.querySelector(".btn");

    let usernameVal = usernameInput.value;
    let emailVal = emailInput.value;
    let passwordVal = passwordInput.value;
    let confirmPasswordVal = confirmPasswordInput.value

    clearErrors();
    // validate inputs
    if(!usernameVal || !emailVal || !passwordVal || !confirmPasswordVal){
        displayError('Please provide the needed value(s)')
        return;
    }

    if(!emailRegex.test(emailVal)){
        displayError('Email is not valid!')
        return;
    }

    if(passwordVal.length < 8){
        displayError('Password should be at least 8 characters')
        return;
    }

    if(passwordVal !== confirmPasswordVal){
        displayError("Password and confirm password does not match")
        return;
    }
    const referralCode = getRefCode();

    //req payload
    const data = {
        username: usernameVal,
        email: emailVal,
        password: passwordVal,
        confirmPassword: confirmPasswordVal,
        referralCode
    }

    // const referralCode = urlParams.get("referralCode")

    btn.textContent = 'Please wait.....';
    btn.disabled = true;
    formp.disabled = true;

    try {
        const response = await fetch(baseUrl+'register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        if(!response.ok){
            const resp = await response.json(); 
            displayError(resp.msg ||'Something went wrong');
            
            btn.textContent = 'Sign up';
            btn.disabled = false;
            formp.disabled = false;
            return;
        }
        if (response.status === 200) {
            usernameVal = '',
            emailVal = '',
            passwordVal = '',
            confirmPasswordVal = ''
        }
        if(response.ok){
            const resp = await response.json();
            
            const accessToken = resp.accessToken;
            const refreshToken = resp.refreshToken;

            const expiraionTime = new Date();
            expiraionTime.setTime(expiraionTime.getTime() + (1 * 24 *60 * 60 * 1000))

            const expiresD = new Date();
            expiresD.setTime(expiresD.getTime() + (3 * 24 * 60 * 60 * 1000))
        
            document.cookie = `accessToken=${accessToken}; expires=${expiraionTime.toUTCString()}; path=/; `;
            document.cookie = `refreshToken=${refreshToken}; expires=${expiresD.toUTCString()}; path=/; `;
            
            displaysuccess("Successfully signed-up")
            window.location.href = "../dashboard/dashboard.html"
            
            usernameVal = '',
            emailVal = '',
            passwordVal = '',
            confirmPasswordVal = ''

            btn.textContent = 'Sign up';
            btn.disabled = false;
            formp.disabled = false;
           
            return  true;
        }else{
            return false;
        }
        
    } catch (error) {
        console.log(error)    
        btn.textContent = 'Sign up';
        btn.disabled = false;
        formp.disabled = false;
        // return;
        displayError('SomeThing went wrong')
    }
}

async function submitLoginForm(){
    const usernameOrEmailInput = document.querySelector("#item");
    const passwordInput = document.querySelector("#password");
    const formp = document.querySelector(".form");
    const btn = document.querySelector(".btn");

    let usernameOrEmailVal = usernameOrEmailInput.value;
    let passwordVal = passwordInput.value;
    
    clearErrors();
    // validate inputs
    if(!usernameOrEmailVal || !passwordVal){
        displayError('Please provide the needed value(s)')
        return;
    }

    if(passwordVal.length < 8){
        displayError('Password should be at least 8 characters')
        return;
    }

    const isEmail = usernameOrEmailVal.includes('@')

    //req payload
    const data = {
        password: passwordVal,
    }

    if(isEmail){
        data.email = usernameOrEmailVal
    }else{
        data.username = usernameOrEmailVal
    }

    btn.textContent = 'Please wait.....';
    btn.disabled = true;
    formp.disabled = true;

    
    try {
       const response = await fetch(baseUrl+'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            credentials:'include'
        });
        
        if(!response.ok){
            const resp = await response.json(); 
            displayError(resp.msg);
            btn.textContent = 'Sign in';
            btn.disabled = false;
            formp.disabled = false;
            return;
        }
       
        if(response.ok){
            const resp = await response.json();
            
            const accessToken = resp.accessToken;
            const refreshToken = resp.refreshToken;

            const expiraionTime = new Date();
            expiraionTime.setTime(expiraionTime.getTime() + (3 * 24 *60 * 60 * 1000))

            const expiresD = new Date();
            expiresD.setTime(expiresD.getTime() + (4 * 24 * 60 * 60 * 1000))
        
            document.cookie = `accessToken=${accessToken}; expires=${expiraionTime.toUTCString()}; path=/; `;
            document.cookie = `refreshToken=${refreshToken}; expires=${expiresD.toUTCString()}; path=/; `;
            

            btn.textContent = 'Sign in';
            btn.disabled = false;
            formp.disabled = false;
            
            displaysuccess("Logged in successfully")
            window.location.href = "../dashboard/dashboard.html"
            
            usernameVal = '',
            passwordVal = ''
            
            return;
        }
    } catch (error) {
        console.log(error)       
        btn.textContent = 'Sign in';
        btn.disabled = false;
        formp.disabled = false;
        displayError("Something went wrong. Try again")
        return;
    }
}

// forgotPassword.addEventListener('click', async()=>{

//     clearErrors();
//     const emailInput = document.querySelector('#email');
//     let emailVal = emailInput.value;

//     if(!emailVal){
//         displayError("Please provide a registered email")
//     }
//     const data = {
//         email: emailVal
//     }

//     try {
//         const response = await fetch(baseUrl+'forget-password',{
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(data)
//         });
//         if(!response.ok){
//             const resp = await response.json(); 
//             displayError(resp.msg);
//             return;
//         }
//         if(response.ok){
//             const resp = await response.json();
//             displaysuccess(resp.msg||"Reset password link have been sent to your email")
//             window.location.href = '../html/password-reset-done'
//             return;
//         }   
//         emailVal = ''     
//     } catch (error) {
//         console.log(error)
//         displayError("Something went wrong!")
//     }
// });

document.addEventListener('DOMContentLoaded', function() {
  
    const forgotPassword = document.querySelector("#forgotPassword");
    if (forgotPassword) {
        forgotPassword.addEventListener('click', async() => {
            clearErrors();
            const emailInput = document.querySelector('#email');
            let emailVal = emailInput.value;

            if(!emailVal){
                displayError("Please provide a registered email")
            }
            const data = {
                email: emailVal
            }

            try {
                const response = await fetch(baseUrl+'forget-password',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });
                if(!response.ok){
                    const resp = await response.json(); 
                    displayError(resp.msg);
                    return;
                }
                if(response.ok){
                    const resp = await response.json();
                    displaysuccess(resp.msg||"Reset password link have been sent to your email")
                    window.location.href = '../html/password-reset-done'
                    return;
                }   
                emailVal = ''     
            } catch (error) {
                console.log(error)
                displayError("Something went wrong!")
            }
        });
    }
});


async function resetPassword(){
    clearErrors();
    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    const urlParams = new URLSearchParams(window.location.search);

    const email = urlParams.get("email");
    const token = urlParams.get("token");

    if(!password || !confirmPassword){
        displayError("Please provide the needed credential(s)")
        return;
    }
    if(password.length < 8){
        displayError('Password should be at least 8 characters')
        return;
        // throw new Error("Password should be at least 8 character")
    }
    if(password !== confirmPassword){
        displayError("Password must match confirm password")
        return;
    }
    const data = {email,token,password,confirmPassword}
    try{
        const response = await fetch(baseUrl+'reset-password',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include'
        });
        if(!response.ok){
            const resp = await response.json(); 
            displayError(resp.msg || 'Something went wrong!');
            return;
        }
        if(response.ok){
            const resp = await response.json();
            displaysuccess(resp.msg || "You have successfully changed your password!! Proceed to login to your account");
            password = "",
            confirmPassword = ""
        }
    }catch(err){
        displayError("Something went wrong. Try again!!")
        // console.log(err)
    }
}

async function newLetter(){
    const email = document.querySelector("#newLetterEmail").value;
    // console.log(email)
    // console.log("newsLetter")
    if(!email){
        displayError('Please provide the needed value')
        return;
    }
    // console.log(email)
    const data = {
        email:email
    }
    try {
        console.log(data)
        const response = await fetch(baseUrl+'subscribe',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const resp = await response.json();
            displayError(resp.msg);
            return;
        }
        if(response.ok){
            displaysuccess("You have successfully subscribed to our news letter")
            email = ""
            return;
        }
    } catch (error) {
        // displayError("Something went wrong. Try again!!")
        return error;
    }
}

async function logoutFunc(){
    if(await isAuthenticated()){
        const accessToken = getCookie("accessToken")
        const refreshToken = getCookie("refreshToken")
        
        try {
            showPreloader();
            const response = await fetch(baseUrl+'logout', {
                method: 'DELETE',
                mode: 'cors',
                headers:{
                    'Content-Type': 'application/json',
                    'AccessToken': accessToken,
                    'Refresh_Token': refreshToken,
                },
                credentials: 'include'
            });
            if(response.status === 404){
                
                redirectToLogin()
            }
            if(!response.ok){
                const resp = await response.json();
                if(resp.msg === "No user with such id"){
                    
                    redirectToLogin()
                }
                if(resp.msg === "No user with such id"){
                    
                    redirectToLogin()
                }
                if(resp.statusCode === 404){
                    
                    redirectToLogin()
                }

                displayError('Something went wrong. Try again!!')
                return;
            }
            if(response.ok){
                const resp = await response.json();
               clearCookie()
                localStorage.clear();
                window.location.href = "../html/signin.html"
            }
        } catch (error) {
            console.log(error)
            redirectToLogin()
            displayError("Error occurred. Try again")
        }
    }else{
        redirectToLogin();
    }
    
}
 
async function contactForm(){
 
    let username = document.querySelector("#username").value;
    let subject = document.querySelector("#subject").value
    let email = document.querySelector("#email").value;
    let body = document.querySelector("#body").value;
    
    if(!username||!subject||!email||!body){
        displayError("Provide the needed details");
        return;
    }

    const data  = {
       username: username,
        subject: subject,
        email: email,
        body: body
    }
    // console.log(data)
    try {
        // console.log("prod log")
        const response = await fetch(baseUrl+'contact',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if(!response.ok){
            const resp = await response.json();
            displayError(resp.msg);
            return;
        }
        if(response.ok){
            email = "",
            subject = "",
            username = "",
            body = ""
            displaysuccess("Message sent successfully");
            return; 
        }
    } catch (error) {
        console.log(error)
        displayError("Something Went Wrong!")
    }
    
}


function clearCookie(){
    let cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf("=")
        const accessToken = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
        document.cookie = accessToken + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'        
    }
}
