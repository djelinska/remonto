import mongoose, { Schema } from 'mongoose';

import { TemplateFormDto } from '../types/models/template.dto';
import { checkTaskCategory, checkTaskPriority, checkTaskStatus, checkToolsMaterialsStatus } from '../utils/validation';

const templateSchema = new Schema<TemplateFormDto>({
	project: {
		name: { type: String, required: true, minLength: 3, maxLength: 50 },
		description: { type: String },
		budget: { type: mongoose.Schema.Types.Number, required: true, min: 0.0 },
	},
	tasks: [
		{
			name: { type: String, required: true, minLength: 3, maxLength: 50 },
			category: {
				type: String,
				enum: ['DESIGN', 'CONSTRUCTION', 'INSTALLATIONS', 'FINISHING', 'CARPENTRY', 'SMART_HOME', 'LOGISTICS', 'CLEANUP'],
				required: true,
				validate: {
					validator: checkTaskCategory,
					message: (props: any) => `${props.value} is not a valid task category`,
				},
			},
			status: {
				type: String,
				enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
				validate: {
					validator: checkTaskStatus,
					message: (props: any) => `${props.value} is not a valid task status`,
				},
			},
			priority: {
				type: String,
				enum: ['LOW', 'MEDIUM', 'HIGH'],
				required: true,
				validate: {
					validator: checkTaskPriority,
					message: (props: any) => `${props.value} is not a valid task priority`,
				},
			},
			note: { type: String },
		},
	],
	materials: [
		{
			name: { type: String, required: true, minLength: 3, maxLength: 50 },
			status: {
				type: String,
				enum: ['NOT_ORDERED', 'ORDERED', 'IN_DELIVERY', 'READY_FOR_PICKUP', 'RECEIVED', 'AVAILABLE', 'REQUIRED'],
				validate: {
					validator: checkToolsMaterialsStatus,
					message: (props: any) => `${props.value} is not a valid material status`,
				},
			},
			quantity: { type: Number, required: true, min: 0 },
			unit: {
				type: String,
				enum: [
					'KILOGRAM', 'GRAM', 'TON', 'LITER', 'MILLILITER', 'CUBIC_METER',
					'METER', 'CENTIMETER', 'SQUARE_METER', 'PIECE', 'PACKAGE', 'ROLL', 'LINEAR_METER'
				],
			},
			type: { type: String },
			note: { type: String },
		},
	],
	tools: [
		{
			name: { type: String, required: true, minLength: 3, maxLength: 50 },
			status: {
				type: String,
				enum: ['NOT_ORDERED', 'ORDERED', 'IN_DELIVERY', 'READY_FOR_PICKUP', 'RECEIVED', 'AVAILABLE', 'REQUIRED'],
				validate: {
					validator: checkToolsMaterialsStatus,
					message: (props: any) => `${props.value} is not a valid tool status`,
				},
			},
			quantity: { type: Number, required: true, min: 1 },
			note: { type: String },
		},
	],
});

export default templateSchema;

