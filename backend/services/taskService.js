const { Project } = require("../models/projectModel");
const { Task } = require("../models/taskModel");

const fetchProjectTasks = async (userId, projectId) => {
  try {
    const project = await Project.findOne({ userId, _id: projectId });

    if (!project) {
      throw new Error(
        "Project not found or you don't have permission to view it."
      );
    }

    const tasks = await Task.find({ projectId });
    return tasks.map((task) => ({
      id: task._id,
      projectId: task.projectId,
      name: task.name,
      description: task.description,
      category: task.category,
      status: task.status,
      priority: task.priority,
      startTime: task.startTime,
      endTime: task.endTime,
      cost: parseFloat(task.cost.toString()),
    }));
  } catch (error) {
    throw new Error(error.message);
  }
};

const fetchProjectTaskById = async (userId, projectId, taskId) => {
  try {
    const project = await Project.findOne({ userId, _id: projectId });

    if (!project) {
      throw new Error(
        "Project not found or you don't have permission to view it."
      );
    }

    const task = await Task.findOne({ _id: taskId, projectId });

    if (!task) {
      throw new Error("Task not found.");
    }

    return {
      id: task._id,
      projectId: task.projectId,
      name: task.name,
      description: task.description,
      category: task.category,
      status: task.status,
      priority: task.priority,
      startTime: task.startTime,
      endTime: task.endTime,
      cost: parseFloat(task.cost.toString()),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const createProjectTask = async (userId, projectId, newTask) => {
  try {
    const project = await Project.findOne({ userId, _id: projectId });

    if (!project) {
      throw new Error(
        "Project not found or you don't have permission to add tasks."
      );
    }

    const task = new Task({
      ...newTask,
      projectId,
    });

    await task.save();
    return {
      id: task._id,
      projectId: task.projectId,
      name: task.name,
      description: task.description,
      category: task.category,
      status: task.status,
      priority: task.priority,
      startTime: task.startTime,
      endTime: task.endTime,
      cost: parseFloat(task.cost.toString()),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProjectTask = async (userId, projectId, taskId, updatedTask) => {
  try {
    const project = await Project.findOne({ userId, _id: projectId });

    if (!project) {
      throw new Error(
        "Project not found or you don't have permission to update tasks."
      );
    }

    const task = await Task.findOneAndUpdate(
      { _id: taskId, projectId },
      updatedTask,
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new Error(
        "Task not found or you don't have permission to update it."
      );
    }

    return {
      id: task._id,
      projectId: task.projectId,
      name: task.name,
      description: task.description,
      category: task.category,
      status: task.status,
      priority: task.priority,
      startTime: task.startTime,
      endTime: task.endTime,
      cost: parseFloat(task.cost.toString()),
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteProjectTask = async (userId, projectId, taskId) => {
  try {
    const project = await Project.findOne({ userId, _id: projectId });

    if (!project) {
      throw new Error(
        "Project not found or you don't have permission to delete tasks."
      );
    }

    const result = await Task.deleteOne({ _id: taskId, projectId });

    if (result.deletedCount === 0) {
      throw new Error(
        "Task not found or you don't have permission to delete it."
      );
    }

    return { message: "Task deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  fetchProjectTasks,
  fetchProjectTaskById,
  createProjectTask,
  updateProjectTask,
  deleteProjectTask,
};
