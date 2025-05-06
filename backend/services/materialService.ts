import {Material, MaterialData, MaterialDto} from '../types/models/material.dto';

import MaterialModel from '../models/materialModel';
import ReturnMessage from '../types/models/returnMessage.model';
import {Types} from 'mongoose';
import {deleteFileByUrl} from '../utils/fileUtils';

type ObjectId = Types.ObjectId;

export const fetchProjectMaterials = async (projectId: ObjectId): Promise<Material[]> => {
	try {
		const materials: MaterialDto[] = await MaterialModel.find({projectId});

		return materials.map((material: MaterialDto) => ({
			id: material._id,
			name: material.name,
			imageUrl: material.imageUrl,
			status: material.status,
			deliveryDate: material.deliveryDate,
			allDay: material.allDay,
			cost: parseFloat(material.cost.toString()),
			quantity: material.quantity,
			unit: material.unit,
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

export const fetchMaterialById = async (projectId: ObjectId, materialId: ObjectId): Promise<Material> => {
	try {
		const material: MaterialDto | null = await MaterialModel.findOne({projectId, _id: materialId});

		if (!material) {
			throw new Error('Material not found');
		}

		return {
			id: material._id,
			name: material.name,
			imageUrl: material.imageUrl,
			status: material.status,
			deliveryDate: material.deliveryDate,
			allDay: material.allDay,
			cost: parseFloat(material.cost.toString()),
			quantity: material.quantity,
			unit: material.unit,
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

export const createMaterial = async (projectId: ObjectId, materialData: MaterialData): Promise<Material> => {
	try {
		const material = new MaterialModel({
			projectId,
			name: materialData.name,
			imageUrl: materialData.imageUrl,
			status: materialData.status,
			deliveryDate: materialData.deliveryDate,
			allDay: materialData.allDay,
			cost: materialData.cost || 0.0,
			quantity: materialData.quantity || 0,
			unit: materialData.unit,
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
			deliveryDate: material.deliveryDate,
			allDay: material.allDay,
			cost: parseFloat(material.cost.toString()),
			quantity: material.quantity,
			unit: material.unit,
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

export const updateMaterial = async (projectId: ObjectId, materialId: ObjectId, materialData: MaterialData): Promise<Material> => {
	try {
		const currentMaterial = await MaterialModel.findOne({projectId, _id: materialId});
		const material: MaterialDto | null = await MaterialModel.findOneAndUpdate({projectId, _id: materialId}, {$set: materialData}, {new: true, runValidators: true});

		if (!material) {
			throw new Error('Material not found or user not authorized');
		}

		if (currentMaterial?.imageUrl && currentMaterial.imageUrl !== material.imageUrl) {
			deleteFileByUrl(currentMaterial.imageUrl);
		}

		return {
			id: material._id,
			name: material.name,
			imageUrl: material.imageUrl,
			status: material.status,
			deliveryDate: material.deliveryDate,
			allDay: material.allDay,
			cost: parseFloat(material.cost.toString()),
			quantity: material.quantity,
			unit: material.unit,
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

export const deleteMaterial = async (projectId: ObjectId, materialId: ObjectId): Promise<ReturnMessage> => {
	try {
		const material: MaterialDto | null = await MaterialModel.findOne({
			projectId,
			_id: materialId,
		});

		if (!material) {
			throw new Error('Material not found or user not authorized');
		}

		await MaterialModel.deleteOne({
			projectId,
			_id: materialId,
		});

		if (material.imageUrl) {
			deleteFileByUrl(material.imageUrl);
		}

		return {message: 'Material and associated image (if any) deleted successfully'};
	} catch (error) {
		console.error('Error deleting material:', error);
		throw new Error('Error deleting material');
	}
};
