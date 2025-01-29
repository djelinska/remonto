import mongoose, { Schema } from "mongoose";
import { TaskDto } from "../types/models/task.dto";
import { TaskCategory } from "../types/enums/task-category";
import { TaskStatus } from "../types/enums/task-status";
import { TaskPriority } from "../types/enums/task-priority";
import { checkTaskCategory, checkTaskPriority, checkTaskStatus } from "../utils/validation";


// Task Schema
const taskSchema = new Schema<TaskDto>({
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
        default: TaskCategory.PLANNING,
        validate: {
            validator: checkTaskCategory,
            message: (props: any) => `${props.value} is not a valid task category`,
        },
    },
    status: {
        type: String,
        enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'],
        default: TaskStatus.NOT_STARTED,
        validate: {
            validator: checkTaskStatus,
            message: (props: any) => `${props.value} is not a valid task status`,
        },
    },
    startDate: { type: Date },
    endDate: { type: Date },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: TaskPriority.MEDIUM,
        validate: {
            validator: checkTaskPriority,
            message: (props: any) => `${props.value} is not a valid task priority`,
        },
    },
    cost: { type: mongoose.Schema.Types.Number, default: 0.0 },
    note: { type: String },
});
export default taskSchema

