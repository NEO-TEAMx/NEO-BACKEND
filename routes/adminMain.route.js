const express = require("express");
const {
    getAllUsers,
    approveDeposit,
    allDeposit,
    allWithdrawal,
    approveWithdrawal,
    addDeposit,
} = require("../controllers/adminMain.controller");
const {CheckAdminType,authorizePermissions} = require("../middlewares/authorizationmiddleware");
const adminAuth = require("../middlewares/auth/adminAuth");
const router = express.Router();

router.get("/get-all-users", adminAuth, authorizePermissions("admin"), CheckAdminType("moderators","deposit-admin","withdrawal-admin","main-admin"), getAllUsers);
router.patch("/approve-deposit/:id",adminAuth, authorizePermissions("admin"), CheckAdminType("deposit-admin","main-admin"), approveDeposit);
router.get("/all-deposit", adminAuth, authorizePermissions("admin"), CheckAdminType("deposit-admin","main-admin"), allDeposit)
router.patch("/add-deposit/:id", adminAuth, authorizePermissions("admin"), CheckAdminType("deposit-admin","main-admin"), addDeposit)
router.get("/all-withdrawal", adminAuth, authorizePermissions("admin"), CheckAdminType("withdrawal-admin","main-admin"), allWithdrawal)
router.patch("/approve-withdrawal/:id", adminAuth, authorizePermissions("admin"), CheckAdminType("withdrawal-admin","main-admin"), approveWithdrawal)



module.exports = router;