const express = require("express");
const authenticateUser = require("../../middlewares/authenticateUser");
const { 
  fetchProjectMaterials,
  fetchMaterialById,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} = require("../../services/materialService");
const { checkIfCorrectId } = require("../../utils/validation");

const router = express.Router({ mergeParams: true }); 

router.get(
  "/",
  authenticateUser,
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      if (!checkIfCorrectId(projectId)) throw new Error("Invalid Project ID");
      const materials = await fetchProjectMaterials(userId, projectId);

      res.status(200).json(materials);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

router.get(
  "/:materialId",
  authenticateUser,
  async (req, res) => {
    try {
      const { projectId, materialId } = req.params;
      const userId = req.user.id;

      if (!checkIfCorrectId(materialId) || !checkIfCorrectId(projectId)) {
        throw new Error("Invalid IDs");
      }

      const material = await fetchMaterialById(userId, projectId, materialId);

      res.status(200).json(material);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

router.post(
  "/",
  authenticateUser,
  async (req, res) => {
    try {
      const { projectId } = req.params;
      const userId = req.user.id;

      if (!checkIfCorrectId(projectId)) throw new Error("Invalid Project ID");

      const material = await createMaterial(userId, projectId, req.body);

      res.status(201).json(material);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

router.put(
  "/:materialId",
  authenticateUser,
  async (req, res) => {
    try {
      const { projectId, materialId } = req.params;
      const userId = req.user.id;

      if (!checkIfCorrectId(materialId) || !checkIfCorrectId(projectId)) {
        throw new Error("Invalid IDs");
      }

      const updatedMaterial = await updateMaterial(userId, projectId, materialId, req.body);

      res.status(200).json(updatedMaterial);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

router.delete(
  "/:materialId",
  authenticateUser,
  async (req, res) => {
    try {
      const { projectId, materialId } = req.params;
      const userId = req.user.id;

      if (!checkIfCorrectId(materialId) || !checkIfCorrectId(projectId)) {
        throw new Error("Invalid IDs");
      }

      const result = await deleteMaterial(userId, projectId, materialId);

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }
);

module.exports = router;
