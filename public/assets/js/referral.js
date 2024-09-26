// const baseUrl = 'http://localhost:4040/api/v1/';
// const baseUrl = 'https://neoprotocol.onrender.com/api/v1/';
const baseUrl = "/api/v1/";


// referral();

async function referral(){
    let copy = document.querySelector(".refLink");
    const tablebody = document.querySelector("#refTable tbody")
    // console.log(tablebody)
    if(await isAuthenticated()){
        const accessToken = getCookie("accessToken")
        const refreshToken = getCookie("refreshToken")
        
        try {
            
            const response = await fetch(baseUrl+'user/referral',{
                method: 'GET',
                mode: 'cors',
                headers:{
                    'Content-Type': 'application/json',
                    'AccessToken': accessToken,
                    'Refresh_Token': refreshToken,
                },
                credentials:'include'
            });
            if(response.status === 404){
                
                redirectToLogin()
            }
            if(!response.ok){
                const resp = await response.json();
                if(resp.msg === "No user with such id"){
                    
                    redirectToLogin()
                }
                if(resp.statusCode === 404){
                    
                    redirectToLogin()
                }
                
            }
            if(response.ok){
                const data = await response.json();
                const {
                    refLink,
                    referralData
                } = data

                copy.value = refLink
                
                    referralData.forEach(data => {
                        const row = document.createElement("tr");
                        const display = ["username"]
                        display.forEach(column =>{
                            const cell = document.createElement("td");
                            cell.textContent = data[column];
                            row.appendChild(cell)
                        });
                        tablebody.appendChild(row)
                    });
                 
            }
        } catch (error) {
            console.log(error)
        }
    }else{
        redirectToLogin();
        // redirectToLogin()
    }

}


window.onload = referral;