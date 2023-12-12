const express = require("express");
const {requestDeposit,DepositlHistory} = require("../controllers/deposit.controller");
const {authorizePermissions} = require("../middlewares/authorizationmiddleware");
const userAuth = require("../middlewares/auth/userAuth"); 
const router = express.Router();


router.get("/deposit-history", userAuth, authorizePermissions("user"), DepositlHistory);
router.post("/deposit", userAuth, authorizePermissions("user"), requestDeposit);


module.exports = router;