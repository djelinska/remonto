const { Material } = require('../models/materialModel');

const fetchProjectMaterials = async (userId, projectId) => {
	try {
		const materials = await Material.find({ projectId });

		return materials.map((material) => ({
			id: material._id,
			name: material.name,
			imageUrl: material.imageUrl,
			status: material.status,
			cost: parseFloat(material.cost.toString()),
			quantity: material.quantity,
			location: material.location,
			link: material.link,
			note: material.note,
			type: material.type,
		}));
	} catch (error) {
		console.error('Error fetching project materials:', error);
		throw new Error('Error fetching project materials');
	}
};

const fetchMaterialById = async (userId, projectId, materialId) => {
	try {
		const material = await Material.findOne({ projectId, _id: materialId });

		if (!material) {
			throw new Error('Material not found');
		}

		return {
			id: material._id,
			name: material.name,
			imageUrl: material.imageUrl,
			status: material.status,
			cost: parseFloat(material.cost.toString()),
			quantity: material.quantity,
			location: material.location,
			link: material.link,
			note: material.note,
			type: material.type,
		};
	} catch (error) {
		console.error('Error fetching material by ID:', error);
		throw new Error('Error fetching material by ID');
	}
};

const createMaterial = async (userId, projectId, materialData) => {
	try {
		const material = new Material({
			projectId,
			name: materialData.name,
			imageUrl: materialData.imageUrl,
			status: materialData.status,
			cost: materialData.cost || 0.0,
			quantity: materialData.quantity || 0,
			location: materialData.location,
			link: materialData.link,
			note: materialData.note,
			type: materialData.type,
		});

		await material.save();

		return {
			id: material._id,
			name: material.name,
			imageUrl: material.imageUrl,
			status: material.status,
			cost: parseFloat(material.cost.toString()),
			quantity: material.quantity,
			location: material.location,
			link: material.link,
			note: material.note,
			type: material.type,
		};
	} catch (error) {
		console.error('Error creating material:', error);
		throw new Error('Error creating material');
	}
};

const updateMaterial = async (userId, projectId, materialId, materialData) => {
	try {
		const material = await Material.findOneAndUpdate({ projectId, _id: materialId }, { $set: materialData }, { new: true, runValidators: true });

		if (!material) {
			throw new Error('Material not found or user not authorized');
		}

		return {
			id: material._id,
			name: material.name,
			imageUrl: material.imageUrl,
			status: material.status,
			cost: parseFloat(material.cost.toString()),
			quantity: material.quantity,
			location: material.location,
			link: material.link,
			note: material.note,
			type: material.type,
		};
	} catch (error) {
		console.error('Error updating material:', error);
		throw new Error('Error updating material');
	}
};

const deleteMaterial = async (userId, projectId, materialId) => {
	try {
		const material = await Material.findOneAndDelete({ projectId, _id: materialId });

		if (!material) {
			throw new Error('Material not found or user not authorized');
		}

		return { message: 'Material deleted successfully' };
	} catch (error) {
		console.error('Error deleting material:', error);
		throw new Error('Error deleting material');
	}
};

module.exports = {
	fetchProjectMaterials,
	fetchMaterialById,
	createMaterial,
	updateMaterial,
	deleteMaterial,
};
