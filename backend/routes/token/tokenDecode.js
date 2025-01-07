const express = require("express");
const { checkTokenValidity } = require("../../utils/validation");
const jwt = require("jsonwebtoken");

const router = express.Router();
router.post("/api/token/decode", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Token not provided in request body" });
    }
    if (!checkTokenValidity(token)) {
      return res.status(400).json({ message: "Token is invalid" });
    }

    const data = jwt.decode(token);
    res.json({
      message: "Token decoded success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
