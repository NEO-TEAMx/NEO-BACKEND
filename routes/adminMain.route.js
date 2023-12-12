const express = require("express");
const {getAllUsers,approveDeposit} = require("../controllers/adminMain.controller");
const {CheckAdminType,authorizePermissions} = require("../middlewares/authorizationmiddleware");
const adminAuth = require("../middlewares/auth/adminAuth");
const router = express.Router();

router.get("/get-all-users", adminAuth, authorizePermissions("admin"), CheckAdminType("moderators"), getAllUsers);
router.patch("/approve-deposit/:id",adminAuth, authorizePermissions("admin"), CheckAdminType("deposit-admin"), approveDeposit);


module.exports = router;