const { Users } = require("../../models/userModel.js");
const express = require("express");
const generateToken = require("../../utils/generateToken.js");
const { comparePassword } = require("../../utils/validation");

const router = express.Router();

// HTTP POST for logging in
router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Bad request" });
    }

    const foundUser = await Users.findOne({ email: email }, { password: 1 });

    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const comparedPasswords = await comparePassword(
      password,
      foundUser.password
    );

    if (!comparedPasswords) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const user = await Users.findOne({ email: email }, { password: 0 });
    const token = generateToken(user);

    // Adding token to cookie
    res.cookie("token", token, {
      httpOnly: true, // Prevents access via JavaScript
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });

    res.json({
      message: "User logged in successfully",
      user: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
