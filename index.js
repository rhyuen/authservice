const server = require("./server.js");
const PORT = process.env.PORT || 5789;
const mongoose = require("mongoose");
const config = require("./config.js");


process.on("unhandledRejection", err => {
    console.log("unhandledRejection", err.message);
    //send the err to the logger.
    process.exit(1);
});

process.on("uncaughtException", err => {
    console.log("Uncaught Exception %s", err);
    process.exit(1);
});

mongoose.Promise = global.Promise;
mongoose.connection
    .openUri(config["dev"].db)    
    .once("open", () => {
        console.log("DB conn attempt open.")
    }).on("error", e => {
        console.log("DB conn ERROR.")
        console.log(e);
    });
server.listen(PORT, (err) => {
    if(err){
        return console.log(err);
    }    
    console.log("Auth Service| NODE_ENV: %s | PORT: %s", process.env.NODE_ENV, PORT);
});