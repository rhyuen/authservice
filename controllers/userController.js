const wrapAsync = require("../common/wrapasync.js");
const respond = require("../common/normalizedRes.js");
const User = require("../models/user.js");

exports.getLoggedIn = wrapAsync(async(req, res) => {    
    const self = await User.find({username: req.cookies.details.username});
    return respond(req, res, 200, "Get Self User (Authorized)", "Getting Self User Data", self);    
});

exports.getNamedUser = wrapAsync(async(req, res) => {
    const namedTarget = req.params.username;
    const foundTarget = await User.findOne({username: namedTarget});
    res.status(200).json({
        path: `/users/${namedTarget}`,
        details: foundTarget ? foundTarget : `${namedTarget} doesn't exist.`
    });
});

exports.handleLogout = wrapAsync(async(req, res) => {    
    console.log("cookie cleared. %s", res.cookie("authservice_token"));
    console.log(res.cookie);
    res.cookie("authservice_token", {        
        expires: new Date(Date.now() - 360000),
        httpOnly: true
    });
    res.redirect("/");
});

//TODO: Add user details fields
//TODO: Add user details modify route.

exports.getAdmin = wrapAsync(async(req, res) => {
    if(process.env.NODE_ENV === "prod"){
        res.status(302).redirect("/");
    }else{
        const users = await User.find({});
        res.status(200).json({
            path: "/users",
            users
        });
    }    
});