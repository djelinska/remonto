import { Project, ProjectData, ProjectDto, ProjectNoteData, ProjectNoteDto } from '../types/models/project.dto';
import mongoose, { Types } from 'mongoose';

import MaterialModel from '../models/materialModel';
import ProjectModel from '../models/projectModel';
import ReturnMessage from '../types/models/returnMessage.model';
import TaskModel from '../models/taskModel';
import ToolModel from '../models/toolModel';

type ObjectId = Types.ObjectId;

type ProjectList = Array<{ id: Types.ObjectId; name: string }>;

export const fetchUserProjects = async (userId: ObjectId): Promise<ProjectList> => {
	try {
		const projects: ProjectDto[] | null = await ProjectModel.find({ userId: userId });

		if (projects.length === 0) {
			throw new Error('No projects found for this user');
		  }

		if (!projects) {
			throw new Error("Projects not found or you don't have permission to view them");
		}

		return projects.map((project: ProjectDto) => ({
			id: project._id,
			name: project.name,
		}));
	} catch (error) {
		console.error('Error fetching projects:', error);
		throw new Error('Error fetching projects');
	}
};

export const fetchUserProjectById = async (userId: ObjectId, projectId: ObjectId): Promise<Project> => {
	try {
		const project: ProjectDto | null = await ProjectModel.findOne({ userId: userId, _id: projectId });

		if (!project) {
			throw new Error("Projects not found or you don't have permission to view them");
		}

		return {
			id: project._id,
			name: project.name,
			description: project.description,
			startDate: project.startDate,
			endDate: project.endDate,
			budget: parseFloat(project.budget.toString()),
			imageUrls: project.imageUrls,
			notes: project.notes,
		};
	} catch (error) {
		console.error('Error fetching projects:', error);
		throw new Error('Error fetching projects');
	}
};

export const createUserProject = async (userId: ObjectId, newProject: ProjectData): Promise<Project> => {
	try {
		const project = new ProjectModel({
			userId: userId,
			name: newProject.name,
			description: newProject.description,
			startDate: newProject.startDate,
			endDate: newProject.endDate,
			budget: parseFloat(newProject.budget.toString()),
		});

		await project.save();

		return {
			id: project._id,
			name: project.name,
			description: project.description,
			startDate: project.startDate,
			endDate: project.endDate,
			budget: project.budget,
		};
	} catch (error) {
		console.error('Error creating project:', error);
		throw new Error('Error creating project');
	}
};

export const updateUserProject = async (userId: ObjectId, projectId: ObjectId, updatedProject: ProjectData): Promise<Project> => {
	try {
		const project: ProjectDto | null = await ProjectModel.findOneAndUpdate({ userId: userId, _id: projectId }, { $set: updatedProject }, { new: true, runValidators: true });

		if (!project) {
			throw new Error('Project not found or user not authorized to update the project.');
		}

		return {
			id: project._id,
			name: project.name,
			description: project.description,
			startDate: project.startDate,
			endDate: project.endDate,
			budget: parseFloat(project.budget.toString()),
		};
	} catch (error) {
		console.error('Error updating project:', error);
		throw new Error('Failed to update project');
	}
};

export const deleteUserProject = async (userId: ObjectId, projectId: ObjectId): Promise<ReturnMessage> => {
	try {
		const project = await ProjectModel.deleteOne({ userId: userId, _id: projectId });

		if (!project) {
			throw new Error('project not found or user not authorized');
		}

		return {
			message: 'Project deleted successfully',
		};
	} catch (error) {
		console.error('Error deleting project:', error);
		throw new Error('Error deleting project');
	}
};

export const fetchProjectBudget = async (userId: ObjectId, projectId: ObjectId) => {
	try {
		const project = await ProjectModel.findOne({ userId, _id: projectId });

		if (!project) {
			throw new Error('Project not found or user not authorized');
		}

		const [materialsCost, toolsCost, laborCost] = await Promise.all([
			MaterialModel.aggregate([{ $match: { projectId } }, { $group: { _id: null, totalCost: { $sum: '$cost' } } }]).then((res) => res[0]?.totalCost || 0),

			ToolModel.aggregate([{ $match: { projectId } }, { $group: { _id: null, totalCost: { $sum: '$cost' } } }]).then((res) => res[0]?.totalCost || 0),

			TaskModel.aggregate([{ $match: { projectId } }, { $group: { _id: null, totalCost: { $sum: '$cost' } } }]).then((res) => res[0]?.totalCost || 0),
		]);

		const totalSpent = materialsCost + toolsCost + laborCost;

		return {
			budget: project.budget,
			totalSpent,
			materialsCost,
			toolsCost,
			laborCost,
		};
	} catch (error) {
		console.error('Error fetching project budget:', error);
		throw new Error('Error fetching project budget');
	}
};

export const addImageToProject = async (userId: ObjectId, projectId: ObjectId, imageUrl: string) => {
	try {
		const project = await ProjectModel.findOneAndUpdate({ userId, _id: projectId }, { $push: { imageUrls: imageUrl } }, { new: true });

		if (!project) {
			throw new Error('Project not found or user not authorized');
		}

		return project.imageUrls;
	} catch (error) {
		console.error('Error adding project image:', error);
		throw new Error('Error adding project image');
	}
};

export const addNoteToProject = async (userId: ObjectId, projectId: ObjectId, note: string) => {
	try {
		const newNote: ProjectNoteData = {
			content: note,
			createdAt: new Date(),
		};

		const project = await ProjectModel.findOneAndUpdate({ userId, _id: projectId }, { $push: { notes: newNote } }, { new: true });

		if (!project) {
			throw new Error('Project not found or user not authorized');
		}

		return project.notes;
	} catch (error) {
		console.error('Error adding project note:', error);
		throw new Error('Error adding project note');
	}
};

export const deleteNoteFromProject = async (userId: ObjectId, projectId: ObjectId, noteId: ObjectId) => {
	try {
		const project = await ProjectModel.findOneAndUpdate({ userId, _id: projectId }, { $pull: { notes: { _id: noteId } } }, { new: true });

		if (!project) {
			throw new Error('Project not found or user not authorized');
		}

		return project.notes;
	} catch (error) {
		console.error('Error deleting project note:', error);
		throw new Error('Error deleting project note');
	}
};

export const removeImageFromProject = async (
    userId: ObjectId, 
    projectId: ObjectId, 
    imageUrl: string
): Promise<void> => {
    try {
        const project = await ProjectModel.findOneAndUpdate(
            { userId, _id: projectId },
            { $pull: { imageUrls: imageUrl } },
            { new: true }
        );

        if (!project) {
            throw new Error('Project not found or user not authorized');
        }
    } catch (error) {
        console.error('Error removing image from project:', error);
        throw new Error('Error removing image from project');
    }
};
