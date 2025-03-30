import { ElementDto } from './element.dto';
import { MaterialUnit } from '../enums/material-unit';

export interface MaterialDto extends ElementDto {
  unit?: MaterialUnit;
  type?: string;
}
