
const jwt = require("jsonwebtoken");
const util = require("util");
const config = require("./config.js");
const wrapAsync = require("./common/wrapasync.js");
const jwtVerify = util.promisify(jwt.verify);

exports.validateIdentity = wrapAsync(async (req, res, next) => {        
    try{        
        if(!req.headers.authorization && !req.cookies["authservice_token"]){
            const error = new Error("No authorization header or no jwt in cookie.");
            error.status = 400;            
            throw error;
        }                                
        
        const identityToValidate = req.cookies["authservice_token"] || req.headers.authorization.split(" ")[1];
        console.log(identityToValidate);
        const validationResult = await jwtVerify(identityToValidate, config.getSecrets().jwtSecret).catch(e => {
            console.error("JWT token verification failed. Error: %s", e);            
        });                       
        console.log(validationResult);        
        return next(); 
    }catch(e){
        console.log("There was an Auth Error\n %s", e);
        if(e.name === "JsonWebTokenError"){
            return res.status(401).json({
                message: "Wrong signature for your token.",
                error: e
            });
        }
        if(e.name === "TokenExpiredError"){
            return res.status(401).json({
                message: "You need to sign in or your token is expired.",
                error: e
            });
        }                                         
        return res.status(401).json({
            message: "An unexpected case for your auth happened.",
            error: e
        });
    }    
});