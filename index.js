const server = require("./server.js");
const PORT = process.env.PORT || 5789;

server.listen(PORT, (err) => {
    if(err){
        return console.log(err);
    }
    console.log("Auth Service| NODE_ENV: %s | PORT: %s", process.env.NODE_ENV, PORT);
});