const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const config = require("./config.js");

module.exports = (app) => {    
    app.use(morgan("dev"));
    app.use(helmet());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    mongoose.connection.openUri(config["dev"].db)
    // .then(data => console.log(data))
    // .catch(err => console.log(err));
    .once("open", () => {
        console.log("db conn attempt")
    })
    .on("error", e => {
        console.log(e);
    });
};