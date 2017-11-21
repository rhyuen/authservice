const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const userSchema =  mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}, {
    timeStamps: {
        createdAt: "created_at"
    }
});

userSchema.methods.generateHash = (pw) => {
    return bcrypt.hashSync(pw, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(pw){
    return bcrypt.compareSync(pw, this.password);
};


module.exports = mongoose.model("User", userSchema);