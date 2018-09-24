const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const express = require("express");
const path = require("path");
const config = require("./config.js");

module.exports = (app) => {
    app.use(express.static(path.join(__dirname, "public")));
    app.use(morgan("dev"));
    app.use(helmet());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());
    app.use(cookieParser(config.getSecrets().cookieSecret, {
        httpOnly: true,
        maxAge: 3600
    }));
};

// function isEnvironmentSecure(){
//     const cookieOptions = {
//         httpOnly: true, 
//         maxAge: 3600
//     };
//     if(process.env.NODE_ENV === "dev"){
//         return cookieOptions;
//     }else{
//         return Object.assign(cookieOptions, {secure: true});        
//     }
// }