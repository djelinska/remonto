const mongoose = require('mongoose');

// Project Schema
const projectSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: { type: String, required: true },
	description: { type: String },
	startDate: { type: Date, required: true },
	endDate: { type: Date },
	budget: {
		type: mongoose.Schema.Types.Decimal128,
		default: 0.0,
		required: true,
	},
});

module.exports = { projectSchema };
