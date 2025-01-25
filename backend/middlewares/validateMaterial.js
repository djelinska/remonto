const { Material } = require("../models/materialModel");

const validateMaterialData = async (req, res, next) => {
    try {
        const projectId = req.params.projectId
        const materialData = { ...req.body, projectId };

        const material = new Material(materialData);

        await material.validate();

        next();
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map((err) => err.message);
            return res
                .status(400)
                .json({ message: "Validation error", details: errors });
        }

        next(error);
    }
};

module.exports = validateMaterialData;
