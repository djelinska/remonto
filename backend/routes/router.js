const express = require('express');
const projects = require('./project/projectRoutes.js');
const authRoutes = require('./auth/authRoutes.js');
const userRoutes = require('./user/userRoutes.js');
const tokenDecode = require('./token/tokenDecode.js');
const router = express.Router();

router.use(tokenDecode);
router.use(projects);
router.use(authRoutes);
router.use(userRoutes);

module.exports = router;
