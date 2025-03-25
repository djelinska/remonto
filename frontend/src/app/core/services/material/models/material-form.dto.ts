import { ElementStatus } from '../../../../shared/enums/element-status';

export interface MaterialFormDto {
  name: string;
  imageUrl?: string;
  status: ElementStatus;
  deliveryDate?: string;
  allDay: boolean;
  cost?: number;
  quantity?: number;
  type?: string;
  location?: string;
  link?: string;
  note?: string;
}
