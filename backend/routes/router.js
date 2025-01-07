const express = require("express");
const userLogin = require("./user/userLogin.js");
const userRegister = require("./user/userRegister.js");
const projects = require("./project/projectRoutes.js");
const tokenDecode = require("./token/tokenDecode.js");
const router = express.Router();

router.use(userLogin);
router.use(userRegister);
router.use(tokenDecode);
router.use(projects);

module.exports = router;
