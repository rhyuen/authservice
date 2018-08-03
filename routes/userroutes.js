const router = require("express").Router();
const auth = require("../auth.js");
const User = require("../controllers/userController.js");

router.use(auth.validateIdentity);
router.get("/", User.getLoggedIn);
router.get("/admin", User.getAdmin);
router.get("/logout", User.handleLogout);
router.get("/:username", User.getNamedUser);

module.exports = router;
