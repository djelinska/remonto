const { Task } = require("../models/taskModel");
const { checkStartAndEndDate } = require("../utils/validation");

const validateTaskData = async (req, res, next) => {
    try {
        const projectId = req.params.projectId
        const taskData = { ...req.body, projectId };

        if (taskData.startDate && taskData.endDate) {
            if (!checkStartAndEndDate(taskData.startDate)) {
                throw new Error("ValidationError")
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

        next(error);
    }
};

module.exports = validateTaskData;
