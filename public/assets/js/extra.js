async function startMining() {
    let yield_balancep = document.querySelector("#yield_balance");
    let time = document.querySelector("#timer");
    let yield_percentagep = document.getElementById("percentage");
    const progressBar = document.querySelector(".progress-circle");
    let progress = 0;

    if (await isAuthenticated()) {
        try {
            const accessToken = getCookie("accessToken");

            // Initialize the socket with reconnection settings
            const socket = io({
                query: { accessToken },
                reconnection: true,            // Enable automatic reconnection
                reconnectionAttempts: Infinity, // Infinite reconnection attempts
                reconnectionDelay: 5000,        // 5 seconds delay between reconnection attempts
                reconnectionDelayMax: 10000,    // Max 10 seconds delay between reconnections
                timeout: 20000                 // Timeout for initial connection (20 seconds)
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
                console.log(mining_status);
                console.log(yield_balance);
                console.log(yield_percentage);
                console.log(yield_time);

                const parsedDate = moment(yield_time);
                const formattedTime = parsedDate == "invalid date" ? "00:00:00" : parsedDate.format('HH:mm:ss');

                yield_balancep.textContent = yield_balance.toFixed(8);
                yield_percentagep.textContent = yield_percentage;
                time.textContent = formattedTime == "invalid date" ? "00:00:00" : formattedTime;
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

            // Handle reconnection failure
            socket.on("reconnect_failed", () => {
                console.log("Reconnection failed.");
                clearInterval(interval);  // Stop the progress bar if reconnection fails
                startMiningBtn.textContent = 'Start Mining';
                startMiningBtn.disabled = false;
            });

        } catch (error) {
            console.log(error);
            return error;
        }
    }
}


// old one
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
                reconnectionAttempts: Infinity, // Infinite reconnection attempts
                reconnectionDelay: 5000,        // 5 seconds delay between reconnection attempts
                reconnectionDelayMax: 10000,    // Max 10 seconds delay between reconnections
                timeout: 20000                 // Timeout for initial connection (20 seconds)
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


            socket.on('message', ({mining_status,yield_balance,yield_percentage,yield_time,}) =>{
              
                // const {
                //     yield_balance,
                //     yield_percentage,
                //     yield_time,
                //     mining_status
                // } = data;
                console.log(mining_status)
                console.log(yield_balance) // yieldB
                console.log(yield_percentage) // perce
                console.log(yield_time) // time
  
                const parsedDate = moment(yield_time);
                const formattedTime = parsedDate == "invalid date" ? "00:00:00" : parsedDate.format('HH:mm:ss')
                    
                yield_balancep.textContent = yield_balance.toFixed(8), 
                yield_percentagep.textContent = yield_percentage
                time.textContent = formattedTime == "invalid date" ? "00:00:00" : formattedTime

            });
             
        } catch (error) {
            console.log(error)
            return error;
        }
    }

}
