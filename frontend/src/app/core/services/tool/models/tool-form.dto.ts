import { ElementStatus } from '../../../../shared/enums/element-status';

export interface ToolFormDto {
  name: string;
  imageUrl?: string;
  status: ElementStatus;
  cost?: number;
  quantity?: number;
  location?: string;
  link?: string;
  note?: string;
}
