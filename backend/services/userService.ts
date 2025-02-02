import AppError from '../utils/AppError';
import { MaterialDto } from '../types/models/material.dto';
import MaterialModel from '../models/materialModel';
import { ProjectDto } from '../types/models/project.dto';
import ProjectModel from '../models/projectModel';
import { TaskDto } from '../types/models/task.dto';
import TaskModel from '../models/taskModel';
import { ToolDto } from '../types/models/tool.dto';
import ToolModel from '../models/toolModel';
import { Types } from 'mongoose';
import { UserDto } from '../types/models/user.dto';
import UserModel from '../models/userModel';
import { encryptPassword } from '../utils/validation';

interface UserData {
	tasks: Array<TaskDto & { projectName: string; type: 'task' }>;
	materials: Array<MaterialDto & { projectName: string; type: 'material' }>;
	tools: Array<ToolDto & { projectName: string; type: 'tool' }>;
}

const fetchUserProfile = async (userId: string): Promise<UserDto> => {
	const user: UserDto | null = await UserModel.findById(new Types.ObjectId(userId));
	if (!user) {
		throw new Error('User not found');
	}

	return user;
};

const fetchAllUserData = async (userId: string): Promise<UserData> => {
	try {
		const projects: ProjectDto[] = await ProjectModel.find({ userId: new Types.ObjectId(userId) }).select('_id name');

		if (!projects.length) {
			return { tasks: [], materials: [], tools: [] };
		}

		const projectIds = projects.map((project) => project._id);

		const tasks = await TaskModel.find({ projectId: { $in: projectIds } })
			.select('name projectId')
			.lean();

		const materials = await MaterialModel.find({ projectId: { $in: projectIds } })
			.select('name projectId')
			.lean();

		const tools = await ToolModel.find({ projectId: { $in: projectIds } })
			.select('name projectId')
			.lean();

		const projectsMap: Record<string, string> = projects.reduce((acc, project) => {
			acc[project._id.toString()] = project.name;
			return acc;
		}, {} as Record<string, string>);

		return {
			tasks: tasks.map((task) => ({
				...task,
				projectName: projectsMap[task.projectId.toString()] || 'Nieznany projekt',
				type: 'task',
			})),
			materials: materials.map((material) => ({
				...material,
				projectName: projectsMap[material.projectId.toString()] || 'Nieznany projekt',
				type: 'material',
			})),
			tools: tools.map((tool) => ({
				...tool,
				projectName: projectsMap[tool.projectId.toString()] || 'Nieznany projekt',
				type: 'tool',
			})),
		};
	} catch (error: any) {
		throw new Error(`Error fetching user data: ${error.message}`);
	}
};

const updateUserProfile = async (userId: string, updateData: Partial<UserDto>): Promise<UserDto> => {
    const updateObj: Partial<UserDto> = {};

    if (updateData.firstName !== undefined) {
        updateObj.firstName = updateData.firstName;
    }
    if (updateData.lastName !== undefined) {
        updateObj.lastName = updateData.lastName;
    }
    if (updateData.email !== undefined) {
        updateObj.email = updateData.email;
    }
    if (updateData.password !== undefined) {
        updateObj.password = await encryptPassword(updateData.password);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(new Types.ObjectId(userId), updateObj, { new: true }).select('-password');

    if (!updatedUser) {
        throw new AppError('Nie znaleziono użytkownika', 404);
    }

    return updatedUser;
};


const deleteUserProfile = async (userId: string): Promise<void> => {
    const user = await UserModel.findById(new Types.ObjectId(userId));
    if (!user) {
        throw new AppError('Nie znaleziono użytkownika', 404);
    }

    const projects = await ProjectModel.find({ userId: new Types.ObjectId(userId) });

    if (projects.length > 0) {
        const projectIds = projects.map((project) => project._id);

        await TaskModel.deleteMany({ projectId: { $in: projectIds } });
        await MaterialModel.deleteMany({ projectId: { $in: projectIds } });
        await ToolModel.deleteMany({ projectId: { $in: projectIds } });

        await ProjectModel.deleteMany({ userId: new Types.ObjectId(userId) });
    }

    await UserModel.findByIdAndDelete(new Types.ObjectId(userId));
};


const userService = {
	fetchUserProfile: fetchUserProfile,
	fetchAllUserData: fetchAllUserData,
	updateUserProfile: updateUserProfile,
	deleteUserProfile: deleteUserProfile,
};

export default userService;
