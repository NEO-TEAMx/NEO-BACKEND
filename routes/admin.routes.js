const express = require("express");
const router = express();
const {
    adminLogin,
    adminSignup,
    getAllAdmin,
    deleteAdmin,
    adminUpdatePassword,
    showCurrentUser,
    t
} = require("../controllers/admin.controller");
const {authorizePermissions,checkAdmin,CheckAdminType} = require("../middlewares/authorizationmiddleware");
const adminAuth = require("../middlewares/auth/adminAuth");
const { check } = require("express-validator");


router.post('/register', adminSignup);
router.post('/login', adminLogin);
router.get('/get-all-admin', getAllAdmin);
router.get("/show-me", adminAuth, showCurrentUser);
router.patch('/update-password', adminAuth,adminUpdatePassword);
router.delete('/delete-admin/:id', deleteAdmin);
router.get('/t',adminAuth,CheckAdminType,t)

module.exports = router;