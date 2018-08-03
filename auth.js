
const jwt = require("jsonwebtoken");
const util = require("util");
const config = require("./config.js");
const wrapAsync = require("./common/wrapasync.js");
const jwtVerify = util.promisify(jwt.verify);

exports.validateIdentity = wrapAsync(async (req, res, next) => {        
    try{        
        if(!req.headers.authorization && !req.cookies["authservice_token"]){            
            console.log("There is no authoirzation token or cookie accompanying the request.");
            return res.redirect("/login");            
        }                                
        
        const identityToValidate = req.cookies["authservice_token"] || req.headers.authorization.split(" ")[1];        
        const validationResult = await jwtVerify(identityToValidate, config.getSecrets().jwtSecret)
            .catch(e => {
                console.error("JWT token verification failed. Error: %s", e); 
                throw new Error("Jwt issue is here.");
            });                       
        console.log(validationResult);
        req.cookies.details = validationResult;       
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
        if(process.env.NODE_ENV === "prod"){
            res.redirect("/login");
        }else{
            return res.status(401).json({
                message: "An unexpected case for your auth happened.",
                devMessage: e.message,
                error: e
            });
        }     
    }    
});