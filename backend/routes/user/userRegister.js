const express = require("express");
const { Users } = require("../../models/userModel.js");
const {
  checkPassword,
  checkEmail,
  encryptPassword,
} = require("../../utils/validation.js");

const router = express.Router();

// HTTP POST for registering users
router.post("/api/register", async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !checkEmail(email) ||
      !checkPassword(password)
    ) {
      return res.status(400).json({ message: "Bad request" });
    }

    const checkDuplicate = await Users.findOne({
      email: email,
    });

    if (checkDuplicate) {
      return res.status(409).json({ message: "User already exists" });
    }

    const encryptedPassword = await encryptPassword(password);
    const userData = {
      email: email,
      firstName: firstName,
      lastName: lastName,
      password: encryptedPassword,
    };
    const newUser = new Users(userData);
    const saveUser = await newUser.save();
    const user = await Users.findOne({ email: email });

    if (!saveUser || !user) {
      return res.status(400).json({ message: "Failed to register user" });
    }

    res.json({
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
