import { MaterialFormDto } from '../../material/models/material-form.dto';
import { TaskFormDto } from '../../task/models/task-form.dto';
import { ToolFormDto } from '../../tool/models/tool-form.dto';

export interface ProjectFormDto {
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  budget: number;
  template?: string;
  tasks?: TaskFormDto[];
  materials?: MaterialFormDto[];
  tools?: ToolFormDto[];
}
