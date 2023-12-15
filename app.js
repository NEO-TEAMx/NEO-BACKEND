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
const helmet = require("helmet");
const xssClean = require("xss-clean")
const run = require("./seedDB");
const app = express();

const server = http.createServer(app);
const wss = new WebSocket.Server({server})

// run();
// APP CONFIG
app.use(express.json());
app.use(cors());
app.use(cookieParser('secret'));
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
    console.log(req.signedCookies)
    // console.log(req.headers)
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
        app.listen(port,()=>{
            console.log(`server started on port ${port}`)
        });
    } catch (error) {
        console.log(error);
    }
}

startServer();
module.exports = {wss}