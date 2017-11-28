const express = require("express");
const validator = require("validator");
const User = require("../models/user.js");
const config = require("../config.js");
const wrapAsync = require("../common/wrapasync.js");
const jwt = require("jsonwebtoken");
const util = require("util");
const uuid = require("uuid");

const router = express.Router();

router.get("/", async(req, res) => {
    res.status(200).json({
        path: "/",
        description: "root"
    });
});

router.post("/login", wrapAsync(async(req, res) => {
    const loginUserName = req.body.username;
    const loginPassword = req.body.password;
       
    const foundUser = await User.findOne({username: loginUserName});        
    if(!foundUser){                
        return res.status(200).json({
            path: "login",
            method: "POST",
            description: `${loginUserName} does not exist.`
        });
    }

    if(!foundUser.validPassword(loginPassword)){
        return res.status(200).json({
            path: "login",
            method: "POST",
            description: `${loginUserName} exists, invalid password.`
        });
    }

    const tokenOptions = {
        issuer: "authservice",
        expiresIn: "1h"
    };

    const tokenPayload = {
        username: foundUser.username,
        jti: uuid.v4().toString(),
        iat: Math.floor(Date.now()/1000)
    };
    const signToken = util.promisify(jwt.sign);
    const signedToken = await signToken(
        tokenPayload, 
        config[process.env.NODE_ENV].jwtSecret, 
        tokenOptions);        
    
    res.cookie("authservice_token", signedToken, {
        expires: new Date(Date.now() + 36000),
        httpOnly: true
    });

    return res.status(200).json({
        path: "login",
        method: "POST",
        description: "User Exists. Valid Password.",
        token: signedToken
    });                                                                                 
}));

router.post("/signup", wrapAsync(async(req, res) => {
    const signupUserName = req.body.username;
    const signupPassword = req.body.password;
    const latestUser = new User();
    latestUser.username = signupUserName;
    latestUser.password = latestUser.generateHash(signupPassword);

    try{
        const savedUser = await latestUser.save();    
        res.status(200).json({
            path: "/signup",
            method: "POST",
            action: "User Registration",
            result: `Success`,
            details: savedUser
        });    
    }catch(e){           
        if(e.code === 11000){                
            return res.status(500).json({
                path: "/signup",
                method: "POST",
                action: "User Registration",
                result: "Failure",
                details: "Username already exists."
            });
        }            
        throw(e);                     
    }       
}));

module.exports = router;