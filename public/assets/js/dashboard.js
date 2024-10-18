
function showPreloader(){
    document.querySelector(".spinner").style.display = 'block';
    document.querySelector(".dashboard").classList.add("hidden");
    document.body.classList.add("overlay");
}

function hidePreloader(){
    document.querySelector(".spinner").style.display = 'none';
    document.querySelector(".dashboard").classList.remove("hidden");
    document.body.classList.remove("overlay");
}

document.addEventListener("DOMContentLoaded", function() {
    showPreloader();
});

window.addEventListener("load", function() {
    hidePreloader();
});

async function dashboard(){
    // clearErrors();
    let yield_balancep = document.querySelector("#yield_balance");
    let hash_ratep = document.querySelector("#hash_rate");
    let yield_percentagep = document.getElementById("percentage");
    let total_balancep = document.querySelector("#balance")
    let time = document.querySelector("#timer");
    const startMiningBtn = document.querySelector('#start-mining-btn');
    const progressBar = document.querySelector(".progress-circle")
    let progress = 0;

    if(await isAuthenticated()){
        const accessToken = getCookie("accessToken")
        const refreshToken = getCookie("refreshToken")
        
        try {
            showPreloader();
            const response = await fetch(baseUrl+'user/dashboard', {
                method: 'GET',
                mode: 'cors',
                headers:{
                    'Content-Type': 'application/json',
                    'AccessToken': accessToken,
                    'Refresh_Token': refreshToken,
                },
                credentials: 'include',
            });
            

            const data = await response.json();
            
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
            
            const {
                hash_rate,
                total_balance,
                yield_balance,
                yield_percentage,
                yield_time,
                mining_status
            } = data.user;
 
            const parsedDate = moment(yield_time);
            const formattedTime = parsedDate.format('HH:mm:ss')
            yield_balancep.textContent = yield_balance.toFixed(8),
            total_balancep.textContent = total_balance.toFixed(2),
            yield_percentagep.textContent = Math.ceil(yield_percentage),
            hash_ratep.textContent = hash_rate === 0 ? hash_rate.toFixed(2) : hash_rate.toFixed(2),
            time.textContent = yield_time === null ? "24:00:00" : formattedTime
            
            setTimeout(function(){
                hidePreloader();
            },3500)

            if( mining_status){
                startMiningBtn.textContent = 'Currently Mining';
                startMiningBtn.disabled = true;
                let interval = setInterval(() =>{
                    progress += 5;
                    progressBar.style.strokeDasharray = `${progress}, 100`;
                    if(progress >= 100){
                        progress = 0;
                        // clearInterval(interval)
                    }
                },10)            
            }else{
                startMiningBtn.textContent = 'Start Mining';
                startMiningBtn.disabled = false;
                yield_percentagep.textContent = 0
                let interval = setInterval(() =>{
                    progress += 5;
                    progressBar.style.strokeDasharray = `${progress}, 100`;
                    if(progress >= 100){
                        progress = 0;
                        clearInterval(interval)
                    }
                },10)
            }

        } catch (error) {
            console.log(error)
            return error;
        }
    }else{
         redirectToLogin();
    }
}

window.onload = dashboard;

const startMiningBtn = document.querySelector('#start-mining-btn');
// async function startMining(){

//     let yield_balancep = document.querySelector("#yield_balance");
//     let time = document.querySelector("#timer");
//     let yield_percentagep = document.getElementById("percentage");
//     const progressBar = document.querySelector(".progress-circle")
//     let progress = 0;
    

//     if(await isAuthenticated()){
//        try{
//         const accessToken = getCookie("accessToken")
        
//         // const socket = io('wss://neoprotocol.onrender.com',{
//         // const socket = io('https://neoprotocol.onrender.com',{
//         const socket = io("http://localhost:4040",{
//             reconnectionDelayMax:10000,
//             query:{
//                 accessToken: accessToken                
//             },
//             withCredentials:true,
//             extraHeaders: {
//                 // 'Access-Contorl-Allow-Origin': 'https://neo-protocol.com'

//                 'Access-Contorl-Allow-Origin': 'http://localhost:8081'
//             }
//         });
//         if( socket.emit("startMining")){
//             socket.emit("startMining")
//             startMiningBtn.textContent = 'Currently Mining';
//             startMiningBtn.disabled = true;
//             const interval = setInterval(() =>{
//                 progress += 5;
//                 progressBar.style.strokeDasharray = `${progress}, 100`;
//                 if(progress >= 100){
//                     progress = 0;
//                     // clearInterval(interval)
//                 }
//             },10)
        
//         }else{
//             startMiningBtn.textContent = 'Start Mining';
//             startMiningBtn.disabled = false;
//             let interval = setInterval(() =>{
//                 progress += 5;
//                 progressBar.style.strokeDasharray = `${progress}, 100`;
//                 if(progress >= 100){
//                     progress = 0;
//                     clearInterval(interval)
//                 }
//             },10)
//         }
        
//         // socket.emit("startMining")
//         // establish connection
//         socket.on('miningData', (data) =>{
//             console.log(data)
//             console.log('connection established!')
//         });

//         // reconnect after every error
//         socket.on('connect_error', (error) =>{
//             console.error('Error occurred: ', error.message)
//             setTimeout(() =>{
//                 socket.connect();
//             },2000)
//         });

//         // disconnect and reconnect after 2sec
//         socket.on("disconnect", () =>{
//             console.log('disconnection occured')
//             setTimeout(() =>{
//                 socket.connect();
//             },2000)
//         });

//         socket.on('miningData',(data) =>{
//             console.log({data})
//             const {
//                 yield_balance,
//                 yield_percentage,
//                 yield_time
//             } = data;
//             const parsedDate = moment(yield_time);
//             const formattedTime = parsedDate == "invalid date" ? "00:00:00" : parsedDate.format('HH:mm:ss')

//             yield_balancep.textContent = yield_balance.toFixed(8), 
//             yield_percentagep.textContent = yield_percentage
//             time.textContent = formattedTime == "Invalid date" ? "00:00:00" : formattedTime
            
//         });
//         }catch(e){
//             console.log(e)
//         }
//     }else{
//         return redirectToLogin();
//     }
// }


async function startMining(){

    let yield_balancep = document.querySelector("#yield_balance");
    let time = document.querySelector("#timer");
    let yield_percentagep = document.getElementById("percentage");
    const progressBar = document.querySelector(".progress-circle")
    let progress = 0;
    

    if(await isAuthenticated()){
        try {
            
            const accessToken = getCookie("accessToken")
           
            const socket = io({
                query: {accessToken},
                reconnection: true,            // Enable automatic reconnection
                reconnectionAttempts: 5, // Infinite reconnection attempts
                reconnectionDelay: 2000,        // 5 seconds delay between reconnection attempts
                // reconnectionDelayMax: 10000,    // Max 10 seconds delay between reconnections
                // timeout: 20000                 // Timeout for initial connection (20 seconds)
            });

            
            // Reconnection logic - request mining data upon reconnection
            socket.on("reconnect", () => {
                console.log("Reconnected! Requesting updated mining data...");
                socket.emit("requestMiningData"); // Emit to request the latest data after reconnection
            });

            // Handle reconnection attempts
            socket.on("reconnect_attempt", () => {
                console.log("Attempting to reconnect...");
            });

            // Start mining process
            socket.emit("startMining");

            // Change the button state to indicate mining has started
            startMiningBtn.textContent = 'Currently Mining';
            startMiningBtn.disabled = true;

            // Progress bar animation
            const interval = setInterval(() => {
                progress += 5;
                progressBar.style.strokeDasharray = `${progress}, 100`;
                if (progress >= 100) {
                    progress = 0;
                }
            }, 10);

            // Listen for mining updates from the server
            socket.on('message', ({ mining_status, yield_balance, yield_percentage, yield_time }) => {
                // console.log(mining_status);
                // console.log(yield_balance);
                // console.log(yield_percentage);
                // console.log(yield_time);

                const parsedDate = moment(yield_time);
                const formattedTime = parsedDate == "invalid date" ? "00:00:00" : parsedDate.format('HH:mm:ss');

                yield_balancep.textContent = yield_balance.toFixed(8);
                yield_percentagep.textContent = yield_percentage;
                time.textContent = formattedTime == "invalid date" ? "00:00:00" : formattedTime;
            });

            // // Reconnection logic - request mining data upon reconnection
            // socket.on("reconnect", () => {
            //     console.log("Reconnected! Requesting updated mining data...");
            //     socket.emit("requestMiningData"); // Emit to request the latest data after reconnection
            // });

            // // Handle reconnection attempts
            // socket.on("reconnect_attempt", () => {
            //     console.log("Attempting to reconnect...");
            // });

            // Handle reconnection failure
            socket.on("reconnect_failed", () => {
                console.log("Reconnection failed.");
                clearInterval(interval);  // Stop the progress bar if reconnection fails
                startMiningBtn.textContent = 'Start Mining';
                startMiningBtn.disabled = false;
            });

             
        } catch (error) {
            console.log(error)
            return error;
        }
    }

}