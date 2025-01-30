import { InferSchemaType, Model } from "mongoose";
import toolSchema from "../schemas/toolSchema";
import { ToolDto } from "../types/models/tool.dto";
import mongoose from 'mongoose'

const ToolModel: Model<ToolDto> = mongoose.model("Tool", toolSchema, "tools");
export default ToolModel
