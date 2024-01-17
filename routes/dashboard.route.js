const express = require("express");
const {
    userDashboard,
    buyHash,
    neoToUsdt,
    startMining,
    neoEquivalent,
    hashEquivalent,
} = require("../controllers/dashboard.controller");
const userAuth = require("../middlewares/auth/userAuth");
const {authorizePermissions} = require("../middlewares/authorizationMiddleware");
// const userAuthMiddleware = require("../middlewares/auth/userAuth");
const router = express.Router();



router.get("/dashboard", userAuth, authorizePermissions("user"), userDashboard);
router.patch("/buy-hash",userAuth, authorizePermissions("user"), buyHash);
router.post("/swap", userAuth, authorizePermissions("user"),neoToUsdt);
router.post("/neo-equivalent", userAuth, authorizePermissions("user"),neoEquivalent);
router.post("hash_equivalent", userAuth, authorizePermissions("user"), hashEquivalent);
// router.get("/start-mining", userAuth, authorizePermissions("user"),startMining());
// router.patch("/cancel-mining", userAuth, authorizePermissions("user"), cancelMining);

// router.get('/start', (req,res) =>{
//     startMining(req.app.get('io'))
//     res.status(200).send("mining started!!")
// });

module.exports = router;