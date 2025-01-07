const { Project } = require("../models/projectModel");

const fetchUserProjects = async (userId) => {
  try {
    const projects = await Project.find({ userId: userId });

    return projects.map((project) => ({
      id: project._id,
      name: project.name,
    }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Error fetching projects");
  }
};

const fetchUserProjectById = async (userId, projectId) => {
  try {
    const project = await Project.findOne({ userId: userId, _id: projectId });

    return {
      id: project._id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: parseFloat(project.budget.toString()),
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw new Error("Error fetching projects");
  }
};

const createUserProject = async (userId, newProject) => {
  try {
    const project = new Project({
      userId: userId,
      name: newProject.name,
      description: newProject.description,
      startDate: newProject.startDate,
      endDate: newProject.endDate,
      budget: parseFloat(newProject.budget.toString()),
    });

    await project.save();

    return {
      id: project._id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: parseFloat(project.budget.toString()),
    };
  } catch (error) {
    console.error("Error creating project:", error);
    throw new Error("Error creating project");
  }
};

const updateUserProject = async (userId, projectId, updatedProject) => {
  try {
    const project = await Project.findOneAndUpdate(
      { userId: userId, _id: projectId },
      { $set: updatedProject },
      { new: true, runValidators: true }
    );

    if (!project) {
      throw new Error(
        "Project not found or user not authorized to update the project."
      );
    }

    return {
      id: project._id,
      name: project.name,
      description: project.description,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: parseFloat(project.budget.toString()),
    };
  } catch (error) {
    console.error("Error updating project:", error);
    throw new Error("Failed to update project");
  }
};

const deleteUserProject = async (userId, projectId) => {
  try {
    const project = await Project.deleteOne({ userId: userId, _id: projectId });

    return {
      message: "Project deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Error deleting project");
  }
};

module.exports = {
  fetchUserProjects,
  fetchUserProjectById,
  createUserProject,
  updateUserProject,
  deleteUserProject,
};
