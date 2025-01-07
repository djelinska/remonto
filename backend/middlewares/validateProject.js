const { Project } = require("../models/projectModel");

const validateProjectData = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const projectData = { ...req.body, userId };

    // Create a new instance of the model with the request body
    const project = new Project(projectData);

    // Validate the data using the schema
    await project.validate();

    next(); // Proceed to the next middleware/route handler if validation passes
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res
        .status(400)
        .json({ message: "Validation error", details: errors });
    }

    next(error); // Pass other errors to the global error handler
  }
};

module.exports = validateProjectData;
