const router = require("express").Router();
const auth = require("../auth.js");
const wrapAsync = require("../common/wrapasync");
const User = require("../models/user.js");

router.use(auth.validateIdentity);

router.get("/", wrapAsync(async(req, res) => {
    const users = await User.find({});
    res.status(200).json({
        path: "/users",
        users
    });
}));

router.get("/:username", wrapAsync(async(req, res) => {

    const namedTarget = req.params.username;
    const foundTarget = await User.findOne({username: namedTarget});
    res.status(200).json({
        path: `/users/${namedTarget}`,
        details: foundTarget ? foundTarget : `${namedTarget} doesn't exist.`
    });
}));

//TODO: Add user details fields
//TODO: Add user details modify route.


router.get("/logout", wrapAsync(async(req, res) => {
    res.status(200).json({
        path: "logout route"
    });
}));


module.exports = router;
