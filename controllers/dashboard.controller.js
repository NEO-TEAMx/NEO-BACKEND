const { StatusCodes } = require("http-status-codes");
const { NotFoundApiError, BadRequestApiError } = require("../Errors");
const User = require("../models/user.model");
const Swap = require("../models/swap.model");
const {getNeoToUsdtRate} = require("../__helpers__/generateNeoEqu");
const moment = require("moment");
const cron = require("node-cron");

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

    if(!hash_amount){
        throw new BadRequestApiError("Input the amount of hash to purchase")
    }
    const user = await User.findById(req.user.userId);
    if(!user){
        throw new NotFoundApiError("No user with such id")
    }
    if(hash_amount > user.total_balance){
        throw new BadRequestApiError("Credit your wallet to purchase more hash!")
    }
    if(user.total_balance <= 0){
        throw new BadRequestApiError("Please credit your wallet, to buy hash")
    }

    const rate = hash_amount * 0.00015; 

    user.hash_rate += rate;
    user.total_balance -= hash_amount;
   
    // referral logic
    if(user.referredBy){
        const referringUser = await User.findById(user.referredBy)
        
        if(referringUser){
            referringUser.hash_rate += 0.0000075
            await referringUser.save();
        }
    }

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
        username: user.username,
        commission: 0.0000075
    }));

    return res.status(200).json({referralData, refLink})
}


//hash equivalent
const hashEquivalent = async(req,res) =>{
    const {hash_amount} = req.body;

    const equivalentVal = hash_amount * 0.00015;
    return res.json({equivalentVal: equivalentVal.toFixed(4)})
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

function formatTime(val){
    const parsedDate = moment(val);
    return parsedDate.format('HH:mm:ss')
}

let cronJob;

const startMining = (io) =>{
    io.on('connection', (socket) =>{
        // console.log('user connected!!')
        socket.on("startMining", async() =>{
            const user = await User.findById(socket.userId);
            
            user.mining_duration = 24 * 60 *60;
        
            await user.save();
            const startTime = Date.now();
            const endTime = startTime + user.mining_duration * 1000;

            // console.log(user)

            if(user.mining_status){
                return;
            }

            const intervalId = setInterval(async() =>{

                    const currentTime = Date.now();
                    const elapsedTime = currentTime - startTime     
                    const remainingTime = Math.max(0, endTime - currentTime)
                    if(currentTime>=endTime){
                        if(user.hash_rate <= 0){
                            clearInterval(intervalId);
                            
                            const finalYieldPercentage = 0;
                            const totalYieldBalance = 0.000000002 * 24 * 60;
                            user.yield_balance += Number(parseFloat(totalYieldBalance.toFixed(8)));
                            user.yield_percentage = finalYieldPercentage;
                            user.yield_time = null;
                            user.mining_status = false;
                            await user.save();
                            return;

                        }else{
                            clearInterval(intervalId);
                            
                            const finalYieldPercentage = 0;
                            const  totalYieldBalance = user.hash_rate * 24 * 60;
                            user.yield_balance += Number(parseFloat(totalYieldBalance.toFixed(8)));
                            user.yield_percentage = finalYieldPercentage;
                            user.yield_time = null;
                            user.mining_status = false;
                            await user.save();
                            return;
                        }
                        // clearInterval(intervalId);

                        // // set  progress and others to full
                        // const finalYieldPercentage = 100;
                        // const totalYieldBalance = 0.000000023 * 24 * 60;
                        // user.yield_balance += Number(parseFloat(totalYieldBalance.toFixed(8)));
                        // user.yield_percentage = finalYieldPercentage;
                        // user.yield_time = null;
                        // user.mining_status = false
                        // await user.save();
                        // return;
 
                    }else{
                        if(user.hash_rate <= 0){
                            let progress = 100-(remainingTime / (user.mining_duration * 1000)) *100;
                            let remainingMinutes = remainingTime / (60 * 1000);
                            let currentYeildBalance = 0.000000002 * (24 * 60 - remainingMinutes);
                            user.yield_balance += Number(parseFloat(currentYeildBalance.toFixed(8)));
                            user.yield_percentage = progress >= 100 ? 100 : Math.ceil(progress)
                            user.yield_time = remainingTime;
                            user.mining_status = true;

                            // console.log(`Remaining time: ${formatTime(remainingTime)}`)
                            // console.log(`yield time: ${formatTime(user.yield_time)}`)
                            // console.log(`percentage: ${user.yield_percentage}`)
                            // console.log(`balance ${user.yield_balance}`)
                            // console.log(remainingTime)                   
                            // console.log(elapsedTime)
                            // console.log(user.mining_status)
                            await user.save();
                            return;
                        }else{
                            let progress = 100-(remainingTime / (user.mining_duration * 1000)) *100;
                            let remainingMinutes = remainingTime / (60 * 1000);
                            let currentYeildBalance = user.hash_rate * (24 * 60 - remainingMinutes);
                            user.yield_balance += Number(parseFloat(currentYeildBalance.toFixed(8)));
                            user.yield_percentage = progress >= 100 ? 100 : Math.ceil(progress)
                            user.yield_time = remainingTime;
                            user.mining_status = true;

                            await user.save();
                            return;
                        }
                    }
                    // let progress = (elapsedTime / (user.mining_duration * 1000)) * 100;
                    // let progress = 100-(remainingTime / (user.mining_duration * 1000)) *100;
                    // let remainingMinutes = remainingTime / (60 * 1000);
                    // let currentYeildBalance = 0.000000023 * (24 * 60 - remainingMinutes);
                    // user.yield_balance += Number(parseFloat(currentYeildBalance.toFixed(8)));
                    // user.yield_percentage = progress >= 100 ? 100 : Math.ceil(progress)
                    // user.yield_time = remainingTime;
                    // user.mining_status = true;

                // console.log(`Remaining time: ${formatTime(remainingTime)}`)
                // console.log(`yield time: ${formatTime(user.yield_time)}`)
                // console.log(`percentage: ${user.yield_percentage}`)
                // console.log(`balance ${user.yield_balance}`)
                // console.log(remainingTime)                   
                // console.log(elapsedTime)
                // console.log(user.mining_status)
                // await user.save();
                // return;
            },2000)
            if(!user.mining_status || user.yield_percentage === 0){
                // cronJ.start();
                startCronJob(socket, user)
            }
            
            if(user.yield_percentage === 100){
                stopCronJob()
            }

        })
    })
}

const startMiningt = (io) =>{
    io.on('connection', async(socket) =>{
        console.log("A user connected!")
        // const user = await User.findById(socket.userId)
        // let = {
        //     yield_time,
        //     yield_balance,
        //     yield_percentage,
        //     hash_rate,
        //     mining_status
        // } = user;

        socket.on('startMining', async() =>{
            const user = await User.findById(socket.userId)
            
            user.yield_time = moment();
            // console.log(formatTime(yield_time))

            await user.save() 
            console.log(user)
            const minningDuration = moment.duration(24, 'hours');
           
            const intervalId = setInterval(async() =>{
                console.log("start")
                let elapsedTime = moment().diff(user.yield_time);
                let remainingTime = minningDuration - elapsedTime;
                console.log(remainingTime)
                console.log(elapsedTime)
                console.log(formatTime(minningDuration))
                console.log(formatTime(elapsedTime))
                console.log(formatTime(remainingTime))
                // user.yield_time = remainingTime

                if(remainingTime <= 0){
                    if(user.hash_rate <= 0){
                        clearInterval(intervalId);
                        console.log("start1")
                        const finalYieldPercentage = 100;
                        const totalYieldBalance = 0.000000023 * 24 * 60;
                        user.yield_balance += Number(parseFloat(totalYieldBalance.toFixed(8)));
                        user.yield_percentage = 0;
                        user.yield_time = null;
                        await user.save();
                        return;
                    }else{
                        clearInterval(intervalId);
                        console.log("start2")
                        const finalYieldPercentage = 100;
                        const  totalYieldBalance = user.hash_rate * 24 * 60;
                        user.yield_balance += Number(parseFloat(totalYieldBalance.toFixed(8)));
                        user.yield_percentage = 0;
                        user.yield_time = null;
                        await user.save();
                        return;
                    }
                }else{
                    if(user.hash_rate <= 0){
                        console.log("Start3")
                        let progress = 100 - (remainingTime / minningDuration) * 100;
                        let remainingMinutes = remainingTime / (60 * 1000);
                        let currentYeildBalance = 0.00000023 * (24 * 60 - remainingMinutes);
                        user.yield_balance += Number(parseFloat(currentYeildBalance.toFixed(8)));
                        user.yield_percentage = progress >= 100 ? 100 : Math.ceil(progress)
                        user.yield_time = remainingTime;
                        
                        await user.save();
                        return;
                    }
                    // console.log("start4")
                    let progress = 100 - (remainingTime / minningDuration) * 100;
                    let remainingMinutes = remainingTime / (60 * 1000);
                    let currentYeildBalance = user.hash_rate * (24 * 60 - remainingMinutes);
                    user.yield_balance += Number(parseFloat(currentYeildBalance.toFixed(8)));
                    user.yield_percentage = progress >= 100 ? 100 : Math.ceil(progress)
                    user.yield_time = remainingTime;

                    await user.save();
                    return;
                }

                // await user.save();
            },5000)
            
            if(!user.mining_status || user.yield_percentage === 0){
                // cronJ.start();
                startCronJob(socket, user)
            }
            
            if(user.yield_percentage === 100){
                stopCronJob()
            }
        });

    });        
}        


function startCronJob(socket, val){
    if(!cronJob){
        cronJob = cron.schedule(" * * * * * ", () =>{
            socket.emit("miningData", val)
        });
    }
};

function stopCronJob(){
    if(cronJob){
        cronJob.stop()
        console.log("cron job stopped!!")
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