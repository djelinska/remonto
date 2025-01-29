import { NextFunction, Response} from "express";
import { RegisterRequest } from "../types/models/authRequest.dto";
import { checkPassword } from "../utils/validation";
import AppError from "../utils/AppError";
import UserModel from "../models/userModel";

const validateUserData = async (req: RegisterRequest, res: Response, next: NextFunction) => {
    try {
        const userData = { ...req.body };
        if (!checkPassword(userData.password)) {
            throw new AppError("PasswordValidationError", 400)
        }

        const user = new UserModel(userData);

        await user.validate();

        next();
    } catch (error: any) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return res
                .status(400)
                .json({ message: "Validation error", details: errors });
        }
        if (error.message === "PasswordValidationError") {
            const errors = Object.values(error.errors).map((err: any) => err.message);
            return res
                .status(400)
                .json({
                    message: "Password validation error (password not strong enough)",
                    details: errors
                });
        }

        next(error);
    }
};

export default validateUserData
