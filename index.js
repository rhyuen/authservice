const server = require("./server.js");
const PORT = process.env.PORT || 5789;
const mongoose = require("mongoose");
const config = require("./config.js");


process.on("unhandledRejection", err => {
    console.log("unhandledRejection", err.message);
    //send the err to the logger.
    process.exit(1);
});

mongoose.Promise = global.Promise;
mongoose.connection
    .openUri(config["dev"].db)    
    .once("open", () => {
        console.log("db conn attempt")
    }).on("error", e => {
        console.log(e);
    });
server.listen(PORT, (err) => {
    if(err){
        return console.log(err);
    }
    console.log("Auth Service| NODE_ENV: %s | PORT: %s", process.env.NODE_ENV, PORT);
});