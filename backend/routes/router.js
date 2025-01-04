const express = require("express");
const userLogin = require("./user/userLogin.js");
const userRegister = require("./user/userRegister.js");
const router = express.Router();

router.use(userLogin);
router.use(userRegister);
module.exports = router;
