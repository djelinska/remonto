import { NextFunction, Response } from "express";
import ProjectModel from "../models/projectModel";
import { PostProjectRequest } from "../types/models/projectRequest.dto";

const validateProjectData = async (req: PostProjectRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const projectData = { ...req.body, userId };

    // Create a new instance of the model with the request body
    const project = new ProjectModel(projectData);

    // Validate the data using the schema
    await project.validate();

    next(); // Proceed to the next middleware/route handler if validation passes
  } catch (error: any) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return res
        .status(400)
        .json({ message: "Validation error", details: errors });
    }

    next(error); // Pass other errors to the global error handler
  }
};

export default validateProjectData
