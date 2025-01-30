import express, { Response } from 'express'
import authenticateUser from '../../middlewares/authenticateUser';
import {
    fetchProjectTools,
    fetchToolById,
    createTool,
    updateTool,
    deleteTool
} from '../../services/toolService'
import { checkIfCorrectId } from '../../utils/validation';
import validateToolData from '../../middlewares/validateTool';
import { Tool } from '../../types/models/tool.dto';
import { Types } from 'mongoose'
import { ToolRequest, PostToolRequest } from '../../types/models/toolRequest.dto';
const router = express.Router({ mergeParams: true });

router.get("/:toolId", [authenticateUser], async (req: ToolRequest, res: Response) => {
    try {
        const { projectId, toolId } = req.params;
        const userId = req.user?.id;
        if (!projectId || !toolId || !userId) {
            throw new Error("Could not find ids in request");
        }

        if (!checkIfCorrectId(toolId) || !checkIfCorrectId(projectId)) {
            throw new Error("Invalid IDs");
        }

        const tool: Tool = await fetchToolById(new Types.ObjectId(projectId), new Types.ObjectId(toolId));

        res.status(200).json(tool);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

router.get("/", authenticateUser, async (req: ToolRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const userId = req.user?.id;
        if (!projectId || !userId) {
            throw new Error("Could not find ids");
        }

        if (!checkIfCorrectId(projectId)) throw new Error("Invalid Project ID");

        const tools = await fetchProjectTools(new Types.ObjectId(projectId));

        res.status(200).json(tools);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});
router.post("/", [authenticateUser, validateToolData], async (req: PostToolRequest, res: Response) => {
    try {
        const { projectId } = req.params;
        const userId = req.user?.id;
        if (!projectId || !userId) {
            throw new Error("Could not find ids");
        }

        if (!checkIfCorrectId(projectId)) throw new Error("Invalid Project ID");

        const tool = await createTool(new Types.ObjectId(projectId), req.body);

        res.status(201).json(tool);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

router.put("/:toolId", [authenticateUser, validateToolData], async (req: PostToolRequest, res: Response) => {
    try {
        const { projectId, toolId } = req.params;
        const userId = req.user?.id;
        if (!projectId || !toolId || !userId) {
            throw new Error("Could not find ids in request");
        }

        if (!checkIfCorrectId(toolId) || !checkIfCorrectId(projectId)) {
            throw new Error("Invalid IDs");
        }

        const updatedTool = await updateTool(new Types.ObjectId(projectId), new Types.ObjectId(toolId), req.body);

        res.status(200).json(updatedTool);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

router.delete("/:toolId", authenticateUser, async (req: ToolRequest, res: Response) => {
    try {
        const { projectId, toolId } = req.params;
        const userId = req.user?.id;
        if (!projectId || !toolId || !userId) {
            throw new Error("Could not find ids in request");
        }

        if (!checkIfCorrectId(toolId) || !checkIfCorrectId(projectId)) {
            throw new Error("Invalid IDs");
        }

        const result = await deleteTool(new Types.ObjectId(projectId), new Types.ObjectId(toolId));

        res.status(200).json(result);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

export default router
