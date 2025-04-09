import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import authenticateUser from '../../middlewares/authenticateUser';
import AuthRequest from '../../types/models/authRequest.dto';
import { mockUser, mockAdminUser } from '../mockData/mockUser';

jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}));

process.env.SECRETKEY = 'test-secret-key';

describe('authenticateUser middleware', () => {
  let mockRequest: Partial<AuthRequest>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      headers: {},
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    nextFunction = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 401 if authorization header is missing', () => {
    authenticateUser(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Authorization header is missing',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if token is missing in authorization header', () => {
    mockRequest.headers = {
      authorization: 'Bearer',
    };

    authenticateUser(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Authentication token is missing',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid or expired', () => {
    mockRequest.headers = {
      authorization: 'Bearer invalid-token',
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticateUser(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(jwt.verify).toHaveBeenCalledWith(
      'invalid-token',
      process.env.SECRETKEY
    );
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid or expired token',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should attach regular user to request and call next() with valid token', () => {
    const validToken = 'valid-token';
    mockRequest.headers = {
      authorization: `Bearer ${validToken}`,
    };

    (jwt.verify as jest.Mock).mockReturnValue(mockUser);

    authenticateUser(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(jwt.verify).toHaveBeenCalledWith(
      validToken,
      process.env.SECRETKEY
    );
    expect(mockRequest.user).toEqual(mockUser);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should attach admin user to request and call next() with valid token', () => {
    const validToken = 'valid-admin-token';
    mockRequest.headers = {
      authorization: `Bearer ${validToken}`,
    };

    (jwt.verify as jest.Mock).mockReturnValue(mockAdminUser);

    authenticateUser(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(jwt.verify).toHaveBeenCalledWith(
      validToken,
      process.env.SECRETKEY
    );
    expect(mockRequest.user).toEqual(mockAdminUser);
    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
    expect(mockResponse.json).not.toHaveBeenCalled();
  });

  it('should handle unexpected errors', () => {
    mockRequest.headers = {
      authorization: 'Bearer valid-token',
    };

    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    authenticateUser(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid or expired token',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 for malformed authorization header', () => {
    mockRequest.headers = {
      authorization: 'InvalidFormat',
    };

    authenticateUser(
      mockRequest as AuthRequest,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Authentication token is missing',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});