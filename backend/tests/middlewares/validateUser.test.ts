import { NextFunction, Response } from 'express';
import validateUserData from '../../middlewares/validateUser';
import UserModel from '../../models/userModel';
import { RegisterRequest } from '../../types/models/authRequest.dto';
import {
  validUserRegistrationData,
  invalidPasswordUserData,
  emptyUserDataForValidation,
  mockValidationError,
  getMockRegisterRequest
} from '../mockData/mockUser';
import { checkPassword } from '../../utils/validation';

jest.mock('../../models/userModel');
jest.mock('../../utils/validation');

describe('validateUserData middleware', () => {
  let mockRequest: Partial<RegisterRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = getMockRegisterRequest();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
    
    (checkPassword as jest.Mock).mockReturnValue(true);
  });

  it('should call next() when user data is valid', async () => {
    (UserModel.prototype.validate as jest.Mock).mockResolvedValue(undefined);

    await validateUserData(
      mockRequest as RegisterRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(UserModel.prototype.validate).toHaveBeenCalled();
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should handle all missing required fields', async () => {
    const error = mockValidationError({
      firstName: { message: 'First name is required' },
      lastName: { message: 'Last name is required' },
      email: { message: 'Email is required' },
      password: { message: 'Password is required' }
    });
    (UserModel.prototype.validate as jest.Mock).mockRejectedValue(error);

    mockRequest.body = emptyUserDataForValidation;

    await validateUserData(
      mockRequest as RegisterRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: expect.arrayContaining([
        'First name is required',
        'Last name is required',
        'Email is required',
        'Password is required'
      ]),
    });
    });

  it('should return 400 when password is invalid', async () => {
    (checkPassword as jest.Mock).mockReturnValue(false);
    mockRequest.body = invalidPasswordUserData;

    await validateUserData(
      mockRequest as RegisterRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Password validation error (password not strong enough)',
      details: 'PasswordValidationError'
    });
  });

  it('should validate email format', async () => {
    const error = mockValidationError({
      email: { message: 'Invalid email format' }
    });
    (UserModel.prototype.validate as jest.Mock).mockRejectedValue(error);

    mockRequest.body = {
      ...validUserRegistrationData,
      email: 'invalid-email'
    };

    await validateUserData(
      mockRequest as RegisterRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Validation error',
      details: ['Invalid email format'],
    });
  });

  it('should pass through non-validation errors', async () => {
    const mockError = new Error('Database error');
    (UserModel.prototype.validate as jest.Mock).mockRejectedValue(mockError);

    await validateUserData(
      mockRequest as RegisterRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(nextFunction).toHaveBeenCalledWith(mockError);
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it('should validate password meets complexity requirements', async () => {
    const weakPasswords = [
        'short',
        'nouppercase123',
        'NoNumbersHere',
        'ALLUPPERCASE123'
    ];
    
    for (const password of weakPasswords) {
        (checkPassword as jest.Mock).mockReturnValue(false);
        mockRequest.body = { ...validUserRegistrationData, password };
        
        await validateUserData(
            mockRequest as RegisterRequest,
            mockResponse as Response,
            nextFunction
        );
        
        expect(mockResponse.status).toHaveBeenCalledWith(400);
    }
});
});