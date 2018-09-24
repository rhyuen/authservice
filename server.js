const express = require("express");
const logger = require("./common/logger.js");
const middleware = require("./middleware.js");
const auth = require("./auth.js");
const mainRoutes = require("./routes/mainroutes.js");
const userRoutes = require("./routes/userroutes.js");

const app = express();

middleware(app);

// app.use((req, res, next) => {
//     res.header({
//         "Content-Type": "application/json; charset=utf-8",
//         "Encoding": "utf8"
//     });
//     next();
// });

app.use('*', function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Accept, Origin, Content-Type, access_token');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.get("/auth", auth.validateIdentity);

app.use("/", mainRoutes);
app.use("/user", userRoutes);

app.use((req, res) => {
    res.status(404).json({
        date: new Date().toLocaleString(),
        path: `${req.originalUrl}`,
        description: "The page you're look for doesn't exist."
    });
});

app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === "dev") {
        console.log(err);

        logger.error("No match handler: ${err}")
        return res.status(500).json({
            date: new Date().toLocaleString(),
            message: "Something went wrong.",
            error: err.message,
            usermessage: (err.usermessage) ? err.usermessage : "You didn't write an error message for yourself."
        });
    }


    //TODO: Log to a file somewhere and give the user a vague message.
    logger.error("No match handler: ${err}");
    res.status(500).json({
        date: new Date().toLocaleString(),
        message: "Something went wrong.",
        error: err.message
    });
});


module.exports = app;