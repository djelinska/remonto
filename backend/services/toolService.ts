import {ToolData, ToolDto} from '../types/models/tool.dto';

import ReturnMessage from '../types/models/returnMessage.model';
import {Tool} from '../types/models/tool.dto';
import ToolModel from '../models/toolModel';
import {Types} from 'mongoose';
import {deleteFileByUrl} from '../utils/fileUtils';

type ObjectId = Types.ObjectId;

export const fetchProjectTools = async (projectId: ObjectId): Promise<Tool[]> => {
	try {
		const tools: ToolDto[] = await ToolModel.find({projectId});

		return tools.map((tool: ToolDto): Tool => {
			return {
				id: tool._id,
				name: tool.name,
				imageUrl: tool.imageUrl,
				status: tool.status,
				deliveryDate: tool.deliveryDate,
				allDay: tool.allDay,
				cost: parseFloat(tool.cost.toString()),
				quantity: tool.quantity,
				location: tool.location,
				link: tool.link,
				note: tool.note,
			};
		});
	} catch (error) {
		console.error('Error fetching project tools:', error);
		throw new Error('Error fetching project tools');
	}
};

export const fetchToolById = async (projectId: ObjectId, toolId: ObjectId): Promise<Tool> => {
	try {
		const tool: ToolDto | null = await ToolModel.findOne({projectId, _id: toolId});

		if (!tool) {
			throw new Error('Tool not found');
		}

		return {
			id: tool._id,
			name: tool.name,
			imageUrl: tool.imageUrl,
			status: tool.status,
			deliveryDate: tool.deliveryDate,
			allDay: tool.allDay,
			cost: parseFloat(tool.cost.toString()),
			quantity: tool.quantity,
			location: tool.location,
			link: tool.link,
			note: tool.note,
		};
	} catch (error) {
		console.error('Error fetching tool by ID:', error);
		throw new Error('Error fetching tool by ID');
	}
};

export const createTool = async (projectId: ObjectId, toolData: ToolData): Promise<Tool> => {
	try {
		const tool = new ToolModel({
			projectId,
			name: toolData.name,
			imageUrl: toolData.imageUrl,
			status: toolData.status,
			deliveryDate: toolData.deliveryDate,
			allDay: toolData.allDay,
			cost: toolData.cost,
			quantity: toolData.quantity,
			location: toolData.location,
			link: toolData.link,
			note: toolData.note,
		});

		await tool.save();

		return {
			id: tool._id,
			name: tool.name,
			imageUrl: tool.imageUrl,
			status: tool.status,
			deliveryDate: tool.deliveryDate,
			allDay: tool.allDay,
			cost: parseFloat(tool.cost.toString()),
			quantity: tool.quantity,
			location: tool.location,
			link: tool.link,
			note: tool.note,
		};
	} catch (error) {
		console.error('Error creating tool:', error);
		throw new Error('Error creating tool');
	}
};

export const updateTool = async (projectId: ObjectId, toolId: ObjectId, toolData: ToolData): Promise<Tool> => {
	try {
		const currentTool = await ToolModel.findOne({projectId, _id: toolId});

		if (!currentTool) {
			throw new Error('Tool not found or user not authorized');
		}

		const tool: ToolDto | null = await ToolModel.findOneAndUpdate({projectId, _id: toolId}, {$set: toolData}, {new: true, runValidators: true});

		if (!tool) {
			throw new Error('Tool not found or user not authorized');
		}

		if (currentTool.imageUrl) {
			if (!toolData.imageUrl || currentTool.imageUrl !== toolData.imageUrl) {
				deleteFileByUrl(currentTool.imageUrl);
			}
		}

		return {
			id: tool._id,
			name: tool.name,
			imageUrl: tool.imageUrl,
			status: tool.status,
			deliveryDate: tool.deliveryDate,
			allDay: tool.allDay,
			cost: parseFloat(tool.cost.toString()),
			quantity: tool.quantity,
			location: tool.location,
			link: tool.link,
			note: tool.note,
		};
	} catch (error) {
		console.error('Error updating tool:', error);
		throw new Error('Error updating tool');
	}
};

export const deleteTool = async (projectId: ObjectId, toolId: ObjectId): Promise<ReturnMessage> => {
	try {
		const tool: ToolDto | null = await ToolModel.findOne({
			projectId,
			_id: toolId,
		});

		if (!tool) {
			throw new Error('Tool not found or user not authorized');
		}

		await ToolModel.deleteOne({
			projectId,
			_id: toolId,
		});

		if (tool.imageUrl) {
			const deletionResult = deleteFileByUrl(tool.imageUrl);
			if (deletionResult == false) {
				console.error('Error deleting image file');
				throw new Error('Error deleting tool image file');
			}
		}

		return {message: 'Tool and associated image (if any) deleted successfully'};
	} catch (error) {
		console.error('Error deleting tool:', error);
		throw new Error('Error deleting tool');
	}
};
