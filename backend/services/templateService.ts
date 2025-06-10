import {MaterialTemplateDto, TaskTemplateDto, Template, TemplateDto, TemplateFormDto, ToolTemplateDto} from '../types/models/template.dto';

import ReturnMessage from '../types/models/returnMessage.model';
import TemplateModel from '../models/templateModel';
import {Types} from 'mongoose';

type ObjectId = Types.ObjectId;

export const fetchTemplates = async (): Promise<Template[]> => {
	try {
		const templates = await TemplateModel.find();

		if (!templates.length) {
			return [];
		}

		return templates.map((template) => ({
			id: template._id,
			project: {
				name: template.project.name,
				description: template.project.description,
				budget: template.project.budget,
			},
			tasks: template.tasks.map((task: TaskTemplateDto) => ({
				name: task.name,
				status: task.status,
				category: task.category,
				priority: task.priority,
				note: task.note,
			})),
			materials: template.materials.map((material: MaterialTemplateDto) => ({
				name: material.name,
				status: material.status,
				quantity: material.quantity,
				unit: material.unit,
				type: material.type,
				note: material.note,
			})),
			tools: template.tools.map((tool: ToolTemplateDto) => ({
				name: tool.name,
				status: tool.status,
				quantity: tool.quantity,
				note: tool.note,
			})),
			taskCount: template.tasks.length,
			materialCount: template.materials.length,
			toolCount: template.tools.length,
		}));
	} catch (error) {
		console.error('Error fetching templates:', error);
		throw new Error('Error fetching templates');
	}
};

export const fetchTemplateById = async (templateId: ObjectId): Promise<Template> => {
	try {
		const template = await TemplateModel.findById(templateId);

		if (!template) {
			throw new Error('Template not found');
		}

		return {
			id: template._id,
			project: {
				name: template.project.name,
				description: template.project.description,
				budget: template.project.budget,
			},
			tasks: template.tasks.map((task: TaskTemplateDto) => ({
				name: task.name,
				status: task.status,
				category: task.category,
				priority: task.priority,
				note: task.note,
			})),
			materials: template.materials.map((material: MaterialTemplateDto) => ({
				name: material.name,
				status: material.status,
				quantity: material.quantity,
				unit: material.unit,
				type: material.type,
				note: material.note,
			})),
			tools: template.tools.map((tool: ToolTemplateDto) => ({
				name: tool.name,
				status: tool.status,
				quantity: tool.quantity,
				note: tool.note,
			})),
		};
	} catch (error) {
		console.error('Error fetching template:', error);
		throw new Error('Error fetching template');
	}
};

export const createTemplate = async (newTemplate: TemplateFormDto): Promise<TemplateFormDto> => {
	try {
		const template = new TemplateModel(newTemplate);

		await template.save();

		return template;
	} catch (error) {
		console.error('Error creating template:', error);
		throw new Error('Error creating template');
	}
};

export const updateTemplate = async (templateId: ObjectId, updatedTemplate: TemplateFormDto): Promise<TemplateFormDto> => {
	try {
		const template = await TemplateModel.findByIdAndUpdate(templateId, {$set: updatedTemplate}, {new: true, runValidators: true});

		if (!template) {
			throw new Error('Template not found');
		}

		return template;
	} catch (error) {
		console.error('Error updating template:', error);
		throw new Error('Error updating template');
	}
};

export const deleteTemplate = async (templateId: ObjectId): Promise<ReturnMessage> => {
	try {
		const result = await TemplateModel.findByIdAndDelete(templateId);

		if (!result) {
			throw new Error('Template not found');
		}

		return {
			message: 'Template deleted successfully',
		};
	} catch (error) {
		console.error('Error deleting template:', error);
		throw new Error('Error deleting template');
	}
};

const templateService = {
	fetchTemplates,
	fetchTemplateById,
	createTemplate,
	updateTemplate,
	deleteTemplate,
};

export default templateService;
