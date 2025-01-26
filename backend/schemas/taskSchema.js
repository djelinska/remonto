const mongoose = require('mongoose');
const { checkTaskStatus, checkTaskPriority, checkTaskCategory } = require('../utils/validation');

// Task Schema
const taskSchema = new mongoose.Schema({
	projectId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project',
		required: true,
	},
	name: { type: String, required: true, minLength: 3, maxLength: 50 },
	description: { type: String },
	category: {
		type: String,
		enum: ['DESIGN', 'PLANNING', 'EXECUTION', 'REVIEW'],
		default: 'PLANNING',
		validate: {
			validator: checkTaskCategory,
			message: (props) => `${props.value} is not a valid task category`,
		},
	},
	status: {
		type: String,
		enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
		default: 'NOT_STARTED',
		validate: {
			validator: checkTaskStatus,
			message: (props) => `${props.value} is not a valid task status`,
		},
	},
	startTime: { type: Date },
	endTime: { type: Date },
	priority: {
		type: String,
		enum: ['LOW', 'MEDIUM', 'HIGH'],
		default: 'MEDIUM',
		validate: {
			validator: checkTaskPriority,
			message: (props) => `${props.value} is not a valid task priority`,
		},
	},
	cost: { type: mongoose.Schema.Types.Decimal128, default: 0.0 },
	note: { type: String },
});

module.exports = { taskSchema };
