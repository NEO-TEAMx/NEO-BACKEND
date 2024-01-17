const express = require("express");
const {
    userDashboard,
   
} = require("../controllers/dashboard.controller");
const userAuth = require("../middlewares/auth/userAuth");
const {authorizePermissions} = require("../middlewares/authorizationMiddleware");
// const userAuthMiddleware = require("../middlewares/auth/userAuth");
const router = express.Router();


router.get('/start', userAuth,authorizePermissions("user"),(req,res) =>{
    startMining(req.app.get('io'))
    res.status(200).send("mining started!!")
});

module.exports = router;