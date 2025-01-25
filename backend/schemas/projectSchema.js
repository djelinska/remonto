const mongoose = require('mongoose');

// Project Schema
const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { type: String, required: true, minLength: 3, maxLength: 50 },
    description: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    budget: {
        type: mongoose.Schema.Types.Decimal128,
        default: 0.0,
        required: true,
        min: 0.0,
    },
});

module.exports = { projectSchema };
