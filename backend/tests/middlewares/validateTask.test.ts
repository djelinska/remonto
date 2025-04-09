import { NextFunction, Response } from 'express';
import validateTaskData from '../../middlewares/validateTask';
import TaskModel from '../../models/taskModel';
import { PostTaskRequest } from '../../types/models/taskRequest.dto';
import { TaskData } from '../../types/models/task.dto';
import {
  validTaskData,
  invalidTaskData,
  emptyTaskData,
  mockValidationError,
  getMockTaskRequest
} from '../mockData/mockTask';
import { checkStartAndEndDate } from '../../utils/validation';

jest.mock('../../models/taskModel');
jest.mock('../../utils/validation');

describe('validateTaskData middleware', () => {
  let mockRequest: Partial<PostTaskRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = getMockTaskRequest();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    nextFunction = jest.fn();
    
    (checkStartAndEndDate as jest.Mock).mockReturnValue(true);
  });

  it('should call next() when task data is valid', async () => {
    (TaskModel.prototype.validate as jest.Mock).mockResolvedValue(undefined);

    await validateTaskData(
      mockRequest as PostTaskRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(TaskModel.prototype.validate).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should handle missing required fields', async () => {
    const error = mockValidationError({
      name: { message: 'Name is required' },
      category: { message: 'Category is required' },
      status: { message: 'Status is required' },
      priority: { message: 'Priority is required' },
      cost: { message: 'Cost is required' }
    });
    (TaskModel.prototype.validate as jest.Mock).mockRejectedValue(error);

    mockRequest.body = emptyTaskData as TaskData;

    await validateTaskData(
      mockRequest as PostTaskRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: expect.arrayContaining([
        'Name is required',
        'Category is required',
        'Status is required',
        'Priority is required',
        'Cost is required'
      ])
    });
  });

  it('should return 400 when dates are invalid', async () => {
    (checkStartAndEndDate as jest.Mock).mockReturnValue(false);
    mockRequest.body = {
      ...validTaskData,
      startDate: new Date('2023-01-02'),
      endDate: new Date('2023-01-01')
    };

    await validateTaskData(
      mockRequest as PostTaskRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Date validation error',
      details: ['Start date cannot be after end date']
    });
    });

  it('should handle missing projectId', async () => {
    const requestWithoutProjectId = {
      ...mockRequest,
      params: {} 
    };

    await validateTaskData(
      requestWithoutProjectId as PostTaskRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Validation error",
      details: ["Project ID is required"]
    });
    expect(nextFunction).not.toHaveBeenCalled();
    });

  it('should validate enum fields', async () => {
    const error = mockValidationError({
      category: { message: 'Invalid task category' },
      status: { message: 'Invalid task status' },
      priority: { message: 'Invalid priority level' }
    });
    (TaskModel.prototype.validate as jest.Mock).mockRejectedValue(error);

    mockRequest.body = invalidTaskData as TaskData;

    await validateTaskData(
      mockRequest as PostTaskRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: expect.arrayContaining([
        'Invalid task category',
        'Invalid task status',
        'Invalid priority level'
      ])
    });
  });

  it('should pass through non-validation errors', async () => {
    const mockError = new Error('Database error');
    (TaskModel.prototype.validate as jest.Mock).mockRejectedValue(mockError);

    await validateTaskData(
      mockRequest as PostTaskRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should validate optional fields when provided', async () => {
    const taskWithOptionalFields = {
      ...validTaskData,
      note: 'Additional test note'
    };
    (TaskModel.prototype.validate as jest.Mock).mockResolvedValue(undefined);

    mockRequest.body = taskWithOptionalFields;

    await validateTaskData(
      mockRequest as PostTaskRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(TaskModel.prototype.validate).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
  });
});