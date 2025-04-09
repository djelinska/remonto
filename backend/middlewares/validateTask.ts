import TaskModel from "../models/taskModel";
import { checkStartAndEndDate } from "../utils/validation";
import AppError from "../utils/AppError";
import { PostTaskRequest } from "../types/models/taskRequest.dto";
import { NextFunction, Response } from "express";

const validateTaskData = async (req: PostTaskRequest, res: Response, next: NextFunction) => {
    try {
        const projectId = req.params.projectId;
        if (!projectId) {
            return res.status(400).json({ 
                message: "Validation error",
                details: ["Project ID is required"]
            });
        }

        const taskData = { ...req.body, projectId };

        if (taskData.startDate && taskData.endDate) {
            if (!checkStartAndEndDate(taskData.startDate, taskData.endDate)) {
                return res.status(400).json({
                    message: "Date validation error",
                    details: ["Start date cannot be after end date"]
                });
            }
        }

        const task = new TaskModel(taskData);
        await task.validate();
        next();
    } catch (error: any) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return res.status(400).json({ 
                message: "Validation error", 
                details: errors 
            });
        }
        next(error);
    }
};

export default validateTaskData;