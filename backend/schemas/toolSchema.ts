import mongoose, {Schema} from 'mongoose';

import {ToolDto} from '../types/models/tool.dto';
import {checkToolsMaterialsStatus} from '../utils/validation';

const toolSchema = new Schema<ToolDto>({
	projectId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Project',
		required: true,
	},
	name: {type: String, required: true, minLength: 3, maxLength: 50},
	imageUrl: {type: String},
	status: {
		type: String,
		enum: ['NOT_ORDERED', 'ORDERED', 'IN_DELIVERY', 'READY_FOR_PICKUP', 'RECEIVED', 'AVAILABLE', 'REQUIRED'],
		validate: {
			validator: checkToolsMaterialsStatus,
			message: (props: any) => `${props.value} is not a valid tool status`,
		},
	},
	deliveryDate: {type: Date},
	allDay: {type: Boolean, default: false},
	cost: {type: mongoose.Schema.Types.Number, default: 0.0, min: 0.0},
	quantity: {type: Number, default: 1, min: 1},
	location: {type: String},
	link: {type: String},
	note: {type: String},
});
export default toolSchema;
