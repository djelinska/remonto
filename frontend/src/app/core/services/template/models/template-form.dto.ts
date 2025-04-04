import { ElementStatus } from '../../../../shared/enums/element-status';
import { MaterialUnit } from '../../../../shared/enums/material-unit';
import { TaskCategory } from '../../../../shared/enums/task-category';
import { TaskPriority } from '../../../../shared/enums/task-priority';
import { TaskStatus } from '../../../../shared/enums/task-status';

export interface ProjectFormDto {
  name: string;
  description?: string;
  budget: number;
}

export interface TaskFormDto {
  name: string;
  status?: TaskStatus;
  category: TaskCategory;
  priority: TaskPriority;
  note?: string;
}

export interface MaterialFormDto {
  name: string;
  status?: ElementStatus;
  quantity: number;
  unit?: MaterialUnit;
  type?: string;
  note?: string;
}

export interface ToolFormDto {
  name: string;
  status?: ElementStatus;
  quantity: number;
  note?: string;
}

export interface TemplateFormDto {
  project: ProjectFormDto;
  tasks: TaskFormDto[];
  materials: MaterialFormDto[];
  tools: ToolFormDto[];
}
