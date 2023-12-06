const express = require("express");
const router = express();
const {
    adminLogin,
    adminSignup,
    getAllAdmin,
    deleteAdmin,
    adminUpdatePassword
} = require("../controllers/admin.controller");
const {authorizePermissions,checkAdmin} = require("../middlewares/authorizationmiddleware");
const authMiddleware = require("../middlewares/authMiddleware");


router.post('/register', adminSignup);
router.post('/login', adminLogin);
router.get('/get-all-admin', getAllAdmin);
router.patch('/update-password', authMiddleware,adminUpdatePassword);
router.delete('/delete-admin/:id', deleteAdmin);

module.exports = router;