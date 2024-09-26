require("express-async-errors");
require("dotenv").config();

const express = require("express");
const cors = require('cors');
const morgan = require("morgan");
const http = require("http");
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
const subscriberRouter = require("./routes/newLetter.route");
const {startMining} = require("./controllers/dashboard.controller");
const helmet = require("helmet");
const socketio = require("socket.io");
const run = require("./seedDB");
const jwt = require("jsonwebtoken");
const app = express();
const allowedOrigins = [  
    "https://neo-protocol.com",  
    'http://localhost:8081',
    'http://localhost:7070',
    'http://localhost:4040',
    'https://neoprotocol.netlify.app',
    'https://neoadmindashboard.netlify.app'
];

const server = http.createServer(app);
const io = socketio(server,{
    cors:{
        origin: allowedOrigins,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true
    }
});

const corsOpt = {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
}
const path = require("path");
// run();

// APP CONFIG
app.set('trust proxy', 1)
app.set('io',io);
app.use(express.json());
app.use(express.static(path.resolve(__dirname, './public')))
app.use(cors(corsOpt));
app.use(cookieParser(process.env.SECRET));
app.use(morgan("dev"));
app.use(helmet());
app.use((req,res,next) =>{
    // res.setHeader('Access-Control-Allow-Origin', allowedOrigins)
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type', 'Authorization', 'Origin', 'Accept')
    res.setHeader('Access-Control-Expose-Headers', 'Authorization')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    next()
});


io.use((socket,next) =>{

    if(socket.handshake.query && socket.handshake.query.accessToken){
        jwt.verify(socket.handshake.query.accessToken, process.env.SECRET, function(err, decoded){
            if(err) return next (new Error('Authentication failed'));
            socket.userId = decoded.userId
            // socket.decoded = decoded
            next();
            
        });
    }else{
        next(new Error("Authentication failed"))
    }
//     try {
//             if(accessToken){
                 
//                 const payload = jwt.verify(accessToken, process.env.SECRET)
                
//                 socket.userId = payload.userId
//                 // console.log(socket.userId)
//                 next()
//             }
//     } catch (error) {
//             console.log(error)    
//             next(error)
//     }
    
});

//Router
app.use('/api/v1',userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/admin', adminMRouter);
app.use('/api/v1/user', withdrawalRouter);
app.use('/api/v1/user', depositRouter);
app.use('/api/v1/user', dashboardRouter);
app.use('/api/v1', subscriberRouter);
startMining(io)

app.get("/health-check", (req,res) =>{
    res.status(200).json({
        success:true, 
        msg: 'Health check successful!!'
    })
});

app.use(notFoundRoute);
app.use(ErrorMainHandler);

const port = 4040 || process.env.PORT

async function startServer(){
    try {
        await connectDB(process.env.MONGOURI)
        server.listen(port,()=>{
            console.log(`server started on port ${port}`)
        });
    } catch (error) {
        console.log(error);
    }
}

startServer();