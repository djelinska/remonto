const mongoose = require("mongoose");
const { checkPassword, checkEmail, checkUserType } = require("../utils/validation");

// User schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    lastName: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 20
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: checkEmail,
            message: props => `${props.value} is not a valid email`
        }
    },
    type: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
        validate: {
            validator: checkUserType,
            message: props => `${props.value} is not a valid user type`
        }
    },
});

module.exports = { userSchema };
