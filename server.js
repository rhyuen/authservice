const express = require("express");
const mainRoutes = require("./routes/mainroutes.js");
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

app.use((req, res) => {
    res.status(404).json({
        path: "/notfound",
        description: "page doesn't exist"
    });
});

app.use((err, req, res, next) => {
    console.log(err);
});


module.exports = app;