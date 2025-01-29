import { TaskCategory } from '../../../../shared/enums/task-category';
import { TaskPriority } from '../../../../shared/enums/task-priority';
import { TaskStatus } from '../../../../shared/enums/task-status';

export interface TaskFormDto {
  name: string;
  category: TaskCategory;
  status: TaskStatus;
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  priority: TaskPriority;
  cost: number;
  note?: string;
}
