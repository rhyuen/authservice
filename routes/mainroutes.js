const express = require("express");
const validator = require("validator");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");

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
            if(!data){                
                return res.status(200).json({
                    path: "login",
                    method: "POST",
                    description: "User does not exist."
                });
            }

            if(!data.validPassword(loginPassword)){
                return res.status(200).json({
                    path: "login",
                    method: "POST",
                    description: "User Exists, invalid password."
                });
            }
            
            return res.status(200).json({
                path: "login",
                method: "POST",
                description: "User Exists. Valid Password."
            });
            //if true, set cookie with jwt
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                path: "/login",
                method: "POST",
                action: "User Login",
                result: "Failure",
                details: err
            });            
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
                path: "/signup",
                method: "POST",
                action: "User Registration",
                result: `Success`,
                details: data
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                path: "/signup",
                method: "POST",
                action: "User Registration",
                result: "Failure",
                details: err
            });
        });    
});

module.exports = router;