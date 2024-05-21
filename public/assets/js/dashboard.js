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
            total_balancep.textContent = total_balance.toFixed(5),
            yield_percentagep.textContent = Math.ceil(yield_percentage),
            hash_ratep.textContent = hash_rate === 0 ? hash_rate.toFixed(4) : hash_rate.toFixed(7),
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
// console.log(socket)
    let yield_balancep = document.querySelector("#yield_balance");
    let time = document.querySelector("#timer");
    let yield_percentagep = document.getElementById("percentage");
    const progressBar = document.querySelector(".progress-circle")
    let progress = 0;
    

    if(await isAuthenticated()){
        try {
            
            const accessToken = getCookie("accessToken")
            const socket = io("https://neoprotocol.onrender.com",{
                query:{
                    accessToken: accessToken                
                },
                withCredentials:true,
                reconnection: true,
                reconnectionAttempts: Infinity,
                reconnectionDelay:1000,
                reconnectionDelayMax:5000,
                randomizationFactor: 0.5,
            });

            if(socket.emit('startMining')){
                socket.emit("startMining")
                startMiningBtn.textContent = 'Currently Mining';
                startMiningBtn.disabled = true;
                const interval = setInterval(() =>{
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
                let interval = setInterval(() =>{
                    progress += 5;
                    progressBar.style.strokeDasharray = `${progress}, 100`;
                    if(progress >= 100){
                        progress = 0;
                        clearInterval(interval)
                    }
                },10)
            }

            socket.on('miningData', (data) =>{
                console.log(socket.id)
                console.log("connected to server")

                const {
                    yield_balance,
                    yield_percentage,
                    yield_time
                } = data;

                const parsedDate = moment(yield_time);
                const formattedTime = parsedDate == "invalid date" ? "00:00:00" : parsedDate.format('HH:mm:ss')
                    
                yield_balancep.textContent = yield_balance.toFixed(8), 
                yield_percentagep.textContent = yield_percentage
                time.textContent = formattedTime == "invalid date" ? "00:00:00" : formattedTime

            });

            // socket.on('connect_error', (error) =>{
            //     if(socket.active){
            //         setTimeout(() =>{
            //             socket.connect();
            //         },2000)
            //     }else{
            //         console.error('Error occurred: ', error.message)
            //         setTimeout(() =>{
            //             socket.connect();
            //         },3500)
            //     }
            // });

            socket.on("disconnect", (reason) =>{
                if(reason === 'transport error'){
                    socket.connect()
                }
                console.log("Disconnected", reason)
            });
            
            socket.on("reconnect_attempt", () =>{
                console.log('Attempting to reconnect')
            });

            socket.on("reconnection_failed", () =>{
                console.log("reconnection failed")
            });

            socket.on("reconnect", (attemptNumber) =>{
                console.log("Reconnected after ", attemptNumber, " attempts")
            });
            
            socket.on('connect_error', (error) =>{
                if(socket.active){
                    setTimeout(() =>{
                        socket.connect();
                    },2000)
                }else{
                    console.error('Error occurred: ', error.message)
                    setTimeout(() =>{
                        socket.connect();
                    },3500)
                }
            });
        } catch (error) {
            console.log(error)
            return error;
        }
    }

}