import { ElementStatus } from '../../../../shared/enums/element-status';

export interface MaterialFormDto {
  name: string;
  imageUrl?: string;
  status: ElementStatus;
  cost?: number;
  quantity?: number;
  type?: string;
  location?: string;
  link?: string;
  note?: string;
}
