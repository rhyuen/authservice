
const jwt = require("jsonwebtoken");
const util = require("util");
const config = require("./config.js");
const wrapAsync = require("./common/wrapasync.js");

const jwtVerify = util.promisify(jwt.verify);

exports.validateIdentity = wrapAsync(async (req, res, next) => {
    try{                
        const identityToValidate = req.cookies.authservice_token || req.headers.authorization.split(" ")[1];
        // console.log(req.cookies.authservice_token);
        // console.log(req.headers.authorization);
        await jwtVerify(identityToValidate,  config[process.env.NODE_ENV].jwtSecret);        
        next();                        
    }catch(e){
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