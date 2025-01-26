const { Task } = require("../models/taskModel");
const { checkStartAndEndDate } = require("../utils/validation");
const AppError = require('../utils/AppError');

const validateTaskData = async (req, res, next) => {
    try {
        const projectId = req.params.projectId
        const taskData = { ...req.body, projectId };

        if (taskData.startDate && taskData.endDate) {
            if (!checkStartAndEndDate(taskData.startDate)) {
                throw new AppError("DateValidationError", 400)
            }
        }

        const task = new Task(taskData);

        await task.validate();

        next();
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res
                .status(400)
                .json({ message: "Validation error", details: errors });
        }
        if (error.message === "DateValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res
                .status(400)
                .json({ message: "Date validation error (start date cannot be after end date)", details: errors });
        }

        next(error);
    }
};

module.exports = validateTaskData;
