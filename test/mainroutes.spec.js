const chai = require("chai");
// const agent = require("superagent");

const mongoose = require("mongoose");
const chaiHttp = require("chai-http");
const chaiAsPromised = require("chai-as-promised");
const should = chai.should();
const config = require("../config.js");
const server = require("../server.js");

chai.use(chaiHttp);
chai.use(chaiAsPromised);

describe("Root Properties are all there.", () => {
    it("Root", async () => {      
      const res = await chai.request(server).get("/");      
      res.body.should.be.a("object");      
      res.body.should.have.property("description");
      res.body.path.should.equal("/");
      res.body.description.should.equal("root");        
    });
});

describe("Login Route", () => {
    before(() => {
        mongoose.Promise = global.Promise;
        mongoose.connection
            .openUri(config["dev"].db)    
            .once("open", () => {
                console.log("db conn attempt")
            }).on("error", e => {
                console.log(e);
            });
    });

    after(() => {
        mongoose.disconnect();
    });

    it("An existing user should be able to login.", async () => {
        const res = await chai.request(server)
            .post("/login")
            .send({
                username: "",
                password: ""
            });
            
        res.body.should.be.a("object");
        res.body.should.have.property("path");
        res.body.should.have.property("method");
        res.body.should.have.property("description");
    });
})

describe("Signup Route", () => {
    before(() => {
        mongoose.Promise = global.Promise;
        mongoose.connection
            .openUri(config["dev"].db)    
            .once("open", () => {
                console.log("db conn attempt")
            }).on("error", e => {
                console.log(e);
            });
    });

    after(() => {
        mongoose.disconnect();
    });

    it("A new user should be created.", async() => {
        const res = await chai.request(server)
            .post("/signup")
            .send({
                username: "",
                password: ""
            });
        
        res.body.should.be.a("object");
        res.body.should.have.property("path");
        res.body.should.have.property("method");
        res.body.should.have.property("action");
        res.body.should.have.property("result");
        res.body.should.have.property("details");
    });
});
