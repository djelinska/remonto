import { Types } from 'mongoose';

export interface ProjectDto {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	name: string;
	description?: string;
	startDate: Date;
	endDate?: Date;
	budget: number;
	imageUrls: string[];
}
export type Project = Omit<ProjectDto, '_id' | 'userId'> & { id: Types.ObjectId };
export type ProjectData = Omit<ProjectDto, '_id' | 'userId'>;
