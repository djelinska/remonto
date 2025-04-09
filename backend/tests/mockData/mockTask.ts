import { TaskCategory } from '../../types/enums/task-category';
import { TaskPriority } from '../../types/enums/task-priority';
import { TaskStatus } from '../../types/enums/task-status';
import { Types } from 'mongoose';
import { TaskData } from '../../types/models/task.dto';
import { mockProjectId } from './mockProject';
import { mockUser } from './mockUser';

export const mockTaskId = new Types.ObjectId().toString();

export const validTaskData: TaskData = {
  projectId: new Types.ObjectId(mockProjectId),
  name: 'Test Task',
  category: TaskCategory.DESIGN,
  status: TaskStatus.NOT_STARTED,
  startDate: new Date('2023-01-01'),
  endDate: new Date('2023-01-02'),
  allDay: false,
  priority: TaskPriority.MEDIUM,
  cost: 100,
  note: 'Test note'
};

export const invalidTaskData: Partial<TaskData> = {
  projectId: new Types.ObjectId(mockProjectId), 
  name: '', 
  category: 'InvalidCategory' as TaskCategory, 
  status: 'InvalidStatus' as TaskStatus, 
  startDate: new Date('2023-01-03'),
  endDate: new Date('2023-01-02'),
  priority: 'InvalidPriority' as TaskPriority, 
  cost: -100 
};

export const emptyTaskData: Partial<TaskData> = {
  projectId: undefined,
  name: undefined,
  category: undefined,
  status: undefined,
  allDay: undefined,
  priority: undefined,
  cost: undefined
};

export const mockValidationError = (errors: Record<string, { message: string }>) => ({
  name: 'ValidationError',
  errors
});

export const getMockTaskRequest = (overrides: Partial<TaskData> = {}) => ({
  user: mockUser,
  params: { projectId: mockProjectId },
  body: { ...validTaskData, ...overrides }
});