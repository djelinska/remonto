import {Element, ElementData, ElementDto} from './element.dto';

import {MaterialUnit} from '../enums/material-unit';

export interface MaterialDto extends ElementDto {
	unit?: MaterialUnit;
	type?: string;
}
export interface Material extends Element {
	unit?: MaterialUnit;
	type?: string;
}
export interface MaterialData extends ElementData {
	unit?: MaterialUnit;
	type?: string;
}
