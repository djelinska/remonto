import { InferSchemaType, Model } from "mongoose";
import { TaskDto } from "../types/models/task.dto";

const mongoose = require("mongoose");
const { taskSchema } = require("../schemas/taskSchema");

const TaskModel: Model<TaskDto> = mongoose.model("Task", taskSchema, "tasks");
export default TaskModel
