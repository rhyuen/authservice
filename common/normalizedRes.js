exports.normalizedResponse = (req, res, statusCode, customMessage) => {
    res.status(statusCode).json({        
        message: customMessage        
    });
};