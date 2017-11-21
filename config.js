const nconf = require("nconf");

nconf.file("./keys.json");

module.exports = {
    "dev": {
        "db": process.env.db || nconf.get("dev:db"),
        "jwtSecret": "",
        "cookieSecret": ""
    },
    "prod": {
        "db": "",
        "jwtSecret": "",
        "cookieSecret": ""
    },
    "test": {
        "db": "",
        "jwtSecret": "",
        "cookieSecret": ""
    }
};

