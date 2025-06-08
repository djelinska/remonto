import express, { Response } from "express";
import authenticateUser from "../../middlewares/authenticateUser";
import { fetchProjectTasks, createProjectTask, updateProjectTask, deleteProjectTask, fetchProjectTaskById } from "../../services/taskService";
import validateTaskData from "../../middlewares/validateTask";
import { Types } from 'mongoose'
import { TaskRequest, PostTaskRequest } from "../../types/models/taskRequest.dto";

const router = express.Router({ mergeParams: true });


router.get("/", [authenticateUser], async (req: TaskRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.projectId;
        if (!projectId || !userId) {
            throw new Error("Could not find ids in request");
        }
        const tasks = await fetchProjectTasks(new Types.ObjectId(userId), new Types.ObjectId(projectId));
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/:taskId", [authenticateUser], async (req: TaskRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.projectId;
        const taskId = req.params.taskId;
        if (!projectId || !userId || !taskId) {
            throw new Error("Could not find ids in request");
        }
        const task = await fetchProjectTaskById(new Types.ObjectId(userId), new Types.ObjectId(projectId), new Types.ObjectId(taskId));
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.post("/", [authenticateUser, validateTaskData], async (req: PostTaskRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.projectId;
        const newTask = req.body;
        if (!projectId || !userId) {
            throw new Error("Could not find ids in request");
        }
        const task = await createProjectTask(new Types.ObjectId(userId), new Types.ObjectId(projectId), newTask);
        res.status(201).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.put("/:taskId", [authenticateUser, validateTaskData], async (req: PostTaskRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.projectId;
        const taskId = req.params.taskId;
        const updatedTask = req.body;
        const task = await updateProjectTask(
            new Types.ObjectId(userId),
            new Types.ObjectId(projectId),
            new Types.ObjectId(taskId),
            updatedTask
        );
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

router.delete("/:taskId", [authenticateUser], async (req: TaskRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        const projectId = req.params.projectId;
        const taskId = req.params.taskId;
        if (!projectId || !userId || !taskId) {
            throw new Error("Could not find ids in request");
        }
        await deleteProjectTask(new Types.ObjectId(userId), new Types.ObjectId(projectId), new Types.ObjectId(taskId));
        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router
