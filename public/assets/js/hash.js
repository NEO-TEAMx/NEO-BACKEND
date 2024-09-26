// const baseUrl = 'http://localhost:4040/api/v1/';
// const baseUrl = 'https://neoprotocol.onrender.com/api/v1/';
const baseUrl = "/api/v1/";

const buyHash = document.querySelector("#buyHash");

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


function calcEquVal(){
    const hash_amount = parseFloat(document.getElementById('amount').value);
    const accessToken = getCookie("accessToken")
    const refreshToken = getCookie("refreshToken")
        
    fetch(baseUrl+'user/hash_equivalent',{
        method:  'POST',
        mode: 'cors',
        headers:{
            'Content-Type': 'application/json',
            'AccessToken': accessToken,
            'Refresh_Token': refreshToken,
        },
        credentials: 'include',
        body: JSON.stringify({hash_amount})
    }).then(response =>response.json())
      .then(data =>{
        document.getElementById('usdt').value = data.equivalentVal
    });

}


// buyHash.addEventListener("click", async() =>{
//     clearErrors()   
//     if (await isAuthenticated()) {
            // x
//             const hash_amount = parseFloat(document.getElementById('amount').value);
//             const accessToken = getCookie("accessToken")
//             const refreshToken = getCookie("refreshToken")
        
//             if(!hash_amount){
//                 displayError("Please input a valid amount")
//                 return;
//             }
//           try{
        
            
//             const response = await fetch(baseUrl+'user/buy-hash',{
//                 method: "PATCH",
//                 mode: 'cors',
//                 headers:{
//                     'Content-Type': 'application/json',
//                     'AccessToken': accessToken,
//                     'Refresh_Token': refreshToken,
//                 },
//                 credentials: 'include',
//                 body: JSON.stringify({hash_amount}),
//             });
//             if(!response.ok){
//                 const resp = await response.json();
//                 if(resp.msg === "No user with such id"){
                    
//                     redirectToLogin()
//                 }
//                 if(resp.statusCode === 404){
                    
//                     redirectToLogin()
//                 }
                
//                 displayError(resp.msg || 'Something went wrong. Try again!!')
//                 return;
//             }
//             if(response.status === 404){
                
//                 redirectToLogin()
//             }
//             if(response.ok){
//                 const resp = await response.json();
//                 displaysuccess("You have successfully purchased hash!!")
//                 console.log(resp)
//                 window.location.href = '../dashboard/dashboard.html'
//                 return;
//             }

//           }catch(error){
//             console.log(error)
//             displayError("Error occurred")
//             return;
//           }  
//         } else {
//             redirectToLogin()
//         }
// });


document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("myModal");
    const btn = document.getElementById("buyHash");
    const gotIt = document.getElementById("closeButton");

    btn.addEventListener("click", async function() {
        clearErrors();
        if (await isAuthenticated()) {
            const hash_amount = parseFloat(document.getElementById('amount').value);
            const accessToken = getCookie("accessToken");
            const refreshToken = getCookie("refreshToken");

            if (!hash_amount) {
                displayError("Please input a valid amount");
                return;
            }

            try {
                const response = await fetch(baseUrl+'user/buy-hash',{
                    method: "PATCH",
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'AccessToken': accessToken,
                        'Refresh_Token': refreshToken,
                    },
                    credentials: 'include',
                    body: JSON.stringify({hash_amount}),
                });

                if (!response.ok) {
                    const resp = await response.json();
                    if (resp.msg === "No user with such id" || resp.statusCode === 404) {
                        redirectToLogin();
                    }
                    displayError(resp.msg || 'Something went wrong. Try again!!');
                    return;
                }

                const resp = await response.json();
                displaysuccess("You have successfully purchased hash!!");
                modal.style.display = "block";
            } catch (error) {
                console.log(error);
                displayError("Error occurred");
            }
        } else {
            redirectToLogin();
        }
    });

    gotIt.addEventListener("click", function() {
        modal.style.display = "none";
        window.location.replace('./dashboard.html');
    });
    
    
});
