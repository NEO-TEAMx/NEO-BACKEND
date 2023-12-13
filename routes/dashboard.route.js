const express = require("express");
const {userDashboard} = require("../controllers/dashboard.controller");
const userAuth = require("../middlewares/auth/userAuth");
const {authorizePermissions} = require("../middlewares/authorizationmiddleware");
const router = express.Router();



router.get("/dashboard/:id", userAuth, authorizePermissions("user"), userDashboard);




module.exports = router;