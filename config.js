const nconf = require("nconf");

nconf.file("./keys.json");

module.exports = {
    "dev": {
        "db": process.env.db || nconf.get("dev:db"),
        "jwtSecret": process.env.jwtSecret || nconf.get("dev:jwtSecret"),
        "cookieSecret": process.env.cookieSecret || nconf.get("dev:cookieSecret")
    },
    "prod": {
        "db": process.env.db || nconf.get("prod:db"),
        "jwtSecret": process.env.jwtSecret || nconf.get("prod:jwtSecret"),
        "cookieSecret": process.env.cookieSecret || nconf.get("prod:jwtSecret")
    },
    "test": {
        "db": "",
        "jwtSecret": "",
        "cookieSecret": ""
    }
};

