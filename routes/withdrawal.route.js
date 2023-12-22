const express = require("express");
const {requestWithdrawl,withdrawalHistory} = require("../controllers/withdrawal.controller");
const {authorizePermissions} = require("../middlewares/authorizationMiddleware");
const userAuth = require("../middlewares/auth/userAuth"); 
const router = express.Router();


router.get("/withdrawal-history", userAuth, authorizePermissions("user"), withdrawalHistory);
router.post("/withdrawal", userAuth, authorizePermissions("user"), requestWithdrawl);


module.exports = router;