const jwt = require("jsonwebtoken");
const Joi = require("joi");
const util = require("util");
const uuid = require("uuid");
const User = require("../models/user.js");
const wrapAsync = require("../common/wrapasync.js");
const respond = require("../common/normalizedRes.js");
const config = require("../config.js");

exports.index = wrapAsync(async (req, res) => {
    let message = "OPTIONS:  /login[POST] /signup[POST] /forgot[GET]";
    return respond(req, res, 200, "Home Page/Route", message);
});

exports.login = wrapAsync(async (req, res) => {
    return respond(req, res, 200, "LoginPage", "{'username':'usernameToLogin', 'password':'loginpassword'}");
});

exports.processLogin = wrapAsync(async (req, res) => {
    console.dir(req.body);
    console.log(req.body.username);
    console.log(req.body.password);
    const validCredentials = await isCredentialsValid(req.body.username, req.body.password);
    const foundUser = await User.findOne({
        username: validCredentials.username
    });

    if (!foundUser) {
        return respond(req, res, 404, "Logging in", `${validCredentials.username} does not exist.`);
    }

    if (!foundUser.validPassword(validCredentials.password)) {
        return respond(req, res, 401, "Logging in", `${validCredentials.username} exists, invalid password.`);
    }

    const signedToken = await generateJWT(validCredentials.username);

    res.cookie("authservice_token", signedToken, {
        expires: new Date(Date.now() + 360000),
        httpOnly: true
    });

    //TODO: Redirect User to User.html Page and load personal User Data.
    console.log(req.headers["user-agent"]);
    if (process.env["NODE_ENV"] === "prod") {
        //TODO: Make redirect cloud/paas agnostic.
        return res.status(302).redirect("https://royuroot.now.sh/user.html");
    } else {
        return res.status(200).json({
            message: "success"
        });
        // return res.status(302).redirect("/user/");
    }
});

const generateJWT = async (username) => {
    const tokenOptions = {
        issuer: "authservice",
        expiresIn: "1h"
    };

    const tokenPayload = {
        username: username,
        jti: uuid.v4().toString(),
        iat: Math.floor(Date.now() / 1000)
    };
    const signToken = util.promisify(jwt.sign);
    const newlyMintedToken = await signToken(
        tokenPayload,
        config.getSecrets().jwtSecret,
        tokenOptions
    );
    return newlyMintedToken;
};


const isCredentialsValid = async (username, password) => {
    const schema = Joi.object().keys({
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
    }).with("username", "password");

    const {
        error,
        value
    } = Joi.validate({
        username: username,
        password: password
    }, schema);

    if (error) {
        throw new Error("New User Validation Failed. Error: " + error);
    }

    return {
        username: value.username,
        password: value.password
    };
};

exports.handleSignup = wrapAsync(async (req, res) => {
    const scannedValues = await isCredentialsValid(req.body.username, req.body.password);

    const latestUser = new User();
    latestUser.username = scannedValues.username;
    latestUser.password = latestUser.generateHash(scannedValues.password);

    try {
        const savedUser = await latestUser.save();
        return respond(req, res, 201, "User Registration", `${savedUser} created successfully.`);
    } catch (e) {
        if (e.code === 11000) {
            return respond(req, res, 500, "User Registration Failure", `'${latestUser.username}' already exists.`);
        }
        throw (e);
    }
});

exports.handleForgotPassword = wrapAsync(async (req, res) => {
    const forgotUsername = req.body.username;
    const result = await User.findOne({
        username: forgotUsername
    });
    if (!result) {
        return respond(req, res, 404, "Reset User Credentials", `${forgotUsername} does not exist.`);
    }

    //TODO: Pass username to email service.
    //TODO: Send email with JWT that lasts for five minutes
    //TODO: Direct the email to screen that lets that user change their pw.
    //TODO: update model with new pw.

    return respond(req, res, 200, "Reset User Credentials", `Details for ${forgotUsername} reset.`);
});

exports.handleLogout = wrapAsync(async (req, res) => {
    res.clearCookie("authservice_token", {
        expires: new Date(Date.now() - 3600)
    });
    console.log("cookie cleared. %s", res.cookie("authservice_token"));
    console.log(res.cookie);
    // res.cookie("authservice_token", {        
    //     expires: new Date(Date.now() - 360000),
    //     httpOnly: true
    // });
    res.status(302).redirect("/");
});