import {ElementStatus} from '../enums/element-status';
import {Types} from 'mongoose';

export interface ElementDto {
	_id: Types.ObjectId;
	projectId: Types.ObjectId;
	name: string;
	imageUrl?: string;
	status: ElementStatus;
	deliveryDate?: Date;
	allDay: boolean;
	cost: number;
	quantity: number;
	location?: string;
	link?: string;
	note?: string;
}
export type Element = Omit<ElementDto, '_id' | 'projectId'> & {id: Types.ObjectId};
export type ElementData = Omit<ElementDto, '_id' | 'projectId'> & {projectId?: Types.ObjectId};
