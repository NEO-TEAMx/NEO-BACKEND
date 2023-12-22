const express = require("express");
const router = express();
const {
    adminLogin,
    adminSignup,
    getAllAdmin,
    deleteAdmin,
    adminUpdatePassword,
    showCurrentUser,
} = require("../controllers/adminAuth.controller");
const {authorizePermissions,checkAdmin,CheckAdminType} = require("../middlewares/authorizationMiddleware");
const adminAuth = require("../middlewares/auth/adminAuth");

router.post('/register', adminSignup);
router.post('/login', adminLogin);
router.get('/get-all-admin',adminAuth,CheckAdminType("main-admin"), getAllAdmin);
router.get("/show-me", adminAuth, showCurrentUser);
router.patch('/update-password', adminAuth,adminUpdatePassword);
router.delete('/delete-admin/:id', CheckAdminType("main-admin"),adminAuth,deleteAdmin);

module.exports = router;