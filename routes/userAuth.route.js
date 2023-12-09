const express = require("express");
const { 
    register,
    login,
    logout,
    forgetPassword,
    resetPassword,
    updatePassword
} = require("../controllers/userAuth.controller");
const userAuthMiddleware = require("../middlewares/auth/userAuth");
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch("/update-password", updatePassword);
router.post("/reset-password", resetPassword);
router.post("/forget-password", forgetPassword);
router.delete('/logout', userAuthMiddleware, logout);

module.exports = router;