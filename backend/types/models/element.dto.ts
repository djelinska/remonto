import { Types } from 'mongoose';
import { ElementStatus } from '../enums/element-status';

export interface ElementDto {
    _id: Types.ObjectId;
    projectId: Types.ObjectId;
    name: string;
    imageUrl?: string;
    status: ElementStatus;
    cost: number;
    quantity: number;
    location?: string;
    link?: string;
    note?: string;
}
export type Element = Omit<ElementDto, '_id' | 'projectId'> & { id: Types.ObjectId }
export type ElementData = Omit<ElementDto, '_id' | 'projectId'>  & {projectId?: Types.ObjectId}
