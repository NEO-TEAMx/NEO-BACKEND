const express = require("express");
const {userDashboard,buyHash} = require("../controllers/dashboard.controller");
const userAuth = require("../middlewares/auth/userAuth");
const {authorizePermissions} = require("../middlewares/authorizationmiddleware");
const router = express.Router();



router.get("/dashboard/:id", userAuth, authorizePermissions("user"), userDashboard);
router.patch("/buy-hash/:id",userAuth, authorizePermissions("user"), buyHash);



module.exports = router;