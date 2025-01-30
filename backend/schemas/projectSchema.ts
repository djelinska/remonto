import mongoose, { Schema } from 'mongoose';

import { ProjectDto } from '../types/models/project.dto';

const projectSchema = new Schema<ProjectDto>({
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
		type: mongoose.Schema.Types.Number,
		default: 0.0,
		required: true,
		min: 0.0,
	},
	imageUrls: { type: [String], default: [] },
});

export default projectSchema;
