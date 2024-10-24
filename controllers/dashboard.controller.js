const { StatusCodes } = require("http-status-codes");
const { NotFoundApiError, BadRequestApiError } = require("../Errors");
const User = require("../models/user.model");
const Swap = require("../models/swap.model");
const {getNeoToUsdtRate} = require("../__helpers__/generateNeoEqu");
const moment = require("moment");
const cron = require("node-cron");
const Deposit = require("../models/deposit.model");

const userDashboard = async(req,res) =>{
    
    const user = await User.findById(req.user.userId).select('-password');
    if(!user){
        throw new NotFoundApiError("No user with such id")
    }

    return res.status(200).json({success:true, user})
}

const buyHash = async(req,res) =>{
    const {hash_amount} = req.body;
    const {_id:userId} = req.params;
    const neoToUsdt = await getNeoToUsdtRate();
    if(!hash_amount){
        throw new BadRequestApiError("Input the amount of hash to purchase")
    }
    const user = await User.findById(req.user.userId);
    if(!user){
        throw new NotFoundApiError("No user with such id")
    }
    if(hash_amount > user.total_balance){
        throw new BadRequestApiError("Low on Usdt.")
    }
    if(user.total_balance <= 0){
        throw new BadRequestApiError("Please credit your wallet, to buy hash")
    }

    // get the current price of neo
    // (amount/current_price)/600
    // const rate = hash_amount * 0.00015; 

    const val = (hash_amount/neoToUsdt)/600;

    user.hash_rate += val;
    user.total_balance -= hash_amount;
   
    await user.save();

    return res.status(StatusCodes.OK).json({success:true, msg: "Successfully purchased hash"})
}

// get all referred users 
const getReferredUsers = async(req,res)=>{
    const userId = req.user.userId;
    // const user = await User.findById(req.user.userId)
    const user =  await User.findById(req.user.userId);
    // console.log(user)
    if(!user){
        return res.status(404).json({msg:"User not found"})
    }
    const refLink = user.referral_link;

    const referredUsers = await User.find({referredBy:userId});

    const referralData = referredUsers.map((user) => ({
        userId: user._id,
        username: user.username
    }));

    return res.status(200).json({referralData, refLink})
}


//hash equivalent
const hashEquivalent = async(req,res) =>{
    const {hash_amount} = req.body;
    const neoToUsdt = await getNeoToUsdtRate();

    // const equivalentVal = hash_amount * 0.00015;
    const equivalentVal = (hash_amount/neoToUsdt)/600;
   
    return res.json({equivalentVal: equivalentVal.toFixed(6)})
};

//neo equivalent
const neoEquivalent = async(req,res) =>{
    const {neo_amount} = req.body;
    const neoUsdtRate = await getNeoToUsdtRate();

    const usdt_equ = neo_amount * neoUsdtRate;

    return res.json({usdEqu: usdt_equ.toFixed(4)})
}

const neoToUsdt = async(req,res) =>{
    const {neo_amount} = req.body;
    const neoUsdtRate = await getNeoToUsdtRate();

    if(!neo_amount){
        throw new BadRequestApiError("Provide the needed values")
    }
    const user = await User.findById(req.user.userId);
    
    if(neo_amount > user.yield_balance){
        throw new BadRequestApiError("Insufficient Neo balance")
    }

    req.body.user = req.user.userId
    const usdt_equ = neo_amount * neoUsdtRate;

    user.yield_balance -= neo_amount;

    user.total_balance += usdt_equ;
    await user.save();

    const swap = await Swap.create({
        user: req.user.userId,
        neo_amount: neo_amount,
        email: req.user.email,
        usdt_equ: usdt_equ,
    })

    return res.status(StatusCodes.OK).json({success:true, swap})
}

// let cronJob;

const startMining = (io) =>{
    
    io.on("connection", async(socket) =>{
        console.log("connection achieved!!", socket.id)
        
        try {
            const user = await User.findById(socket.userId);
            
            if(!user){
                console.log("User not found");
                return;
            }
            //prevent mining if already in progress
            if(user.mining_status){
                 // Emit the current status to the client to ensure it's updated even if user reconnects
                socket.emit("message", {
                    mining_status: user.mining_status,
                    yield_balance: user.yield_balance,
                    yield_percentage: user.yield_percentage,
                    yield_time: user.yield_time
                });
                return;
            }
            //initialize mining duration
            user.mining_duration = 24 * 60 * 60;
            await user.save();

            const startTime = Date.now();
            const endTime = startTime + user.mining_duration * 1000;
            

            const intervalId  = setInterval(async() =>{
                try{
                    const currentTime = Date.now();
                    const remainingTime = Math.max(0, endTime - currentTime)

                    if(currentTime >= endTime){
                        clearInterval(intervalId);

                        let totalYieldBalance = user.hash_rate > 0
                            ? (user.hash_rate * 24 * 60 * 60) * 0.118
                            : 0.00000003 * 24 * 60 * 60;

                        user.yield_balance += Number(totalYieldBalance.toFixed(10));
                        user.yield_percentage = 0;
                        user.yield_time = null;
                        user.mining_status = false;
                        await user.save();
                        
                        // socket.emit("message", {
                        //     mining_status: user.mining_status,
                        //     yield_balance: user.yield_balance,
                        //     yield_percentage: user.yield_percentage,
                        //     yield_time: user.yield_time
                        // });
                        
                    }else{
                        // mining in progress
                        let progress = 100 - (remainingTime / (user.mining_duration * 1000)) * 100;
                        let remainingMinutes = remainingTime / (60 * 1000);

                        let currentYieldBalance = user.hash_rate > 0
                            ? (user.hash_rate * (24 * 60 * 60 - remainingMinutes)) * 0.0000013
                            : (0.00000021 * (24 * 60 * 60 - remainingMinutes)) * 0.000001;

                        // update progress and yield
                        user.yield_balance += Number(currentYieldBalance.toFixed(8));
                        user.yield_percentage = progress >= 100 ? 100 : Math.ceil(progress);
                        user.yield_time = remainingTime;
                        user.mining_status = true;
                        await user.save();

                        // socket.emit("message", {
                        //     yield_balance: user.yield_balance,
                        //     yield_percentage: user.yield_percentage,
                        //     remaining_time: user.yield_time
                        // });
                    }

                }catch(e){
                    console.error("Error during mining process:", err.message);
                    clearInterval(intervalId); // Ensure the interval is cleared on error
                }
                
            }, 7000); // Update every 5 seconds for this user
            // Start a cron job specific to this user to emit data every second
            const userCronJob = cron.schedule("* * * * * *", () => {
                socket.emit("message", {
                    mining_status: user.mining_status,
                    yield_balance: user.yield_balance,
                    yield_percentage: user.yield_percentage,
                    yield_time: user.yield_time
                });
            });

            // Stop the cron job when mining completes
            if (user.yield_percentage === 100) {
                userCronJob.stop();
            }

            // Handle the client requesting the current mining data on reconnection
            socket.on("requestMiningData", async () => {
                const updatedUser = await User.findById(socket.userId);
                socket.emit("message", {
                    mining_status: updatedUser.mining_status,
                    yield_balance: updatedUser.yield_balance,
                    yield_percentage: updatedUser.yield_percentage,
                    yield_time: updatedUser.yield_time
                });
            });

            // Clean up on disconnection
            socket.on("disconnect", () => {
                clearInterval(intervalId);
                if (userCronJob) {
                    userCronJob.stop();
                }
                console.log("User disconnected:", socket.id);
            });    
    } catch (error) {
        console.error(error.message)
    }
    });
};

const startMiningg = (io) =>{
   try{
    io.on('connection', (socket) =>{
        console.log('user connected!!')
        

        socket.on("startMining", async() =>{
            // console.log("local mining")
            const user = await User.findById(socket.userId);
            
            user.mining_duration = 24 * 60 *60;
        
            await user.save();
            const startTime = Date.now();
            const endTime = startTime + user.mining_duration * 1000;

            if(user.mining_status){
                return;
            }

            const intervalId = setInterval(async() =>{

                    const currentTime = Date.now();
                    const elapsedTime = currentTime - startTime     
                    const remainingTime = Math.max(0, endTime - currentTime)
                    if(currentTime>=endTime){
                        if(user.hash_rate > 0){
                            console.log("hash")
                            clearInterval(intervalId);
                                                   
                            const finalYieldPercentage = 0;
                            const totalYieldBalance = (user.hash_rate * 24 * 60 *60)*0.118
                            // const  totalYieldBalance = user.hash_rate * 5;
                            user.yield_balance += Number(parseFloat(totalYieldBalance.toFixed(10)));
                            user.yield_percentage = finalYieldPercentage;
                            user.yield_time = null;
                            user.mining_status = false;
                            await user.save();
                            return;
                        
                        }else{
                            clearInterval(intervalId);
                            console.log("no hash")
                            //  console.log("working from no hash1")                    
                            const finalYieldPercentage = 0;
                            const totalYieldBalance = 0.00000003 * 24 * 60 * 60;
                            user.yield_balance += Number(parseFloat(totalYieldBalance.toFixed(8)));
                            user.yield_percentage = finalYieldPercentage;
                            user.yield_time = null;
                            user.mining_status = false;
                            await user.save();
                            return;

                        }
                        
                    }else{
                        // console.log("no hash")
                        if(user.hash_rate > 0){
                           console.log("hash")
                            let progress = 100-(remainingTime / (user.mining_duration * 1000)) *100;
                            let remainingMinutes = remainingTime / (60 * 60 * 1000);
                            let currentYeildBalance = (user.hash_rate * (24 * 60 * 60 - remainingMinutes))*0.0000013;
                            // let currentYeildBalance = (0.00000002 * (24 * 60 * 60 - remainingMinutes))*0.000001;
                            user.yield_balance += Number(parseFloat(currentYeildBalance.toFixed(8)));
                            user.yield_percentage = progress >= 100 ? 100 : Math.ceil(progress)
                            user.yield_time = remainingTime;
                            user.mining_status = true;

                            await user.save();
                            return;
                        }else{
                            // console.log("no hash")
                            console.log("there is no hash! working from here2")
                            let progress = 100-(remainingTime / (user.mining_duration * 1000)) *100;
                            let remainingMinutes = remainingTime / (60 * 60 * 1000);
                            let currentYeildBalance = (0.00000021 * (24 * 60 * 60 - remainingMinutes))*0.000001;
                            // let currentYeildBalance = (user.hash_rate * (24 * 60 * 60 - remainingMinutes))*0.000000013;
                            user.yield_balance += Number(parseFloat(currentYeildBalance.toFixed(8)));
                            user.yield_percentage = progress >= 100 ? 100 : Math.ceil(progress)
                            user.yield_time = remainingTime;
                            user.mining_status = true;

                            await user.save();
                            console.log("balance "+user.yield_balance)
                            console.log("percent "+ user.yield_percentage)
                            return;
                        }
                    }
               
            },3500)
            if(!user.mining_status || user.yield_percentage === 0){
                startCronJob(socket, user)
            }
            
            if(user.yield_percentage === 100){
                stopCronJob()
            }

        });
        socket.on("error", (error) =>{
            console.log(error)
        });
    })
    io.on('error', (error)=>{
        console.log(error,  "error occurred")
    })
   }catch(e){
    console.log(e)
   } 
}

function startCronJob(socket, val){
    if(!cronJob){
        cronJob = cron.schedule("* * * * *", () =>{
            socket.emit("miningData", val)
        });
    }
};

function stopCronJob(){
    if(cronJob){
        cronJob.stop()
        // console.log("cron job stopped!!")
    }
}


module.exports = {
    userDashboard,
    buyHash,
    neoToUsdt,
    neoEquivalent,
    hashEquivalent,
    startMining,
    getReferredUsers
}