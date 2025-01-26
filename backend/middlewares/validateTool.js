const { Tool } = require("../models/toolModel");

const validateToolData = async (req, res, next) => {
    try {
        const projectId = req.params.projectId
        const toolData = { ...req.body, projectId };

        const tool = new Tool(toolData);

        await tool.validate();

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

module.exports = validateToolData;
