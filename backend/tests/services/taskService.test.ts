import { Types } from 'mongoose';
import ProjectModel from '../../models/projectModel';
import TaskModel from '../../models/taskModel';
import * as taskService from '../../services/taskService';
import { 
  validTaskData, 
  mockTaskId,
} from '../mockData/mockTask';
import { mockProjectId} from '../mockData/mockProject';
import { mockUser } from '../mockData/mockUser';
import { TaskStatus } from '../../types/enums/task-status';

jest.mock('../../models/projectModel');
jest.mock('../../models/taskModel');

describe('Task Service', () => {
  const mockUserId = new Types.ObjectId(mockUser.id);
  const mockProjectObjectId = new Types.ObjectId(mockProjectId);
  const mockTaskObjectId = new Types.ObjectId(mockTaskId);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProjectTasks', () => {
    it('should fetch tasks for a project successfully', async () => {
      const mockTasks = [
        {
          _id: mockTaskObjectId,
          projectId: mockProjectObjectId,
          name: 'Task 1',
          category: 'DESIGN',
          status: 'NOT_STARTED',
          priority: 'MEDIUM',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-02'),
          allDay: false,
          cost: 100,
          note: 'Test note',
          toObject: jest.fn().mockReturnThis()
        }
      ];

      (ProjectModel.findOne as jest.Mock).mockResolvedValue({ _id: mockProjectObjectId });
      (TaskModel.find as jest.Mock).mockResolvedValue(mockTasks);

      const result = await taskService.fetchProjectTasks(mockUserId, mockProjectObjectId);

      expect(ProjectModel.findOne).toHaveBeenCalledWith({
        userId: mockUserId,
        _id: mockProjectObjectId
      });
      expect(TaskModel.find).toHaveBeenCalledWith({ projectId: mockProjectObjectId });
      expect(result).toEqual([
        {
          id: mockTaskObjectId,
          projectId: mockProjectObjectId,
          name: 'Task 1',
          category: 'DESIGN',
          status: 'NOT_STARTED',
          priority: 'MEDIUM',
          startDate: new Date('2023-01-01'),
          endDate: new Date('2023-01-02'),
          allDay: false,
          cost: 100,
          note: 'Test note'
        }
      ]);
    });

    it('should throw an error when project is not found', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.fetchProjectTasks(mockUserId, mockProjectObjectId)
      ).rejects.toThrow("Project not found or you don't have permission to view it.");
    });

    it('should throw an error when fetching tasks fails', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue({ _id: mockProjectObjectId });
      (TaskModel.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(
        taskService.fetchProjectTasks(mockUserId, mockProjectObjectId)
      ).rejects.toThrow('Database error');
    });
  });

  describe('fetchProjectTaskById', () => {
    it('should fetch a task by ID successfully', async () => {
      const mockTask = {
        _id: mockTaskObjectId,
        projectId: mockProjectObjectId,
        name: 'Task 1',
        category: 'DESIGN',
        status: 'NOT_STARTED',
        priority: 'MEDIUM',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-02'),
        allDay: false,
        cost: 100,
        note: 'Test note',
        toObject: jest.fn().mockReturnThis()
      };

      (ProjectModel.findOne as jest.Mock).mockResolvedValue({ _id: mockProjectObjectId });
      (TaskModel.findOne as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.fetchProjectTaskById(
        mockUserId, 
        mockProjectObjectId, 
        mockTaskObjectId
      );

      expect(ProjectModel.findOne).toHaveBeenCalledWith({
        userId: mockUserId,
        _id: mockProjectObjectId
      });
      expect(TaskModel.findOne).toHaveBeenCalledWith({
        _id: mockTaskObjectId,
        projectId: mockProjectObjectId
      });
      expect(result).toEqual({
        id: mockTaskObjectId,
        projectId: mockProjectObjectId,
        name: 'Task 1',
        category: 'DESIGN',
        status: 'NOT_STARTED',
        priority: 'MEDIUM',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-01-02'),
        allDay: false,
        cost: 100,
        note: 'Test note'
      });
    });

    it('should throw an error when project is not found', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.fetchProjectTaskById(mockUserId, mockProjectObjectId, mockTaskObjectId)
      ).rejects.toThrow("Project not found or you don't have permission to view it.");
    });

    it('should throw an error when task is not found', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue({ _id: mockProjectObjectId });
      (TaskModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.fetchProjectTaskById(mockUserId, mockProjectObjectId, mockTaskObjectId)
      ).rejects.toThrow('Task not found.');
    });
  });

  describe('createProjectTask', () => {
    it('should create a new task successfully', async () => {
      const mockTask = {
        _id: mockTaskObjectId,
        ...validTaskData,
        save: jest.fn().mockResolvedValue(undefined),
        toObject: jest.fn().mockReturnThis()
      };

      (ProjectModel.findOne as jest.Mock).mockResolvedValue({ _id: mockProjectObjectId });
      (TaskModel as jest.MockedClass<any>).mockImplementation(() => mockTask);

      const result = await taskService.createProjectTask(
        mockUserId, 
        mockProjectObjectId, 
        validTaskData
      );

      expect(ProjectModel.findOne).toHaveBeenCalledWith({
        userId: mockUserId,
        _id: mockProjectObjectId
      });
      expect(TaskModel).toHaveBeenCalledWith({
        ...validTaskData,
        projectId: mockProjectObjectId
      });
      expect(mockTask.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockTaskObjectId,
        projectId: mockProjectObjectId,
        name: validTaskData.name,
        category: validTaskData.category,
        status: validTaskData.status,
        priority: validTaskData.priority,
        startDate: validTaskData.startDate,
        endDate: validTaskData.endDate,
        allDay: validTaskData.allDay,
        cost: validTaskData.cost,
        note: validTaskData.note
      });
    });

    it('should throw an error when project is not found', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.createProjectTask(mockUserId, mockProjectObjectId, validTaskData)
      ).rejects.toThrow("Project not found or you don't have permission to add tasks.");
    });

    it('should throw an error when task creation fails', async () => {
      const mockTask = {
        _id: mockTaskObjectId,
        ...validTaskData,
        save: jest.fn().mockRejectedValue(new Error('Validation error')),
        toObject: jest.fn().mockReturnThis()
      };

      (ProjectModel.findOne as jest.Mock).mockResolvedValue({ _id: mockProjectObjectId });
      (TaskModel as jest.MockedClass<any>).mockImplementation(() => mockTask);

      await expect(
        taskService.createProjectTask(mockUserId, mockProjectObjectId, validTaskData)
      ).rejects.toThrow('Validation error');
    });
  });

  describe('updateProjectTask', () => {
    it('should update a task successfully', async () => {
      const updatedTaskData = {
        ...validTaskData,
        name: 'Updated Task',
        status: TaskStatus.IN_PROGRESS
      };

      const mockTask = {
        _id: mockTaskObjectId,
        ...updatedTaskData,
        toObject: jest.fn().mockReturnThis()
      };

      (ProjectModel.findOne as jest.Mock).mockResolvedValue({ _id: mockProjectObjectId });
      (TaskModel.findOneAndUpdate as jest.Mock).mockResolvedValue(mockTask);

      const result = await taskService.updateProjectTask(
        mockUserId,
        mockProjectObjectId,
        mockTaskObjectId,
        updatedTaskData
      );

      expect(ProjectModel.findOne).toHaveBeenCalledWith({
        userId: mockUserId,
        _id: mockProjectObjectId
      });
      expect(TaskModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: mockTaskObjectId, projectId: mockProjectObjectId },
        updatedTaskData,
        { new: true, runValidators: true }
      );
      expect(result).toEqual({
        id: mockTaskObjectId,
        projectId: mockProjectObjectId,
        name: 'Updated Task',
        category: validTaskData.category,
        status: 'IN_PROGRESS',
        priority: validTaskData.priority,
        startDate: validTaskData.startDate,
        endDate: validTaskData.endDate,
        allDay: validTaskData.allDay,
        cost: validTaskData.cost,
        note: validTaskData.note
      });
    });

    it('should throw an error when project is not found', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.updateProjectTask(
          mockUserId,
          mockProjectObjectId,
          mockTaskObjectId,
          validTaskData
        )
      ).rejects.toThrow("Project not found or you don't have permission to update tasks.");
    });

    it('should throw an error when task is not found', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue({ _id: mockProjectObjectId });
      (TaskModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.updateProjectTask(
          mockUserId,
          mockProjectObjectId,
          mockTaskObjectId,
          validTaskData
        )
      ).rejects.toThrow("Task not found or you don't have permission to update it.");
    });

    it('should throw an error when task update fails', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue({ _id: mockProjectObjectId });
      (TaskModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(
        taskService.updateProjectTask(
          mockUserId,
          mockProjectObjectId,
          mockTaskObjectId,
          validTaskData
        )
      ).rejects.toThrow('Database error');
    });
  });

  describe('deleteProjectTask', () => {
    it('should delete a task successfully', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue({ _id: mockProjectObjectId });
      (TaskModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

      const result = await taskService.deleteProjectTask(
        mockUserId,
        mockProjectObjectId,
        mockTaskObjectId
      );

      expect(ProjectModel.findOne).toHaveBeenCalledWith({
        userId: mockUserId,
        _id: mockProjectObjectId
      });
      expect(TaskModel.deleteOne).toHaveBeenCalledWith({
        _id: mockTaskObjectId,
        projectId: mockProjectObjectId
      });
      expect(result).toEqual({ message: 'Task deleted successfully' });
    });

    it('should throw an error when project is not found', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        taskService.deleteProjectTask(mockUserId, mockProjectObjectId, mockTaskObjectId)
      ).rejects.toThrow("Project not found or you don't have permission to delete tasks.");
    });

    it('should throw an error when task is not found', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue({ _id: mockProjectObjectId });
      (TaskModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 });

      await expect(
        taskService.deleteProjectTask(mockUserId, mockProjectObjectId, mockTaskObjectId)
      ).rejects.toThrow("Task not found or you don't have permission to delete it.");
    });

    it('should throw an error when task deletion fails', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue({ _id: mockProjectObjectId });
      (TaskModel.deleteOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(
        taskService.deleteProjectTask(mockUserId, mockProjectObjectId, mockTaskObjectId)
      ).rejects.toThrow('Database error');
    });
  });
});