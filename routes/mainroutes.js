const express = require("express");
const validator = require("validator");
const User = require("../models/user.js");

const router = express.Router();

router.get("/", async(req, res) => {
    res.status(200).json({
        path: "/",
        description: "root"
    });
});

router.post("/login", async(req, res) => {
    const loginUserName = req.body.username;
    const loginPassword = req.body.password;
    User.findOne({username: loginUserName})
        .then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
    //Auth
    //Assign Cookie with JWT
});

router.post("/signup", async(req, res) => {
    const signupUserName = req.body.username;
    const signupPassword = req.body.password;
    const latestUser = new User();
    latestUser.username = signupUserName;
    latestUser.password = latestUser.generateHash(signupPassword);

    latestUser.save()
        .then(data => {
            console.log(data);
            res.status(200).json({
                message: `Success: User Added`,
                description: `${data}`
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                message: "Error",
                description: `${err}`
            })
        });    
});

module.exports = router;