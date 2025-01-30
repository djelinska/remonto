import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';

import { ElementStatus } from '../types/enums/element-status';
import { TaskCategory } from '../types/enums/task-category';
import { TaskPriority } from '../types/enums/task-priority';
import { TaskStatus } from '../types/enums/task-status';
import { User } from '../types/models/user.dto';
import { UserTypes } from '../types/enums/user-types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const ObjectId = Types.ObjectId;




export function checkIfCorrectId(id: string): boolean {
	if (ObjectId.isValid(id)) {
		if (String(new ObjectId(id)) === id) {
			return true;
		} else {
			return false;
		}
	} else {
		return false;
	}
}

export function checkTokenValidity(token: string): boolean {
	try {
		jwt.verify(token, process.env.SECRETKEY as jwt.Secret);
		return true;
	} catch (error) {
		return false;
	}
}

export function checkIfAdmin(user: User): boolean {
	if (user.type === 'ADMIN') {
		return true;
	} else {
		return false;
	}
}
export function checkTaskStatus(status: TaskStatus): boolean {
	const statuses = ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'];
	if (statuses.includes(status)) {
		return true;
	} else {
		return false;
	}
}
export function checkTaskPriority(priority: TaskPriority): boolean {
	const priorities = ['LOW', 'MEDIUM', 'HIGH'];
	if (priorities.includes(priority)) {
		return true;
	} else {
		return false;
	}
}

export function checkToolsMaterialsStatus(status: ElementStatus): boolean {
	const statuses = ['NOT_ORDERED', 'ORDERED', 'RECEIVED'];
	if (statuses.includes(status)) {
		return true;
	} else {
		return false;
	}
}

export function checkTaskCategory(category: TaskCategory): boolean {
	const categories = ['DESIGN', 'CONSTRUCTION', 'INSTALLATIONS', 'FINISHING', 'CARPENTRY', 'SMART_HOME', 'LOGISTICS', 'CLEANUP'];
	if (categories.includes(category)) {
		return true;
	} else {
		return false;
	}
}

export function checkEmail(email: string): boolean {
	const mailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
	if (mailRegex.test(email)) {
		return true;
	} else {
		return false;
	}
}
export function checkStartAndEndDate(startDate: Date, endDate: Date): boolean {
	if (startDate.getTime() < endDate.getTime()) {
		return true;
	} else {
		return false;
	}
}
export function checkUserType(type: UserTypes): boolean {
	if (type === 'USER' || type === 'ADMIN') {
		return true;
	} else {
		return false;
	}
}
export function checkPassword(password: string): boolean {
	const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
	if (pwdRegex.test(password)) {
		return true;
	} else {
		return false;
	}
}
export async function comparePassword(password: string, hash: string): Promise<boolean> {
	const match: boolean = await bcrypt.compare(password, hash);
	return match;
}
const saltRounds: number = 10;
export async function encryptPassword(password: string): Promise<string> {
	const hash = await bcrypt
		.genSalt(saltRounds)
		.then((salt: string) => {
			return bcrypt.hash(password, salt);
		})
		.then((hash: string) => {
			return hash;
		});
	return hash;
}
