import {User, UserDto} from '../types/models/user.dto';
import {checkEmail, checkPassword, comparePassword, encryptPassword} from '../utils/validation';

import AppError from '../utils/AppError';
import {MaterialDto} from '../types/models/material.dto';
import MaterialModel from '../models/materialModel';
import {ProjectDto} from '../types/models/project.dto';
import ProjectModel from '../models/projectModel';
import {TaskDto} from '../types/models/task.dto';
import TaskModel from '../models/taskModel';
import {ToolDto} from '../types/models/tool.dto';
import ToolModel from '../models/toolModel';
import {Types} from 'mongoose';
import UserModel from '../models/userModel';
import {UserTypes} from '../types/enums/user-types';

interface UserData {
	tasks: Array<TaskDto & {projectName: string; type: 'task'}>;
	materials: Array<MaterialDto & {projectName: string; type: 'material'}>;
	tools: Array<ToolDto & {projectName: string; type: 'tool'}>;
}

const fetchUserProfile = async (userId: string): Promise<UserDto> => {
	const user: UserDto | null = await UserModel.findById(new Types.ObjectId(userId));
	if (!user) {
		throw new Error('User not found');
	}

	return user;
};

const fetchUsers = async (): Promise<User[]> => {
	try {
		const users = await UserModel.find();

		return users.map((user: UserDto) => ({
			id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			type: user.type,
		}));
	} catch (error) {
		console.error('Error fetching users:', error);
		throw new Error('Error fetching users');
	}
};

const fetchAllUserData = async (userId: string): Promise<UserData> => {
	try {
		const projects: ProjectDto[] = await ProjectModel.find({userId: new Types.ObjectId(userId)}).select('_id name');

		if (!projects.length) {
			return {tasks: [], materials: [], tools: []};
		}

		const projectIds = projects.map((project) => project._id);

		const tasks = await TaskModel.find({projectId: {$in: projectIds}})
			.select('name projectId')
			.lean();

		const materials = await MaterialModel.find({projectId: {$in: projectIds}})
			.select('name projectId')
			.lean();

		const tools = await ToolModel.find({projectId: {$in: projectIds}})
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

const resetUserPassword = async (email: string, oldPassword: string, newPassword: string): Promise<UserDto> => {
	const updateObj: Partial<UserDto> = {};

	const user: UserDto | null = await UserModel.findOne({email});
	if (!user) {
		throw new AppError('Nieprawidłowe dane logowania', 401);
	}

	const passwordsMatch: boolean = await comparePassword(oldPassword, user.password);
	if (!passwordsMatch) {
		throw new AppError('Hasla sie nie zgadzaja', 401);
	}
	updateObj.password = await encryptPassword(newPassword);

	const updatedUser = await UserModel.findOneAndUpdate({email}, {$set: updateObj}, {new: true}).select('-password');

	if (!updatedUser) {
		throw new AppError('Nie znaleziono użytkownika', 404);
	}

	return updatedUser;
};

const checkAllowedOperation = async (paramsUserId: Types.ObjectId, tokenUserId: Types.ObjectId): Promise<boolean> => {
	if (!paramsUserId) {
		throw new Error('No user data provided');
	}
	const user = await UserModel.findById(paramsUserId);
	if (!user) {
		return false;
	}
	if (paramsUserId.toString() !== tokenUserId.toString()) {
		return false;
	}
	return true;
};

export const createUserProfile = async (newUser: UserDto): Promise<UserDto> => {
	if (!checkEmail(newUser.email)) {
		throw new Error('Invalid email format');
	}

	if (!checkPassword(newUser.password)) {
		throw new Error('Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character');
	}

	const existingUser: UserDto | null = await UserModel.findOne({email: newUser.email});
	if (existingUser) {
		throw new AppError('Email jest już powiązany z innym kontem', 409);
	}

	newUser.password = await encryptPassword(newUser.password);

	const user = new UserModel(newUser);
	await user.save();

	return user;
};

const updateUserProfile = async (userId: string, updateData: Partial<UserDto>): Promise<UserDto> => {
    const updateObj: Partial<UserDto> = {};
    
    if (updateData.firstName) {
        if (updateData.firstName.trim().length < 3) {
            throw new AppError('First name must be at least 3 characters', 400);
        }
        updateObj.firstName = updateData.firstName;
    }
    
    if (updateData.lastName) {
        if (updateData.lastName.trim().length < 3) {
            throw new AppError('Last name must be at least 3 characters', 400);
        }
        updateObj.lastName = updateData.lastName;
    }
    
    if (updateData.email) {
        const normalizedEmail = updateData.email.toLowerCase();
        if (!checkEmail(normalizedEmail)) {
            throw new AppError('Invalid email format', 400);
        }
        
        const existingUser = await UserModel.findOne({
            email: normalizedEmail,
            _id: { $ne: userId }
        });
        
        if (existingUser) {
            throw new AppError('Email is already associated with another account', 409);
        }
        
        updateObj.email = normalizedEmail;
    }
    
    if (updateData.password?.trim()) {
        if (!checkPassword(updateData.password)) {
            throw new AppError('Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character', 400);
        }
        updateObj.password = await encryptPassword(updateData.password);
    }
    
    if (updateData.type !== undefined) {
        updateObj.type = updateData.type;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
        new Types.ObjectId(userId),
        { $set: updateObj },
        { new: true }
    ).select('-password');

    if (!updatedUser) {
        throw new Error('User not found');
    }

    return updatedUser;
};

const deleteUserProfile = async (userId: string): Promise<void> => {
	const user = await UserModel.findById(new Types.ObjectId(userId));
	if (!user) {
		throw new AppError('Nie znaleziono użytkownika', 404);
	}

	const projects = await ProjectModel.find({userId: new Types.ObjectId(userId)});

	if (projects.length > 0) {
		const projectIds = projects.map((project) => project._id);

		await TaskModel.deleteMany({projectId: {$in: projectIds}});
		await MaterialModel.deleteMany({projectId: {$in: projectIds}});
		await ToolModel.deleteMany({projectId: {$in: projectIds}});

		await ProjectModel.deleteMany({userId: new Types.ObjectId(userId)});
	}

	await UserModel.findByIdAndDelete(new Types.ObjectId(userId));
};

const userService = {
	fetchUserProfile,
	fetchUsers,
	fetchAllUserData,
	createUserProfile,
	updateUserProfile,
	deleteUserProfile,
	checkAllowedOperation,
	resetUserPassword,
};

export default userService;
