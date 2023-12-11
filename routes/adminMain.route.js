const express = require("express");
const {getAllUsers} = require("../controllers/adminMain.controller");
const {CheckAdminType,authorizePermissions} = require("../middlewares/authorizationmiddleware");
const adminAuth = require("../middlewares/auth/adminAuth");
const router = express.Router();

router.get("/get-all-users", adminAuth, authorizePermissions("admin"), CheckAdminType("moderators"), getAllUsers);



module.exports = router;