const express = require("express");
const authenticateUser = require("../../middlewares/authenticateUser");
const validateProjectData = require("../../middlewares/validateProject");
const {
  fetchUserProjects,
  fetchUserProjectById,
  createUserProject,
  updateUserProject,
  deleteUserProject,
} = require("../../services/projectService");
const taskRoutes = require("./taskRoutes");
const materialRoutes = require("./materialRoutes");
const toolRoutes = require("./toolRoutes");

const router = express.Router();

router.get("/api/projects", authenticateUser, async (req, res) => {
  try {
    // Access the authenticated user data from req.user
    const userId = req.user.id;

    const userProjects = await fetchUserProjects(userId);

    res.json(userProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/api/projects/:projectId", authenticateUser, async (req, res) => {
  try {
    // Access the authenticated user data from req.user
    const userId = req.user.id;
    const projectId = req.params.projectId;

    const userProject = await fetchUserProjectById(userId, projectId);

    res.json(userProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/api/projects",
  [authenticateUser, validateProjectData],
  async (req, res) => {
    try {
      // Access the authenticated user data from req.user
      const userId = req.user.id;
      const newProject = req.body;

      const createdProject = await createUserProject(userId, newProject);

      res.status(201).json(createdProject);
    } catch {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.put(
  "/api/projects/:projectId",
  [authenticateUser, validateProjectData],
  async (req, res) => {
    try {
      const userId = req.user.id;
      const projectId = req.params.projectId;
      const updatedProject = req.body;

      const project = await updateUserProject(
        userId,
        projectId,
        updatedProject
      );

      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

router.delete(
  "/api/projects/:projectId",
  authenticateUser,
  async (req, res) => {
    try {
      // Access the authenticated user data from req.user
      const userId = req.user.id;
      const projectId = req.params.projectId;

      const message = await deleteUserProject(userId, projectId);

      res.json(message);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Task, materials and tools routes
router.use("/api/projects/:projectId/tasks", taskRoutes);
router.use("/api/projects/:projectId/materials", materialRoutes);
router.use("/api/projects/:projectId/tools", toolRoutes);

module.exports = router;
