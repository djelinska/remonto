import { TaskCategory } from '../../../../shared/enums/task-category';
import { TaskPriority } from '../../../../shared/enums/task-priority';
import { TaskStatus } from '../../../../shared/enums/task-status';

export interface TaskRequest {
  name: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  startTime?: string;
  endTime?: string;
  priority: TaskPriority;
  cost?: number;
  note?: string;
}
