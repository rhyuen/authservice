const express = require("express");
const main = require("../controllers/mainController.js");

const router = express.Router();

router.get("/", main.index);
router.get("/login", main.login)
    .post("/login", main.processLogin);

router.post("/signup", main.handleSignup);
router.post("/forgot", main.handleForgotPassword);

module.exports = router;