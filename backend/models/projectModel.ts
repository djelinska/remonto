import { InferSchemaType, Model } from "mongoose";
import { ProjectDto } from "../types/models/project.dto";
import mongoose from 'mongoose'
import projectSchema from "../schemas/projectSchema";

const ProjectModel: Model<ProjectDto> = mongoose.model("Projects", projectSchema, "projects");
export default ProjectModel
