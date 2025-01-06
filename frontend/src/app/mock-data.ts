import { Material } from './shared/models/material.model';
import { Project } from './shared/models/project.model';
import { Task } from './shared/models/task.model';
import { TaskCategory } from './shared/enums/task-category';
import { TaskPriority } from './shared/enums/task-priority';
import { TaskStatus } from './shared/enums/task-status';
import { Tool } from './shared/models/tool.model';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Project Alpha',
    description: 'Description for Project Alpha',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    budget: 50000,
  },
  {
    id: 2,
    name: 'Project Beta',
    description: 'Description for Project Beta',
    startDate: '2024-02-01',
    endDate: '2024-11-30',
    budget: 75000,
  },
];

export const MOCK_TASKS: Task[] = [
  {
    id: 1,
    name: 'Task 1 for Project Alpha',
    description: 'Description for Task 1',
    category: TaskCategory.DESIGN,
    status: TaskStatus.NOT_STARTED,
    startTime: '2024-01-02T08:00:00',
    endTime: '2024-01-15T17:00:00',
    priority: TaskPriority.HIGH,
    cost: 1000,
    note: 'Important task for the start of the project',
    projectId: 1,
  },
  {
    id: 2,
    name: 'Task 2 for Project Beta',
    description: 'Description for Task 2',
    category: TaskCategory.DESIGN,
    status: TaskStatus.COMPLETED,
    startTime: '2024-02-05T09:00:00',
    endTime: '2024-02-10T17:00:00',
    priority: TaskPriority.MEDIUM,
    cost: 500,
    projectId: 2,
  },
];

export const MOCK_MATERIALS: Material[] = [
  {
    id: 1,
    name: 'Concrete',
    imageUrl: 'https://example.com/concrete.jpg',
    status: 'Available',
    cost: 100,
    quantity: 10,
    location: 'Warehouse 1',
    link: 'https://supplier.com/concrete',
    note: 'High-quality concrete for construction',
    projectId: 1,
  },
  {
    id: 2,
    name: 'Bricks',
    imageUrl: 'https://example.com/bricks.jpg',
    status: 'Out of Stock',
    cost: 0.5,
    quantity: 0,
    location: 'Warehouse 2',
    link: 'https://supplier.com/bricks',
    note: '',
    projectId: 2,
  },
];

export const MOCK_TOOLS: Tool[] = [
  {
    id: 1,
    name: 'Hammer',
    imageUrl: 'https://example.com/hammer.jpg',
    status: 'In Use',
    cost: 20,
    quantity: 3,
    location: 'Site 1',
    link: '',
    note: 'Used for initial construction tasks',
    projectId: 1,
  },
  {
    id: 2,
    name: 'Drill',
    imageUrl: 'https://example.com/drill.jpg',
    status: 'Available',
    cost: 150,
    quantity: 5,
    location: 'Warehouse 3',
    link: 'https://supplier.com/drill',
    note: '',
    projectId: 2,
  },
];
