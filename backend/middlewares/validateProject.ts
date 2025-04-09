import { NextFunction, Response } from "express";
import ProjectModel from "../models/projectModel";
import { PostProjectRequest } from "../types/models/projectRequest.dto";

const validateProjectData = async (req: PostProjectRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      return res.status(400).json({
        message: "Validation error",
        details: ["User ID is required"],
      });
    }

    const projectData = { ...req.body, userId: req.user.id };

    const project = new ProjectModel(projectData);

    await project.validate();

    next(); 
  } catch (error: any) {
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res
        .status(400)
        .json({ message: "Validation error", details: errors });
    }

    next(error); 
  }
};

export default validateProjectData;