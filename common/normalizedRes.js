module.exports = (req, res, statusCode, attemptedAction="Canned Message", customMessage = "Another Canned Message", data = []) => {
    if(statusCode === 500){
        //TODO: Some logging stuff
        res.status(statusCode).json({        
            time: new Date().toLocaleString(),
            useragent: req.headers["user-agent"],
            path: req.path,
            method: req.method,
            action: attemptedAction,
            message: customMessage,
            data: data    
        });
    }else{
        res.status(statusCode).json({        
            time: new Date().toLocaleString(),
            useragent: req.headers["user-agent"],
            path: req.path,
            method: req.method,
            action: attemptedAction,
            message: customMessage        
        });
    }
};