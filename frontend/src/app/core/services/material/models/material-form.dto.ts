import { ElementStatus } from '../../../../shared/enums/element-status';
import { MaterialUnit } from '../../../../shared/enums/material-unit';

export interface MaterialFormDto {
  name: string;
  imageUrl?: string;
  status: ElementStatus;
  deliveryDate?: string;
  allDay: boolean;
  cost?: number;
  quantity?: number;
  unit: MaterialUnit;
  type?: string;
  location?: string;
  link?: string;
  note?: string;
}
