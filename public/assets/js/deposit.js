// const baseUrl = 'http://localhost:4040/api/v1/';
// const baseUrl = 'https://neoprotocol.onrender.com/api/v1/';
const baseUrl = "/api/v1/";

function clearErrors(){
    const errMsg = document.getElementById('errorMsg');
    errMsg.textContent = '';
}

function displayError(msg){
    const errMsg = document.getElementById("errorMsg");
    errMsg.innerHTML += `<p class="text-center lead mb-4" >${msg}</p>`
    setTimeout(clearErrors,5000)
}    
function displaysuccess(msg){
    const errMsg = document.getElementById("successMsg");
    errMsg.innerHTML += `<p class="text-center lead mb-4" >${msg}</p>`
    setTimeout(clearErrors, 5000)
    
}

function nextButton(){
    clearErrors();
    const amountInput = document.getElementById('amount');
    let amountVal = parseFloat(amountInput.value);
    // amountVal = parseFloat(document.getElementById('amount').value)
    const regex = /^[0-9.]+$/

    if(!amountVal){ 
        displayError("Amount is required!")
        return;
    }

    if(!regex.test(amountVal)){
        displayError("Amount must be a number!!")
        return;
    }
    const amount = Number(amountVal);
    if(isNaN(amountVal) || amount <=0){
        displayError("Please enter a valid deposit amount")
        return;
    }
    localStorage.setItem('amount', amount)

    window.location.href = "../dashboard/confirmation.html"
    return;
    // return window.location.href = "../dashboard/confirmation.html"
}


async function showConfirmation() {
    clearErrors();
    if (await isAuthenticated()) {
        const accessToken = getCookie("accessToken")
        const refreshToken = getCookie("refreshToken")
        const storedNum = localStorage.getItem('amount')    
        const amount = parseFloat(storedNum);
        
        try {
            const response = await fetch(baseUrl+'user/deposit', {
                method: 'POST',
                mode: 'cors',
                headers:{
                    'Content-Type': 'application/json',
                    'AccessToken': accessToken,
                    'Refresh_Token': refreshToken,
                },
                credentials: 'include',
                body: JSON.stringify({amount}),
            });
            if(!response.ok){
                if(resp.msg === "No user with such id"){
                    
                    redirectToLogin()
                }
                if(resp.statusCode === 404){
                    
                    redirectToLogin()
                }
                const resp = await response.json();
                displayError(resp.msg || 'Something went wrong. Try again!!')
                return;
            }
            if(response.status === 404){
                
                redirectToLogin()
            }
            if(response.ok){
                const resp = await response.json();
                displaysuccess("Your deposit request is being processed!!")
                document.getElementById("exampleModal").style.display = "flex";
                localStorage.removeItem('amount')
                
                return;
            }

        } catch (error) {
            
            displayError("Something went wrong. Try again!!")
            return;
        }
    
    } else {
        redirectToLogin();
    }
}



// confirmPayment.addEventListener("click", async()=>{
//     if(await isAuthenticated()){
//         const accessToken = localStorage.getItem('accessToken')
//         if(!amount){
//             throw new Error("Error occured! Provide the amount needed")
//         }
        
//         try {
//             const response = await fetch(baseUrl+'/deposit', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': accessToken
//                 },
//                 credentials: 'include',
//             });
//             if(response.ok){
//                 const resp = response.json();
//                 console.log(resp)
//             } 
//             console.log("Clicked")
//         } catch (error) {
//             console.log(error)
//         }
//     }else{
//         redirectToLogin();
//     }
// });

// function handleFormSubmit(event) {
//   event.preventDefault();

//   // Retrieve the entered amount from the input field
//   const amountInput = document.getElementById('amount');
//   const amount = parseFloat(amountInput.value);
//   const paymentLimit = 50;

//   if (amount < paymentLimit) {
//     // Create the payment limit message
//   //   const limitMessage = document.createElement('div');
//   //   limitMessage.classList.add('alert');
//   //   limitMessage.classList.add('alert-danger');
//   //   limitMessage.textContent = 'Please follow the payment limit.';
//   //   limitMessage.style.color = 'red'; // Set the text color to red
//   //   limitMessage.style.position = 'absolute'; // Set the positioning to absolute
//   //   limitMessage.style.top = '14px'; // Position the message vertically in the middle
//   //   limitMessage.style.transform = 'translateY(-50%)'; // Adjust the vertical positioning
//   //   limitMessage.style.left = '0'; // Position the message horizontally to the left
//   //   limitMessage.style.right = '0'; // Position the message horizontally to the right
//   //   limitMessage.style.textAlign = 'center'; // Center the text within the message


    

//   //   // Append the message to the modal container
//      modal.appendChild(limitMessage);
//    } else {
//   //  Store the amount in local storage
//      localStorage.setItem('amount', amount);

//     // Redirect the user to the confirmation page
//     window.location.href = 'confirmation.html';
//   }
// }

// // Event listener for form submission
// form.addEventListener('submit', handleFormSubmit);
