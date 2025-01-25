const mongoose = require("mongoose");
const { checkToolsMaterialsStatus } = require("../utils/validation");

// Tool Schema
const toolSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    name: { type: String, required: true, minLength: 3, maxLength: 50 },
    imageUrl: { type: String },
    status: {
        type: String,
        enum: ["ORDERED", "NOT_ORDERED", "RECEIVED"],
        validate: {
            validator: checkToolsMaterialsStatus,
            message: props => `${props.value} is not a valid tool status`
        }
    },
    cost: { type: mongoose.Schema.Types.Decimal128, default: 0.0, min: 0.0 },
    quantity: { type: Number, default: 0, min: 0 },
    location: { type: String },
    link: { type: String },
    note: { type: String },
});

module.exports = { toolSchema };
