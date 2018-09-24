const express = require("express");
const cors = require("cors");
const main = require("../controllers/mainController.js");

const router = express.Router();

const corsOptions = {
    origin: "http://localhost:8081"
}

router.get("/", main.index);
router.get("/login", main.login)
    .post("/login", cors(corsOptions), main.processLogin);

router.post("/signup", main.handleSignup);
router.post("/forgot", main.handleForgotPassword);

module.exports = router;