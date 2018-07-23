const express = require("express");
const middleware = require("./middleware.js");
const auth = require("./auth.js");
const mainRoutes = require("./routes/mainroutes.js");
const userRoutes = require("./routes/userroutes.js");

const app = express();

middleware(app);

app.use((req, res, next) => {
    res.header({
        "Content-Type": "application/json; charset=utf-8",
        "Encoding": "utf8"
    });
    next();
});

app.get("/auth", auth.validateIdentity);


app.use("/", mainRoutes);
app.use("/user", userRoutes);

app.use((req, res) => {    
    res.status(404).json({
        path: `${req.originalUrl}`,
        description: "The page you're look for doesn't exist."
    });
});

app.use((err, req, res, next) => {
    if(process.env.NODE_ENV === "dev"){
        console.log(err);

        //TODO: LOG to a file somewhere.
        return res.status(500).json({
            message: "Something went wrong.",
            error: err.message,
            usermessage: (err.usermessage) ? err.usermessage : "You didn't write an error message for yourself."
        });
    }
    

    //TODO: Log to a file somewhere and give the user a vague message.
    res.status(500).json({
        message: "Something went wrong.",
        error: err.message        
    });
});


module.exports = app;