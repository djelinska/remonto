const mongoose = require("mongoose");

// Tool Schema
const toolSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  name: { type: String, required: true },
  imageUrl: { type: String },
  status: { type: String },
  cost: { type: mongoose.Schema.Types.Decimal128, default: 0.0 },
  quantity: { type: Number, default: 0 },
  location: { type: String },
  link: { type: String },
  note: { type: String },
});

module.exports = { toolSchema };
