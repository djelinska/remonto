import { NextFunction, Request, Response} from "express";
import ToolModel from "../models/toolModel";
import { ToolData } from "../types/models/tool.dto";
import {  Types } from "mongoose";
interface ToolRequest extends Request {
    params: {
        projectId: string;
    }
    body: ToolData
}

const validateToolData = async (req: ToolRequest, res: Response, next: NextFunction) => {
    try {
        const { projectId } = req.params;

        // Attempt to cast projectId to ObjectId
        if (!Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({ message: "Invalid projectId format" });
        }

        // Cast projectId to ObjectId
        const projectIdObjectId = new Types.ObjectId(projectId);

        const toolData: ToolData = { ...req.body, projectId: projectIdObjectId };

        const tool = new ToolModel(toolData);

        await tool.validate();

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

export default validateToolData
