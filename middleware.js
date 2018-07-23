const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const winston = require("winston");
const express = require("express");
const path = require("path");
const config = require("./config.js");

module.exports = (app) => {     
    app.use(express.static(path.join(__dirname, "public")));
    app.use(morgan("dev"));
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));    
    app.use(cookieParser(config["dev"].cookieSecret, {
        httpOnly: true,
        maxAge: 3600
    }));   
};