import express, { Response } from 'express'
import authenticateUser from '../../middlewares/authenticateUser';
import validateProjectData from '../../middlewares/validateProject';
import { fetchUserProjects, fetchUserProjectById, createUserProject, updateUserProject, deleteUserProject } from '../../services/projectService';
import taskRoutes from "./taskRoutes"
import materialRoutes from "./materialRoutes"
import toolRoutes from "./toolRoutes"
import { Types } from 'mongoose'
import { PostProjectRequest, ProjectRequest } from '../../types/models/projectRequest.dto';

const router = express.Router();

router.get("/api/projects", authenticateUser, async (req: ProjectRequest, res: Response) => {
    try {
        // Access the authenticated user data from req.user
        const userId = req.user?.id;
        if (!userId) {
            throw new Error("Could not find ids in request");
        }

        const userProjects = await fetchUserProjects(new Types.ObjectId(userId));

        res.json(userProjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/api/projects/:projectId", authenticateUser, async (req: ProjectRequest, res: Response) => {
    try {
        // Access the authenticated user data from req.user
        const userId = req.user?.id;
        const projectId = req.params.projectId;
        if (!userId || !projectId) {
            throw new Error("Could not find ids in request");
        }

        const userProject = await fetchUserProjectById(new Types.ObjectId(userId), new Types.ObjectId(projectId));

        res.json(userProject);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post(
    "/api/projects",
    [authenticateUser, validateProjectData],
    async (req: PostProjectRequest, res: Response) => {
        try {
            // Access the authenticated user data from req.user
            const userId = req.user?.id;
            const newProject = req.body;
            if (!userId) {
                throw new Error("Could not find ids in request");
            }

            const createdProject = await createUserProject(userId, newProject);

            res.status(201).json(createdProject);
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    }
);

router.put(
    "/api/projects/:projectId",
    [authenticateUser, validateProjectData],
    async (req: PostProjectRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            const projectId = req.params.projectId;
            const updatedProject = req.body;

            if (!userId || !projectId) {
                throw new Error("Could not find ids in request");
            }

            const project = await updateUserProject(
                new Types.ObjectId(userId),
                new Types.ObjectId(projectId),
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
    async (req: ProjectRequest, res: Response) => {
        try {
            // Access the authenticated user data from req.user
            const userId = req.user?.id;
            const projectId = req.params.projectId;
            if (!userId || !projectId) {
                throw new Error("Could not find ids in request");
            }

            const message = await deleteUserProject(new Types.ObjectId(userId), new Types.ObjectId(projectId));

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

export default router
