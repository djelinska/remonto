import TaskModel from "../models/taskModel";
import { checkStartAndEndDate } from "../utils/validation";
import AppError from "../utils/AppError";
import { PostTaskRequest } from "../types/models/taskRequest.dto";
import { NextFunction, Response } from "express";

const validateTaskData = async (req: PostTaskRequest, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.projectId
        if (!projectId) {
            throw new AppError("ProjectIdUndefinedError", 400)
        }
        const taskData = { ...req.body, projectId };

        if (taskData.startDate && taskData.endDate) {
            if (!checkStartAndEndDate(taskData.startDate, taskData.endDate)) {
                throw new AppError("DateValidationError", 400)
            }
        }

        const task = new TaskModel(taskData);

        await task.validate();

        next();
    } catch (error: any) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return res
                .status(400)
                .json({ message: "Validation error", details: errors });
        }
        if (error.message === "DateValidationError") {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return res
                .status(400)
                .json({ message: "Date validation error (start date cannot be after end date)", details: errors });
        }

        next(error);
    }
};

export default validateTaskData
