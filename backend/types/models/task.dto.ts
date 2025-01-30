import { TaskCategory } from '../enums/task-category';
import { TaskPriority } from '../enums/task-priority';
import { TaskStatus } from '../enums/task-status';
import { Types } from 'mongoose';

export interface TaskDto {
	_id: Types.ObjectId;
	projectId: Types.ObjectId;
	name: string;
	category: TaskCategory;
	status: TaskStatus;
	startDate?: Date;
	endDate?: Date;
	allDay: boolean;
	priority: TaskPriority;
	cost: number;
	note?: string;
}
export type Task = Omit<TaskDto, '_id'> & { id: Types.ObjectId };
export type TaskData = Omit<TaskDto, '_id'>;
