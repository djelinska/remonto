import { TaskCategory } from '../enums/task-category';
import { TaskPriority } from '../enums/task-priority';
import { TaskStatus } from '../enums/task-status';

export interface TaskDto {
  id: string;
  name: string;
  category: TaskCategory;
  status: TaskStatus;
  startDate?: string;
  endDate?: string;
  allDay: boolean;
  priority: TaskPriority;
  cost: number;
  note?: string;
}
