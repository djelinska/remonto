import { Types} from "mongoose";
import ReturnMessage from "../types/models/returnMessage.model";
import { Task, TaskData, TaskDto } from "../types/models/task.dto";
import { ProjectDto } from "../types/models/project.dto";
import ProjectModel from "../models/projectModel";
import TaskModel from "../models/taskModel";
type ObjectId = Types.ObjectId

export const fetchProjectTasks = async (userId: ObjectId, projectId: ObjectId): Promise<Task[]> => {
    try {
        const project: ProjectDto | null = await ProjectModel.findOne({ userId, _id: projectId });

        if (!project) {
            throw new Error(
                "Project not found or you don't have permission to view it."
            );
        }

        const tasks: TaskDto[] = await TaskModel.find({ projectId });
        return tasks.map((task: TaskDto) => ({
            id: task._id,
            projectId: task.projectId,
            name: task.name,
            description: task.description,
            category: task.category,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            endDate: task.endDate,
            cost: parseFloat(task.cost.toString()),
        }));
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const fetchProjectTaskById = async (userId: ObjectId, projectId: ObjectId, taskId: ObjectId): Promise<Task> => {
    try {
        const project: ProjectDto | null = await ProjectModel.findOne({ userId, _id: projectId });

        if (!project) {
            throw new Error(
                "Project not found or you don't have permission to view it."
            );
        }

        const task: TaskDto | null = await TaskModel.findOne({ _id: taskId, projectId });

        if (!task) {
            throw new Error("Task not found.");
        }

        return {
            id: task._id,
            projectId: task.projectId,
            name: task.name,
            description: task.description,
            category: task.category,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            endDate: task.endDate,
            cost: parseFloat(task.cost.toString()),
        };
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const createProjectTask = async (userId: ObjectId, projectId: ObjectId, newTask: TaskData): Promise<Task> => {
    try {
        const project: ProjectDto | null = await ProjectModel.findOne({ userId, _id: projectId });

        if (!project) {
            throw new Error(
                "Project not found or you don't have permission to add tasks."
            );
        }

        const task = new TaskModel({
            ...newTask,
            projectId,
        });

        await task.save();
        return {
            id: task._id,
            projectId: task.projectId,
            name: task.name,
            description: task.description,
            category: task.category,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            endDate: task.endDate,
            cost: parseFloat(task.cost.toString()),
        };
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const updateProjectTask = async (userId: ObjectId, projectId: ObjectId, taskId: ObjectId, updatedTask: TaskData): Promise<Task> => {
    try {
        const project: ProjectDto | null = await ProjectModel.findOne({ userId, _id: projectId });

        if (!project) {
            throw new Error(
                "Project not found or you don't have permission to update tasks."
            );
        }

        const task: TaskDto | null = await TaskModel.findOneAndUpdate(
            { _id: taskId, projectId },
            updatedTask,
            { new: true, runValidators: true }
        );

        if (!task) {
            throw new Error(
                "Task not found or you don't have permission to update it."
            );
        }

        return {
            id: task._id,
            projectId: task.projectId,
            name: task.name,
            description: task.description,
            category: task.category,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            endDate: task.endDate,
            cost: parseFloat(task.cost.toString()),
        };
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const deleteProjectTask = async (userId: ObjectId, projectId: ObjectId, taskId: ObjectId): Promise<ReturnMessage> => {
    try {
        const project: ProjectDto | null = await ProjectModel.findOne({ userId, _id: projectId });

        if (!project) {
            throw new Error(
                "Project not found or you don't have permission to delete tasks."
            );
        }

        const result = await TaskModel.deleteOne({ _id: taskId, projectId });

        if (result.deletedCount === 0) {
            throw new Error(
                "Task not found or you don't have permission to delete it."
            );
        }

        return { message: "Task deleted successfully" };
    } catch (error: any) {
        throw new Error(error.message);
    }
};
