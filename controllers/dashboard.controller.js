const { StatusCodes } = require("http-status-codes");
const { NotFoundApiError, BadRequestApiError } = require("../Errors");
const User = require("../models/user.model");
const Swap = require("../models/swap.model");
const {getNeoToUsdtRate} = require("../__helpers__/generateNeoEqu");
const moment = require("moment");
const wss = require("../app");
const cron = require("node-cron");
const { use } = require("express/lib/router");

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
        throw new BadRequestApiError("Input the amount of hash to purchase!")
    }
    const hash = await User.findById(req.user.userId);
    if(!hash){
        throw new NotFoundApiError("No user witj such id")
    }
    if(hash_amount > hash.total_balance){
        throw new BadRequestApiError("Credit your wallet to purchase more hash!")
    }
    if(hash.total_balance === 0){
        throw new BadRequestApiError("Please credit your wallet, to buy hash")
    }

    const rate = hash_amount * 0.00015; 

    hash.hash_rate += rate;
    hash.total_balance -= hash_amount;
    await hash.save();

    return res.status(StatusCodes.OK).json({success:true, msg: "Successfully purchased hash!", hash})
}

//hash equivalent
const hashEquivalent = async(req,res) =>{
    const {hash_amount} = req.body;

    const equivalentVal = hash_amount * 0.00015;
    return res.json({equivalentVal: equivalentVal.toFixed(3)})
};

//neo equivalent
const neoEquivalent = async(req,res) =>{
    const {neo_amount} = req.body;
    const neoUsdtRate = await getNeoToUsdtRate();

    const usdt_equ = neo_amount * neoUsdtRate;

    return res.json({usdEqu: usdt_equ})
}

const neoToUsdt = async(req,res) =>{
    const {neo_amount} = req.body;
    const neoUsdtRate = await getNeoToUsdtRate();

    if(!neo_amount){
        throw new BadRequestApiError("Provide the needed values")
    }
    const user = await User.findById(req.user.userId);
    
    if(neo_amount > user.yield_balance){
        throw new BadRequestApiError("You are low on neo. Please mine more neo!")
    }
    req.body.user = req.user.userId
    const usdt_equ = neo_amount * neoUsdtRate;

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
            let = {
                yield_time,
                yield_balance,
                yield_percentage,
                hash_rate,
                mining_status
            } = user;
            
            yield_time = moment();
            // console.log(formatTime(yield_time))

            await user.save(formatTime(yield_time)) 
            console.log(user)
            const minningDuration = moment.duration(24, 'hours');
            
            const intervalId = setInterval(async() =>{
                console.log("start")
                let elapsedTime = moment().diff(user.yield_time);
                let remainingTime = minningDuration - elapsedTime;
                console.log(formatTime(elapsedTime))
                console.log(formatTime(remainingTime))
                // user.yield_time = remainingTime

                if(remainingTime == "00:00:00"){
                    if(user.hash_rate <= 0){
                        clearInterval(intervalId);
                        console.log("start1")
                        const finalYieldPercentage = 100;
                        const totalYieldBalance = 0.00000023 * 24 * 60;
                        user.yield_balance += Number(parseFloat(totalYieldBalance.toFixed(8)));
                        user.yield_percentage = 0;
                        user.yield_time = null;
                        await user.save();
                        return;
                    }
                    clearInterval(intervalId);
                    console.log("start2")
                    const finalYieldPercentage = 100;
                    const  totalYieldBalance = user.hash_rate * 24 * 60;
                    user.yield_balance += Number(parseFloat(totalYieldBalance.toFixed(8)));
                    user.yield_percentage = 0;
                    user.yield_time = null;
                    await user.save();
                    return;
                }else{
                    if(user.hash_rate <= 0){
                        console.log("Start3")
                        let progress = 100 - (remainingTime / minningDuration) * 100;
                        let remainingMinutes = remainingTime / (60 * 1000);
                        let currentYeildBalance = 0.00000023 * (24 * 60 - remainingMinutes);
                        user.yield_balance += Number(parseFloat(currentYeildBalance.toFixed(8)));
                        user.yield_percentage = progress >= 100 ? 100 : Math.ceil(progress)
                        user.yield_time = remainingTime;
                        console.log(user.yield_balance)
                        console.log(user.yield_percentage)
                        console.log(user.yield_time)
                        console.log(user.hash_rate)
                        await user.save();
                        return;
                    }
                    console.log("start4")
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
            
            
        });

        // const cronJ = cron.schedule("* * * * * *", () =>{
            
        //     // console.log(user)
        //     socket.on("startMining", user)
        //     socket.emit("miningData", user)
        // });

        // if(!user.mining_status || user.yield_percentage === 0){
        //     // cronJ.start();
        //     startCronJob(socket, user)
        // }
        // if(user.mining_status){
            // cronJ.stop();
        // }
    });
}

// let cronJob;

// const startMiningv = (io) =>{
//     io.on('connection', async(socket) =>{
//         console.log("A user connected!")
//         const user = await User.findById(socket.userId)
        
//         socket.on('startMining', async(val) =>{
//             console.log(user)
//             if(val === "startMining"){
//                 startCronJob(socket, user)
//             }else{
//                 stopCronJob()
//             }
//         });

        
//     });
// }

function startCronJob(socket, val){
    if(!cronJob){
        cronJob = cron.schedule("* * * * * *", () =>{
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


// const startMining = (io) =>{
//     io.on('connection', (socket) =>{
//         emitMiningData(socket)
//         socket.on('disconnect', () =>{
//             console.log("disconnected")
//         });
//     });
//     const emitMiningData = async(socket, id) =>{
//         try {
//             const user = await User.findById(socket.userId)
//             if(user){
//                 socket.emit("miningData", user)
//                 console.log(user)
//                 io.to(socket.userId)
//             }
//         } catch (error) {
//             console.error("Error occurred: ", error)
//         }
//     }
// }


const startMinings = (io) =>{
    io.on('connection', (socket) =>{
        console.log('user connected')
        socket.on('startMining', async() =>{
            const user = await User.findById(socket.userId)
            // console.log(user)
            
            let {
                yield_time,
                yield_balance,
                yield_percentage,
                hash_rate
            } = user;

            yield_time = moment();
            await User.findByIdAndUpdate(socket.userId,{yield_time});
            const minningDuration = moment.duration(24, 'hours');
            
            const intervalId = setInterval(async() => {
                if(!user){
                    clearInterval(intervalId);
                    io.send(JSON.stringify({type: 'error', message: 'User not found'}))
                    return;
                }
                let elapsedTime = moment().diff(yield_time);
                const remainingTime = minningDuration - elapsedTime;
                if(remainingTime <= 0){
                    // if user doesnt have hash_rate
                    if(hash_rate <= 0){
                        clearInterval(intervalId);
                        const finalYieldPercentage = 100;
                        const totalYieldBalance = 0.0000000023 * 24 * 60;
                        await User.findByIdAndUpdate(socket.user.Id,{
                            yield_balance: yield_balance += totalYieldBalance,
                            yield_percentage: finalYieldPercentage,
                            yield_time,
                        });
                        // console.log(user)
                        io.send(JSON.stringify({type: 'success', message: 'Mining completed!!'}))
                        return;
                    };
                    // if user have hash_rate
                    clearInterval(intervalId);
                    const finalYieldPercentage =100;
                    const  totalYieldBalance = hash_rate * 24 * 60;
                    await User.findByIdAndUpdate(socket.userId,{
                        yield_balance: yield_balance+=totalYieldBalance,
                        yield_percentage: finalYieldPercentage,
                        yield_time,
                    });
                    // console.log(user)
                    io.send(JSON.stringify({type: 'success', message: 'Mining completed!!'}))
                    return;
                }else{
                    // if there is no hashrate
                    if(hash_rate <= 0){
                        let progress = 100 - (remainingTime / minningDuration) * 100;
                        yield_percentage = progress > 100 ? 100 : progress;
                        let remainingMinutes = remainingTime / (60 * 1000);
                        let currentYeildBalance = 0.0000000023  * (24 * 60 - remainingMinutes)
                        await User.findByIdAndUpdate(socket.userId,{
                            yield_balance: yield_balance+=currentYeildBalance,
                            yield_percentage,
                            yield_time: remainingMinutes,
                        });
                        // console.log(user)
                        io.send(JSON.stringify({type: 'success', message: 'Mining completed!!'}))
                        return;
                    };
                    // if  hash_rate
                    
                    
                    yield_percentage = progress > 100 ? 100 : progress;
                    let remainingMinutes = remainingTime / (60 * 1000);
                    let currentYeildBalance = hash_rate * (24 * 60 - remainingMinutes)
                    await User.findByIdAndUpdate(socket.userId,{
                        yield_balance: yield_balance+=currentYeildBalance,
                        yield_percentage,
                        yield_time: remainingMinutes,
                    });
                    // console.log(user)
                    io.send(JSON.stringify({type: 'success', message: 'Mining completed!!'}))
                    return;   
                }
            }, 5000);
        });
    });

    // const user = await User.findById(req.user.userId)
    // console.log(user)    
    // if(!user){
    //     throw new BadRequestApiError("User not found")
    // }
    // if(user.yield_time){
    //     throw new BadRequestApiError("User is already mining!")
    // }
    // const yield_time = moment();
    
    // await User.findByIdAndUpdate(req.user.userId,{yield_time});

    
    // const intervalId = setInterval(async() =>{
    //     const elapsedTime = moment().diff(yield_time);
    //     const remainingTime = miningDuration - elapsedTime;
    //     if(remainingTime <= 0){
    //         clearInterval(intervalId);
    //         const finalYieldPercentage = 100;
    //         // const totalYieldBalance = user.hash_rate * 24; // for hours
    //         const totalYieldBalance = user.hash_rate * 24 * 60; // for minutes
    //         const x = await User.findByIdAndUpdate(req.user.userId, {
    //             yield_balance: user.yield_balance +=  totalYieldBalance,
    //             yield_percentage: finalYieldPercentage,
    //             yield_time: null,
    //         });
    //        return res.status(200).json({msg:"Mining completed successfully", x})
    //     }else{
        //     const progress = 100 - (remainingTime / miningDuration) * 100;
        //     const yield_percentage = progress > 100 ? 100 : progress;
        //     const remainingHours = remainingTime / (60 * 60 * 1000); // for hours
        //     const remainingMinutes = remainingTime / (60 * 1000); // for minutes
        //     // const currentYeildBalance = user.hash_rate * (24 - remainingHours) // for hours
        //     // const currentYeildBalance = user.hash_rate * (24 * 60 - remainingMinutes) // for minutes
        //     const currentYeildBalance = user.hash_rate * remainingMinutes;
        //     const x = await User.findByIdAndUpdate(req.user.userId, {
        //         yield_balance: user.yield_balance += currentYeildBalance,
        //         yield_percentage,
        //     });
        // //    return res.status(200).json({msg: "Miining started successfully!!", x})
        // }
        // io.emit('updateMiningData', miningData)
    // }, 1000)

    // res.status(200).json({msg: "Mining started successfully!!", user})
}



async function stimulateMining(ws){
    console.log('websocket connection initiated!!')

    const yield_time = moment();
    const miningDuration = moment.duration(24, 'hours');


    const intervalId = setInterval(async () =>{
       const user = await User.findById(req.user.userId)
        if(!user){
            clearInterval(intervalId);
            ws.send(JSON.stringify({type: 'error', message: 'User not found'}))
            return;
        }
        const elapsedTime = moment().diff(yield_time);
        const remainingTime = miningDuration - elapsedTime;
        if(remainingTime <= 0){
            clearInterval(intervalId);
            const finalYieldPercentage = 100;
            const totalYieldBalance = user.hash_rate * 24 *60;
            // const x = await User.findByIdAndUpdate(req.user.userId, {
                user.yield_balance +=  totalYieldBalance,
                user.yield_percentage = finalYieldPercentage,
                user.yield_time = null,
            // });
            ws.send(JSON.stringify({type:'update', message: 'Mining completed', 
            user: {
                ...user.toObject(),
                currentYeildBalance,
                yield_percentage,
                yield_time,
                yield_balance
            } 
            }))
        }else{
            const progress = 100 - (remainingTime / miningDuration) * 100;
            const yield_percentage = progress > 100 ? 100 : progress;
            const remainingHours = remainingTime / (60 * 60 * 1000); // for hours
            const remainingMinutes = remainingTime / (60 * 1000); // for minutes
            const currentYeildBalance = user.hash_rate * remainingMinutes;
            user.yield_balance += currentYeildBalance,
            yield_percentage,
            ws.send(JSON.stringify({
                type:'update', 
                message: 'Mining in progress',
                user: {
                    ...user.toObject(),
                    currentYeildBalance,
                    yield_percentage,
                    yield_time,
                    yield_balance
                } 
            }))
        }
    },1000)


}


module.exports = {
    userDashboard,
    buyHash,
    neoToUsdt,
    neoEquivalent,
    hashEquivalent,
    startMining,
    stimulateMining
}