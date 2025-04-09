import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import validateToolData from '../../middlewares/validateTool';
import ToolModel from '../../models/toolModel';
import {
  validToolData,
  invalidToolData,
  emptyToolData,
  mockValidationError,
  getMockToolRequest,
} from '../mockData/mockTool';

jest.mock('../../models/toolModel');

describe('validateToolData middleware', () => {
  let mockRequest: any;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = getMockToolRequest();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() when tool data is valid', async () => {
    (ToolModel.prototype.validate as jest.Mock).mockResolvedValue(undefined);

    await validateToolData(
      mockRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(ToolModel.prototype.validate).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should handle all missing required fields', async () => {
    const error = mockValidationError({
      name: { message: 'Name is required' },
      quantity: { message: 'Quantity is required' },
      cost: { message: 'Cost is required' },
      projectId: { message: 'Project ID is required' }
    });
    (ToolModel.prototype.validate as jest.Mock).mockRejectedValue(error);

    mockRequest.body = emptyToolData;

    await validateToolData(
      mockRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: expect.arrayContaining([
        'Name is required',
        'Quantity is required',
        'Cost is required',
        'Project ID is required'
      ]),
    });
  });

  it('should return 400 with validation errors when data is invalid', async () => {
    const error = mockValidationError({
      name: { message: 'Name cannot be empty' },
      quantity: { message: 'Quantity must be positive' },
      cost: { message: 'Cost must be positive' }
    });
    (ToolModel.prototype.validate as jest.Mock).mockRejectedValue(error);

    mockRequest.body = invalidToolData;

    await validateToolData(
      mockRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: expect.arrayContaining([
        'Name cannot be empty',
        'Quantity must be positive',
        'Cost must be positive'
      ]),
    });
  });

  it('should handle invalid projectId format', async () => {
    const requestWithInvalidProjectId = {
      ...mockRequest,
      params: { projectId: 'invalid-id' }
    };

    await validateToolData(
      requestWithInvalidProjectId,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid projectId format'
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should include projectId in tool data', async () => {
    (ToolModel.prototype.validate as jest.Mock).mockResolvedValue(undefined);

    await validateToolData(
      mockRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(ToolModel).toHaveBeenCalledWith(expect.objectContaining({
      projectId: expect.any(mongoose.Types.ObjectId)
    }));
  });

  it('should pass through non-validation errors', async () => {
    const mockError = new Error('Database error');
    (ToolModel.prototype.validate as jest.Mock).mockRejectedValue(mockError);

    await validateToolData(
      mockRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should validate optional fields when provided', async () => {
    const toolWithOptionalFields = {
      ...validToolData,
      description: 'Extended description'
    };
    (ToolModel.prototype.validate as jest.Mock).mockResolvedValue(undefined);

    mockRequest.body = toolWithOptionalFields;

    await validateToolData(
      mockRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(ToolModel.prototype.validate).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
  });
});