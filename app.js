require("express-async-errors");
require("dotenv").config();

const express = require("express");
const cors = require('cors');
const morgan = require("morgan");
const http = require("http");
const WebSocket = require("ws");
const cookieParser = require("cookie-parser");
const notFoundRoute = require('./middlewares/notFound');
const connectDB = require("./config/dbConfig");
const  ErrorMainHandler = require("./middlewares/ErrorHandler");
const userRouter = require("./routes/userAuth.route");
const adminRouter = require("./routes/adminAuth.routes");
const adminMRouter = require("./routes/adminMain.route");
const withdrawalRouter = require("./routes/withdrawal.route");
const depositRouter = require("./routes/deposit.route");
const dashboardRouter = require("./routes/dashboard.route");
const stimulateMining = require("./controllers/dashboard.controller");
const User = require("./models/user.model");
const helmet = require("helmet");
const xssClean = require("xss-clean")
const run = require("./seedDB");
const app = express();


const server = http.createServer(app);
const wss = new WebSocket.Server({server});

wss.on('connection', (ws) => {
    console.log("websocket connection established")
    ws.on('message', async(data) =>{
        const message = JSON.parse(data);
        // if(message.type === 'connectUser'){
        //     const userId = message.userId;
        //     let user = await User.findById(req.user.userId)
        //     if(!user){
        //         ws.send(JSON.stringify({type:'error', messgae: 'User not found'}));
        //         return;
        //     }
        //     stimulateMining(ws,user) 
        // }
        stimulateMining(ws);
    });
    ws.on('close', () =>{
        console.log('websocket connection closed')
    })
});

// run();
// APP CONFIG
app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.SECRET));
app.use(morgan("dev"));
app.use(xssClean());
app.use(helmet());

//Router
app.use('/api/v1',userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/admin', adminMRouter);
app.use('/api/v1/user', withdrawalRouter);
app.use('/api/v1/user', depositRouter);
app.use('/api/v1/user', dashboardRouter);

app.get("/health-check", (req,res) =>{
    
    res.status(200).json({
        success:true, 
        msg: 'Health check successful!!'
    })
});

app.use(notFoundRoute);
app.use(ErrorMainHandler);

wss.on('connection', (ws) =>{
    stimulateMining(ws);
});


const port = 4040 || process.env.PORT

async function startServer(){
    try {
        await connectDB(process.env.MONGOURI)
        app.listen(port,()=>{
            console.log(`server started on port ${port}`)
        });
    } catch (error) {
        console.log(error);
    }
}

startServer();
module.exports = wss;