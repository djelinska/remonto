const schemas = require("../../models/schemas.js")
const express = require("express")
const generateToken = require("../../utils/generateToken.js");
const { comparePassword } = require("../../utils/validation");

const router = express.Router();
// HTTP POST for logging in
router.post(
    "/api/login",
    async (
        req,
        res
    ) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: "Bad request" });
            }

            const foundUser =
                await schemas.Users.findOne({ email: email }, { password: 1 });

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

            const user =
                await schemas.Users.findOne({ email: email }, { password: 0 });
            const token = generateToken(user);

            res.json({
                message: "User logged in successfully",
                user: user,
                token: token,
            });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Server error" });
        }
    }
);

module.exports = router
