import { ElementDto, Element, ElementData} from './element.dto';

export interface MaterialDto extends ElementDto {
    type?: string;
}
export interface Material extends Element {
    type?: string;
}
export interface MaterialData extends ElementData {
    type?: string;
}
