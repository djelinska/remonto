import { ElementStatus } from "../enums/element-status";
import { MaterialUnit } from "../enums/material-unit";
import { TaskCategory } from "../enums/task-category";
import { TaskPriority } from "../enums/task-priority";
import { TaskStatus } from "../enums/task-status";

export interface ProjectTemplateDto {
  name: string;
  description?: string;
  budget: number;
}

export interface TaskTemplateDto {
  name: string;
  status?: TaskStatus;
  category: TaskCategory;
  priority: TaskPriority;
  note?: string;
}

export interface MaterialTemplateDto {
  name: string;
  status?: ElementStatus;
  quantity: number;
  unit?: MaterialUnit;
  type?: string;
  note?: string;
}

export interface ToolTemplateDto {
  name: string;
  status?: ElementStatus;
  quantity: number;
  note?: string;
}

export interface TemplateFormDto {
  project: ProjectTemplateDto;
  tasks: TaskTemplateDto[];
  materials: MaterialTemplateDto[];
  tools: ToolTemplateDto[];
}
