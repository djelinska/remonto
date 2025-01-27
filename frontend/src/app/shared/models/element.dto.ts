import { ElementStatus } from '../enums/element-status';

export interface ElementDto {
  id: string;
  name: string;
  imageUrl?: string;
  status: ElementStatus;
  cost: number;
  quantity: number;
  location?: string;
  link?: string;
  note?: string;
}
