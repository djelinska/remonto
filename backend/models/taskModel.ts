import { InferSchemaType, Model } from "mongoose";
import { TaskDto } from "../types/models/task.dto";
import taskSchema from "../schemas/taskSchema";
import mongoose from 'mongoose'


const TaskModel: Model<TaskDto> = mongoose.model("Task", taskSchema, "tasks");
export default TaskModel
