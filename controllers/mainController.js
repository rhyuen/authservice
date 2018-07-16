const jwt = require("jsonwebtoken");
const Joi = require("joi");
const util = require("util");
const uuid = require("uuid");
const User = require("../models/user.js");
const wrapAsync = require("../common/wrapasync.js");
const config = require("../config.js");

exports.index = wrapAsync(async(req, res) => {
    res.status(200).json({
        path: "/",
        description: "root",
        options: [
            "POST /login",
            "POST /signup",
            "POST /forgot"
        ]
    });
});

exports.login =  wrapAsync(async(req, res) => {
    res.status(200).json({
        title: "login page",
        message: "{user: 'usernametologin', password: 'passwordtexttologin'}"
    });
});

exports.processLogin = wrapAsync(async(req, res) => {    

    const validCredentials = await isCredentialsValid(req.body.username, req.body.password);
       
    const foundUser = await User.findOne({username: validCredentials.username});        
    if(!foundUser){                
        return res.status(200).json({
            path: "login",
            method: "POST",
            description: `${validCredentials.username} does not exist.`
        });
    }

    if(!foundUser.validPassword(validCredentials.password)){
        return res.status(200).json({
            path: "login",
            method: "POST",
            description: `${validCredentials.username} exists, invalid password.`
        });
    }

    const signedToken = await generateJWT(validCredentials.username);
    
    res.cookie("authservice_token", signedToken, {
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    });

    return res.status(200).json({
        path: "login",
        method: "POST",
        description: "User Exists. Valid Password.",
        token: signedToken
    });                                                                                 
});

const generateJWT = async(username) => {
    const tokenOptions = {
        issuer: "authservice",
        expiresIn: "1h"
    };

    const tokenPayload = {
        username: username,
        jti: uuid.v4().toString(),
        iat: Math.floor(Date.now()/1000)
    };
    const signToken = util.promisify(jwt.sign);
    const newlyMintedToken = await signToken(
        tokenPayload, 
        config[process.env.NODE_ENV].jwtSecret, 
        tokenOptions
    );
    return newlyMintedToken;
};


const isCredentialsValid = async (username, password) => {
    const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)        
    }).with("username", "password");

    const {error, value} = Joi.validate({
        username: username, 
        password: password
    }, schema);

    if (error){        
        throw new Error("New User Validation Failed. Error: " + error);
    }

    return {username: value.username, password: value.password};
};

exports.handleSignup = wrapAsync(async(req, res) => {       
    const scannedValues = await isCredentialsValid(req.body.username, req.body.password);          
        
    const latestUser = new User();
    latestUser.username = scannedValues.username;
    latestUser.password = latestUser.generateHash(scannedValues.password);

    try{
        const savedUser = await latestUser.save();    
        res.status(201).json({
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
});

exports.handleForgotPassword = wrapAsync(async(req, res) => {
    const forgotUsername = req.body.username;
    const result = await User.findOne({username: forgotUsername});
    if(!result){       
        return res.status(200).json({
            path: "forgot",
            method: "POST",
            action: "Reset user credentials",
            result: "User does not exist",
            details: `Details for ${forgotUsername}`
        });
    }

     //TODO: Pass username to email service.

    return res.status(200).json({
        path: "forgot",
        method: "POST",
        action: "Reset user credentials",
        result: "SUCCESS",
        details: `Details for ${forgotUsername}`
    });
});