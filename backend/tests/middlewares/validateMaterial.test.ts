import { NextFunction, Response } from 'express';
import validateMaterialData from '../../middlewares/validateMaterial';
import MaterialModel from '../../models/materialModel';
import { PostMaterialRequest } from '../../types/models/materialRequest.dto';
import { MaterialUnit } from '../../types/enums/material-unit';
import {
  validMaterialData,
  invalidMaterialData,
  emptyMaterialData,
  mockValidationError,
  getMockMaterialRequest,
} from '../mockData/mockMaterial';

jest.mock('../../models/materialModel');

describe('validateMaterialData middleware', () => {
  let mockRequest: Partial<PostMaterialRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = getMockMaterialRequest();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  it('should call next() when material data is valid', async () => {
    (MaterialModel.prototype.validate as jest.Mock).mockResolvedValue(undefined);

    await validateMaterialData(
      mockRequest as PostMaterialRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(MaterialModel.prototype.validate).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should handle all missing required fields', async () => {
    const error = mockValidationError({
      status: { message: 'Status is required' },
      name: { message: 'Name is required' },
      allDay: { message: 'AllDay is required' },
      cost: { message: 'Cost is required' },
      quantity: { message: 'Quantity is required' },
      unit: { message: 'Unit is required' },
      unitPrice: { message: 'Unit price is required' },
    });
    (MaterialModel.prototype.validate as jest.Mock).mockRejectedValue(error);

    mockRequest.body = emptyMaterialData;

    await validateMaterialData(
      mockRequest as PostMaterialRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: expect.arrayContaining([
        'Status is required',
        'Name is required',
        'AllDay is required',
        'Cost is required',
        'Quantity is required',
        'Unit is required',
        'Unit price is required',
      ]),
    });
  });

  it('should return 400 with validation errors when data is invalid', async () => {
    const error = mockValidationError({
      name: { message: 'Name is required' },
      quantity: { message: 'Quantity must be positive' },
    });
    (MaterialModel.prototype.validate as jest.Mock).mockRejectedValue(error);

    mockRequest.body = invalidMaterialData;

    await validateMaterialData(
      mockRequest as PostMaterialRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: ['Name is required', 'Quantity must be positive'],
    });
  });

  it('should handle missing projectId', async () => {
    const requestWithoutProjectId = {
        ...mockRequest,
        params: {} 
    };

    await validateMaterialData(
        requestWithoutProjectId as PostMaterialRequest,
        mockResponse as Response,
        nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Validation error',
        details: ['Project ID is required'], 
    });
    expect(nextFunction).not.toHaveBeenCalled(); 
});

  it('should handle invalid projectId format', async () => {
    mockRequest.params!.projectId = 'invalid-id';

    await validateMaterialData(
      mockRequest as PostMaterialRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: expect.arrayContaining(['Invalid project ID']),
    });
  });

  it('should pass through non-validation errors', async () => {
    const mockError = new Error('Database error');
    (MaterialModel.prototype.validate as jest.Mock).mockRejectedValue(mockError);

    await validateMaterialData(
      mockRequest as PostMaterialRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should validate MaterialUnit enum values', async () => {
    const error = mockValidationError({
      unit: { message: 'Invalid material unit' },
    });
    (MaterialModel.prototype.validate as jest.Mock).mockRejectedValue(error);

    mockRequest.body = { ...validMaterialData, unit: 'invalid-unit' as MaterialUnit };

    await validateMaterialData(
      mockRequest as PostMaterialRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: ['Invalid material unit'],
    });
  });
});