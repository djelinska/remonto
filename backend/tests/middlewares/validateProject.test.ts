import { NextFunction, Response } from 'express';
import validateProjectData from '../../middlewares/validateProject';
import ProjectModel from '../../models/projectModel';
import { PostProjectRequest } from '../../types/models/projectRequest.dto';
import { ProjectData } from '../../types/models/project.dto';

import {
  validProjectData,
  invalidProjectData,
  emptyProjectData,
  mockValidationError,
  getMockProjectRequest,
  mockUserId,
} from '../mockData/mockProject';

jest.mock('../../models/projectModel');

describe('validateProjectData middleware', () => {
  let mockRequest: Partial<PostProjectRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = getMockProjectRequest();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() when project data is valid', async () => {
    (ProjectModel.prototype.validate as jest.Mock).mockResolvedValue(undefined);

    await validateProjectData(
      mockRequest as PostProjectRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(ProjectModel.prototype.validate).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should handle all missing required fields', async () => {
    const error = mockValidationError({
      name: { message: 'Name is required' },
      startDate: { message: 'Start date is required' },
      budget: { message: 'Budget is required' },
    });
    (ProjectModel.prototype.validate as jest.Mock).mockRejectedValue(error);

    mockRequest.body = emptyProjectData as ProjectData;

    await validateProjectData(
      mockRequest as PostProjectRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: expect.arrayContaining([
        'Name is required',
        'Start date is required',
        'Budget is required',
      ]),
    });
  });

  it('should return 400 with validation errors when data is invalid', async () => {
    const error = mockValidationError({
      name: { message: 'Name cannot be empty' },
      startDate: { message: 'Invalid start date' },
      budget: { message: 'Budget must be positive' },
    });
    (ProjectModel.prototype.validate as jest.Mock).mockRejectedValue(error);

    mockRequest.body = invalidProjectData;

    await validateProjectData(
      mockRequest as PostProjectRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: expect.arrayContaining([
        'Name cannot be empty',
        'Invalid start date',
        'Budget must be positive',
      ]),
    });
  });

  it('should include userId from request.user in project data', async () => {
    (ProjectModel.prototype.validate as jest.Mock).mockResolvedValue(undefined);

    await validateProjectData(
      mockRequest as PostProjectRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(ProjectModel).toHaveBeenCalledWith(expect.objectContaining({
      userId: mockUserId
    }));
  });

  it('should handle missing user ID', async () => {
    delete mockRequest.user;

    await validateProjectData(
      mockRequest as PostProjectRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: ['User ID is required'],
    });
  });

  it('should pass through non-validation errors', async () => {
    const mockError = new Error('Database error');
    (ProjectModel.prototype.validate as jest.Mock).mockRejectedValue(mockError);

    await validateProjectData(
      mockRequest as PostProjectRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should validate optional fields when provided', async () => {
    const projectWithOptionalFields = {
      ...validProjectData,
      description: 'Test description',
      endDate: new Date(),
      imageUrls: ['image1.jpg', 'image2.png'],
    };
    (ProjectModel.prototype.validate as jest.Mock).mockResolvedValue(undefined);

    mockRequest.body = projectWithOptionalFields;

    await validateProjectData(
      mockRequest as PostProjectRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(ProjectModel.prototype.validate).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
  });
});