const express = require("express");
const router = express.Router();

const {subscribeNL} = require("../controllers/newLetter.controller");

router.post("/subscribe", subscribeNL);


module.exports = router;