const server = require("./server.js");
const PORT = process.env.PORT || 5789;
const mongoose = require("mongoose");
const logger = require("./common/logger.js");
const config = require("./config.js");


process.on("uncaughtException", err => {
    logger.error(`Uncaught Exception: ${err}`);
    process.exit(1);
});

mongoose.Promise = global.Promise;
mongoose.connection
    .openUri(config.getSecrets().db, {
        useNewUrlParser: true
    })
    .once("open", () => {
        logger.info("DB conn attempt open.")
    }).on("error", e => {
        logger.error(`MONGODB ERROR: ${e}`);
    });
server.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Auth Service| NODE_ENV: %s | PORT: %s", process.env.NODE_ENV, PORT);
});