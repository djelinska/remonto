const mongoose = require("mongoose");
const { checkToolsMaterialsStatus } = require("../utils/validation");

// Material Schema
const materialSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true,
    },
    name: { type: String, required: true },
    imageUrl: { type: String },
    status: {
        type: String,
        enum: ["ORDERED", "NOT_ORDERED", "RECEIVED"],
        validate: {
            validator: checkToolsMaterialsStatus,
            message: props => `${props.value} is not a valid material status`
        }
    },
    cost: { type: mongoose.Schema.Types.Decimal128, default: 0.0, min: 0.0 },
    quantity: { type: Number, default: 0, min: 0 },
    location: { type: String },
    link: { type: String },
    note: { type: String },
    type: { type: String },
});

module.exports = { materialSchema };
