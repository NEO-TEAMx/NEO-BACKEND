// const baseUrl = 'http://localhost:4040/api/v1/';
const baseUrl = 'https://neoprotocol.onrender.com/api/v1/';


async function depositHistory(){
    
    const tablebody = document.querySelector("#depHistory tbody")
    // console.log(tablebody)
    if(await isAuthenticated()){
        const accessToken = getCookie("accessToken")
        const refreshToken = getCookie("refreshToken")
        
        try {
            
            const response = await fetch(baseUrl+'user/deposit-history',{
                method: 'GET',
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
                if(resp.statusCode === 404){
                    
                    redirectToLogin()
                }
                
            }
            if(response.ok){
                const data = await response.json();
                const {
                    deposit
                } = data

                
                // console.log(data.deposit)
                if(data.msg === "Deposit history is empty"){
                    const emptyRow = document.createElement('tr')
                    const emptyCell = document.createElement('td')
                    emptyCell.setAttribute('colspan', 2)
                    emptyCell.textContent = "Deposit History Is Empty"
                    emptyRow.appendChild(emptyCell)
                    emptyCell.appendChild(emptyRow)
                }else{

                    deposit.forEach(data => {
                        const parsedDate = moment(data.date);
                        const formattedTime = parsedDate.format('DD/MM/YYYY')

                        const row = document.createElement("tr");
                        const display = ["date", "transaction_id", "amount", "approved"]
                        display.forEach(column =>{
                            const cell = document.createElement("td");
                            cell.textContent = column === 'date' ? formattedTime : column === 'approved' ? (data[column] ? 'Approved' : 'Pending') : data[column];
                            row.appendChild(cell)
                        });
                        tablebody.appendChild(row)
                    });
                }    
            }
        } catch (error) {
            // return error
            // console.log(error)
            displayError("Something Went Wrong")
        }
    }else{
        redirectToLogin();
        // redirectToLogin()
    }

}


window.onload = depositHistory;


// if(!response.ok){
//     if(resp.msg === "No user with such id"){
        
//         redirectToLogin()
//     }
//     if(resp.statusCode === 404){
        
//         redirectToLogin()
//     }
//     const resp = await response.json();
//     displayError(resp.msg || 'Something went wrong. Try again!!')
//     return;
// }
// if(response.status === 404){
    
//     redirectToLogin()
// }