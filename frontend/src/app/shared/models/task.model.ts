import { TaskCategory } from '../enums/task-category';
import { TaskPriority } from '../enums/task-priority';
import { TaskStatus } from '../enums/task-status';

export interface Task {
  id: number;
  name: string;
  description?: string;
  category: TaskCategory;
  status: TaskStatus;
  startTime: string;
  endTime: string;
  priority: TaskPriority;
  cost: number;
  note?: string;
  parentTaskId?: number;
  projectId: number;
}
