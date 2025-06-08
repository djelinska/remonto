import { NextFunction, Response } from "express";
import mongoose from "mongoose";
import MaterialModel from "../models/materialModel";
import { PostMaterialRequest } from "../types/models/materialRequest.dto";

const validateMaterialData = async (req: PostMaterialRequest, res: Response, next: NextFunction) => {
    try {
        if (!req.params.projectId) {
            return res.status(400).json({
                message: "Validation error",
                details: ["Project ID is required"],
            });
        }

        if (!mongoose.Types.ObjectId.isValid(req.params.projectId)) {
            return res.status(400).json({
                message: "Validation error",
                details: ["Invalid project ID"],
            });
        }

        const materialData = { ...req.body, projectId: req.params.projectId };
        const material = new MaterialModel(materialData);
        await material.validate();

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

export default validateMaterialData;