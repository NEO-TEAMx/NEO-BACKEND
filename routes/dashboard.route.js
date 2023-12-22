const express = require("express");
const {
    userDashboard,
    buyHash,
    neoToUsdt,
    startMining,

} = require("../controllers/dashboard.controller");
const userAuth = require("../middlewares/auth/userAuth");
const {authorizePermissions} = require("../middlewares/authorizationMiddleware");
const router = express.Router();



router.get("/dashboard", userAuth, authorizePermissions("user"), userDashboard);
router.patch("/buy-hash",userAuth, authorizePermissions("user"), buyHash);
router.post("/swap", userAuth, authorizePermissions("user"),neoToUsdt);
router.post("/start-mining", userAuth, authorizePermissions("user"),startMining);
// router.patch("/cancel-mining", userAuth, authorizePermissions("user"), cancelMining);

module.exports = router;