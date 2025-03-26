import { ElementStatus } from '../../../../shared/enums/element-status';

export interface ToolFormDto {
  name: string;
  imageUrl?: string;
  status: ElementStatus;
  deliveryDate?: string;
  allDay: boolean;
  cost?: number;
  quantity?: number;
  location?: string;
  link?: string;
  note?: string;
}
