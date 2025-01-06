const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "user",
    },
});

const Users = mongoose.model(
    "Users",
    userSchema,
    "users"
);

const mySchemas = {
    Users: Users,
};
module.exports = mySchemas;
