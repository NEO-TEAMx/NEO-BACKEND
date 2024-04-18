const express = require("express");
const { 
    register,
    login,
    logout,
    forgetPassword,
    resetPassword,
    updatePassword,
    showMe,
    contactMail
} = require("../controllers/userAuth.controller");
const userAuthMiddleware = require("../middlewares/auth/userAuth");
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch("/update-password", userAuthMiddleware,updatePassword);
router.post("/reset-password", resetPassword);
router.post("/forget-password", forgetPassword);
router.delete('/logout', userAuthMiddleware, logout);
router.get("/show-me", userAuthMiddleware, showMe);
router.post("/contact", contactMail)

module.exports = router;