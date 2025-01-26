const { User } = require("../models/userModel");
const { checkPassword } = require("../utils/validation");
const AppError = require('../utils/AppError');

const validateUserData = async (req, res, next) => {
    try {
        const userData = { ...req.body };
        if (!checkPassword(userData.password)) {
            throw new AppError("PasswordValidationError")
        }

        const user = new User(userData);

        await user.validate();

        next();
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res
                .status(400)
                .json({ message: "Validation error", details: errors });
        }
        if (error.message === "PasswordValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res
                .status(400)
                .json({
                    message: "Password validation error (password not strong enough)",
                    details: errors
                });
        }

        next(error);
    }
};

module.exports = validateUserData;
