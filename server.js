const express = require("express");
const mainRoutes = require("./routes/mainroutes.js");
const userRoutes = require("./routes/userroutes.js");
const middleware = require("./middleware.js");
const app = express();

middleware(app);

app.use((req, res, next) => {
    res.header({
        "Content-Type": "application/json; charset=utf-8",
        "Encoding": "utf8"
    });
    next();
});

app.use("/", mainRoutes);
app.use("/user", userRoutes);

app.use((req, res) => {
    res.status(404).json({
        path: "/notfound",
        description: "page doesn't exist"
    });
});

app.use((err, req, res, next) => {
    if(process.env.NODE_ENV === "dev"){
        console.log(err);
        return res.status(500).json({
            message: "Something went wrong.",
            error: err.message,
            usermessage: (err.usermessage) ? err.usermessage : "You didn't write anything for yourself."
        });
    }
    
    res.status(500).json({
        message: "Something went wrong.",
        error: err.message        
    });
});


module.exports = app;