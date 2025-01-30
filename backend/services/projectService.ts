import { Types } from "mongoose";
import { Project, ProjectData, ProjectDto } from "../types/models/project.dto";
import ProjectModel from "../models/projectModel";
import ReturnMessage from "../types/models/returnMessage.model";
type ObjectId = Types.ObjectId

type ProjectList = Array<{ id: Types.ObjectId, name: string }>

export const fetchUserProjects = async (userId: ObjectId): Promise<ProjectList> => {
    try {
        const projects: ProjectDto[] | null = await ProjectModel.find({ userId: userId });

        if (!projects) {
            throw new Error(
                "Projects not found or you don't have permission to view them"
            );
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
            throw new Error(
                "Projects not found or you don't have permission to view them"
            );
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
        const project: ProjectDto | null = await ProjectModel.findOneAndUpdate(
            { userId: userId, _id: projectId },
            { $set: updatedProject },
            { new: true, runValidators: true }
        );


        if (!project) {
            throw new Error(
                'Project not found or user not authorized to update the project.'
            );
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
            throw new Error("project not found or user not authorized");
        }

        return {
            message: 'Project deleted successfully',
        };
    } catch (error) {
        console.error('Error deleting project:', error);
        throw new Error('Error deleting project');
    }
};
