const express = require("express");
const authenticateUser = require("../../middlewares/authenticateUser");
const { 
  fetchProjectTools, 
  fetchToolById, 
  createTool, 
  updateTool, 
  deleteTool 
} = require("../../services/toolService");
const { checkIfCorrectId } = require("../../utils/validation");

const router = express.Router({ mergeParams: true }); 

router.get("/:toolId", authenticateUser, async (req, res) => {
  try {
    const { projectId, toolId } = req.params;
    const userId = req.user.id;

    if (!checkIfCorrectId(toolId) || !checkIfCorrectId(projectId)) {
      throw new Error("Invalid IDs");
    }

    const tool = await fetchToolById(userId, projectId, toolId);

    res.status(200).json(tool);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/", authenticateUser, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    if (!checkIfCorrectId(projectId)) throw new Error("Invalid Project ID");

    const tools = await fetchProjectTools(userId, projectId);

    res.status(200).json(tools);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.post("/", authenticateUser, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    if (!checkIfCorrectId(projectId)) throw new Error("Invalid Project ID");

    const tool = await createTool(userId, projectId, req.body);

    res.status(201).json(tool);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.put("/:toolId", authenticateUser, async (req, res) => {
  try {
    const { projectId, toolId } = req.params;
    const userId = req.user.id;

    if (!checkIfCorrectId(toolId) || !checkIfCorrectId(projectId)) {
      throw new Error("Invalid IDs");
    }

    const updatedTool = await updateTool(userId, projectId, toolId, req.body);

    res.status(200).json(updatedTool);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:toolId", authenticateUser, async (req, res) => {
  try {
    const { projectId, toolId } = req.params;
    const userId = req.user.id;

    if (!checkIfCorrectId(toolId) || !checkIfCorrectId(projectId)) {
      throw new Error("Invalid IDs");
    }

    const result = await deleteTool(userId, projectId, toolId);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
