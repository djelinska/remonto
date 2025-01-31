import { Types } from 'mongoose';

export interface ProjectDto {
	_id: Types.ObjectId;
	userId: Types.ObjectId;
	name: string;
	description?: string;
	startDate: Date;
	endDate?: Date;
	budget: number;
	imageUrls?: string[];
	notes?: ProjectNoteDto[];
}

export interface ProjectNoteDto {
	_id: Types.ObjectId;
	content: string;
	createdAt: Date;
}

export type Project = Omit<ProjectDto, '_id' | 'userId'> & { id: Types.ObjectId };
export type ProjectData = Omit<ProjectDto, '_id' | 'userId'>;
export type ProjectNoteData = Omit<ProjectNoteDto, '_id'>;
