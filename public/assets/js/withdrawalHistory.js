// const baseUrl = 'http://localhost:4040/api/v1/';
const baseUrl = 'https://neoprotocol.onrender.com/api/v1/';


async function withdrawalHistory(){

    const tablebody = document.querySelector("#witHistory tbody")
    // console.log(tablebody)
    if(await isAuthenticated()){
        const accessToken = getCookie("accessToken")
        const refreshToken = getCookie("refreshToken")
       
        try {
            
            const response = await fetch(baseUrl+'user/withdrawal-history',{
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
                    withdrawal    
                } = data

                // console.log(data)
                if(data.msg === "Withdrawal history is empty"){
                    const emptyRow = document.createElement('tr')
                    const emptyCell = document.createElement('td')
                    emptyCell.setAttribute('colspan', 4)
                    emptyCell.textContent = "Withdrawal History is empty"
                    emptyRow.appendChild(emptyCell)
                    tablebody.appendChild(emptyRow)
                   
                }else{
                   
                    withdrawal.forEach(data => {
                        const row = document.createElement("tr");
                        const parsedDate = moment(data.date);
                        const formattedTime = parsedDate.format('DD/MM/YYYY')

                        const display = ["date", "transaction_id", "total_amount", "approved"]
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
            console.log(error)
        }
    }else{
        redirectToLogin();
        // redirectToLogin()
    }

}


window.onload = withdrawalHistory;