const mongoose = require("mongoose");

// Task Schema
const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  name: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    enum: ["DESIGN", "PLANNING", "EXECUTION", "REVIEW"],
    default: "PLANNING",
  },
  status: {
    type: String,
    enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
    default: "NOT_STARTED",
  },
  startTime: { type: Date },
  endTime: { type: Date },
  priority: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "MEDIUM",
  },
  cost: { type: mongoose.Schema.Types.Decimal128, default: 0.0 },
  note: { type: String },
});

module.exports = { taskSchema };
