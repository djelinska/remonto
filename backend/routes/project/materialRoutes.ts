import express, { Response } from 'express'
import authenticateUser from '../../middlewares/authenticateUser';
import { fetchProjectMaterials, fetchMaterialById, createMaterial, updateMaterial, deleteMaterial } from '../../services/materialService';
import { checkIfCorrectId } from '../../utils/validation';
import validateMaterialData from '../../middlewares/validateMaterial';
import { MaterialRequest, PostMaterialRequest } from '../../types/models/materialRequest.dto';
import { Types } from 'mongoose'

const router = express.Router({ mergeParams: true });

router.get(
    "/",
    authenticateUser,
    async (req: MaterialRequest, res: Response) => {
        try {
            const { projectId } = req.params;
            const userId = req.user?.id;
            if (!projectId || !userId) {
                throw new Error("Could not find ids in request");
            }

            if (!checkIfCorrectId(projectId)) throw new Error("Invalid Project ID");
            const materials = await fetchProjectMaterials(new Types.ObjectId(userId), new Types.ObjectId(projectId));

            res.status(200).json(materials);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }
);

router.get(
    "/:materialId",
    authenticateUser,
    async (req: MaterialRequest, res: Response) => {
        try {
            const { projectId, materialId } = req.params;
            const userId = req.user?.id;

            if (!projectId || !userId || !materialId) {
                throw new Error("Could not find ids in request");
            }

            if (!checkIfCorrectId(materialId) || !checkIfCorrectId(projectId)) {
                throw new Error("Invalid IDs");
            }

            const material = await fetchMaterialById(new Types.ObjectId(userId), new Types.ObjectId(projectId), new Types.ObjectId(materialId));

            res.status(200).json(material);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }
);

router.post(
    "/",
    [authenticateUser, validateMaterialData],
    async (req: PostMaterialRequest, res: Response) => {
        try {
            const { projectId } = req.params;
            const userId = req.user?.id;
            if (!projectId || !userId ) {
                throw new Error("Could not find ids in request");
            }

            if (!checkIfCorrectId(projectId)) throw new Error("Invalid Project ID");

            const material = await createMaterial(new Types.ObjectId(userId), new Types.ObjectId(projectId), req.body);

            res.status(201).json(material);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }
);

router.put(
    "/:materialId",
    [authenticateUser, validateMaterialData],
    async (req: PostMaterialRequest, res: Response) => {
        try {
            const { projectId, materialId } = req.params;
            const userId = req.user?.id;
            if (!projectId || !userId || !materialId) {
                throw new Error("Could not find ids in request");
            }


            if (!checkIfCorrectId(materialId) || !checkIfCorrectId(projectId)) {
                throw new Error("Invalid IDs");
            }

            const updatedMaterial = await updateMaterial(new Types.ObjectId(userId), new Types.ObjectId(projectId), new Types.ObjectId(materialId), req.body);

            res.status(200).json(updatedMaterial);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }
);

router.delete(
    "/:materialId",
    authenticateUser,
    async (req: MaterialRequest, res: Response) => {
        try {
            const { projectId, materialId } = req.params;
            const userId = req.user?.id;
            if (!projectId || !userId || !materialId) {
                throw new Error("Could not find ids in request");
            }

            if (!checkIfCorrectId(materialId) || !checkIfCorrectId(projectId)) {
                throw new Error("Invalid IDs");
            }

            const result = await deleteMaterial(new Types.ObjectId(userId), new Types.ObjectId(projectId), new Types.ObjectId(materialId));

            res.status(200).json(result);
        } catch (error: any) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }
);

export default router
