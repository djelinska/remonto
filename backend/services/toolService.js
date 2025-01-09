const { Tool } = require("../models/toolModel");

const fetchProjectTools = async (userId, projectId) => {
  try {
    const tools = await Tool.find({ projectId });

    return tools.map((tool) => ({
      id: tool._id,
      name: tool.name,
      imageUrl: tool.imageUrl,
      status: tool.status,
      cost: parseFloat(tool.cost.toString()),
      quantity: tool.quantity,
      location: tool.location,
      link: tool.link,
      note: tool.note,
    }));
  } catch (error) {
    console.error("Error fetching project tools:", error);
    throw new Error("Error fetching project tools");
  }
};

const fetchToolById = async (userId, projectId, toolId) => {
  try {
    const tool = await Tool.findOne({ projectId, _id: toolId });

    if (!tool) {
      throw new Error("Tool not found");
    }

    return {
      id: tool._id,
      name: tool.name,
      imageUrl: tool.imageUrl,
      status: tool.status,
      cost: parseFloat(tool.cost.toString()),
      quantity: tool.quantity,
      location: tool.location,
      link: tool.link,
      note: tool.note,
    };
  } catch (error) {
    console.error("Error fetching tool by ID:", error);
    throw new Error("Error fetching tool by ID");
  }
};

const createTool = async (userId, projectId, toolData) => {
  try {
    const tool = new Tool({
      projectId,
      name: toolData.name,
      imageUrl: toolData.imageUrl,
      status: toolData.status,
      cost: toolData.cost,
      quantity: toolData.quantity,
      location: toolData.location,
      link: toolData.link,
      note: toolData.note,
    });

    await tool.save();

    return {
      id: tool._id,
      name: tool.name,
      imageUrl: tool.imageUrl,
      status: tool.status,
      cost: parseFloat(tool.cost.toString()),
      quantity: tool.quantity,
      location: tool.location,
      link: tool.link,
      note: tool.note,
    };
  } catch (error) {
    console.error("Error creating tool:", error);
    throw new Error("Error creating tool");
  }
};

const updateTool = async (userId, projectId, toolId, toolData) => {
  try {
    const tool = await Tool.findOneAndUpdate(
      { projectId, _id: toolId },
      { $set: toolData },
      { new: true, runValidators: true }
    );

    if (!tool) {
      throw new Error("Tool not found or user not authorized");
    }

    return {
      id: tool._id,
      name: tool.name,
      imageUrl: tool.imageUrl,
      status: tool.status,
      cost: parseFloat(tool.cost.toString()),
      quantity: tool.quantity,
      location: tool.location,
      link: tool.link,
      note: tool.note,
    };
  } catch (error) {
    console.error("Error updating tool:", error);
    throw new Error("Error updating tool");
  }
};

const deleteTool = async (userId, projectId, toolId) => {
  try {
    const tool = await Tool.findOneAndDelete({ projectId, _id: toolId });

    if (!tool) {
      throw new Error("Tool not found or user not authorized");
    }

    return { message: "Tool deleted successfully" };
  } catch (error) {
    console.error("Error deleting tool:", error);
    throw new Error("Error deleting tool");
  }
};

module.exports = {
  fetchProjectTools,
  fetchToolById,
  createTool,
  updateTool,
  deleteTool,
};
