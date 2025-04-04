import { ElementStatus } from '../enums/element-status';
import { MaterialUnit } from '../enums/material-unit';
import { TaskCategory } from '../enums/task-category';
import { TaskPriority } from '../enums/task-priority';
import { TaskStatus } from '../enums/task-status';

export interface ProjectDto {
  name: string;
  description?: string;
  budget: number;
}

export interface TaskDto {
  id?: string;
  name: string;
  status?: TaskStatus | string;
  category: TaskCategory | string;
  priority: TaskPriority | string;
  note?: string;
}

export interface MaterialDto {
  id?: string;
  name: string;
  status?: ElementStatus | string;
  quantity: number;
  unit?: MaterialUnit | string;
  type?: string;
  note?: string;
}

export interface ToolDto {
  id?: string;
  name: string;
  status?: ElementStatus | string;
  quantity: number;
  note?: string;
}

export interface TemplateDto {
  id: string;
  project: ProjectDto;
  tasks: TaskDto[];
  materials: MaterialDto[];
  tools: ToolDto[];
  taskCount: number;
  materialCount: number;
  toolCount: number;
}
