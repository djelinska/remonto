import { ElementStatus } from '../../../../shared/enums/element-status';
import { TaskCategory } from '../../../../shared/enums/task-category';
import { TaskPriority } from '../../../../shared/enums/task-priority';

export interface ProjectFormDto {
  name: string;
  description?: string;
  budget: number;
}

export interface TaskFormDto {
  name: string;
  category: TaskCategory;
  priority: TaskPriority;
  note?: string;
}

export interface MaterialFormDto {
  name: string;
  status: ElementStatus;
  quantity: number;
  type?: string;
  note?: string;
}

export interface ToolFormDto {
  name: string;
  status: ElementStatus;
  quantity: number;
  note?: string;
}

export interface TemplateFormDto {
  project: ProjectFormDto;
  tasks: TaskFormDto[];
  materials: MaterialFormDto[];
  tools: ToolFormDto[];
}
