import { InferSchemaType, Model } from "mongoose";
import { MaterialDto } from "../types/models/material.dto";
import mongoose from 'mongoose'
import materialSchema from "../schemas/materialSchema";

const MaterialModel: Model<MaterialDto> = mongoose.model("Material", materialSchema, "materials");
export default MaterialModel
