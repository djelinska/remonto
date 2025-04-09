import { Types } from 'mongoose';
import { User, UserDto, UserData } from '../../types/models/user.dto';
import { UserTypes } from '../../types/enums/user-types';

const mockObjectId = new Types.ObjectId('507f1f77bcf86cd799439011');

export const mockUserDto: UserDto = {
  _id: mockObjectId,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: '$2a$10$hashedpassword',
  type: UserTypes.USER,
};

export const mockUser: User = {
  id: mockObjectId,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  type: UserTypes.USER,
};

export const mockUserData: UserData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: '$2a$10$hashedpassword',
};

export const mockAdminUser: User = {
  ...mockUser,
  type: UserTypes.ADMIN,
};

export const mockInvalidUser = {
  firstName: 'Invalid',
  email: 'not-an-email',
};

export const getMockUser = (overrides: Partial<User> = {}): User => ({
  ...mockUser,
  ...overrides,
});

export const getMockUserDto = (overrides: Partial<UserDto> = {}): UserDto => ({
  ...mockUserDto,
  ...overrides,
});

export const getMockUserData = (overrides: Partial<UserData> = {}): UserData => ({
  ...mockUserData,
  ...overrides,
});

export const validUserRegistrationData: UserData = {
  ...mockUserData,
  password: 'StrongPass123!', 
};

export const invalidPasswordUserData: UserData = {
  ...mockUserData,
  password: 'weak' 
};

export const emptyUserData: Partial<UserData> = {
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  password: undefined
};

export const getMockRegisterRequest = (overrides: Partial<UserData> = {}) => ({
  body: { ...validUserRegistrationData, ...overrides }
});

export const mockValidationError = (errors: Record<string, { message: string }>) => ({
  name: 'ValidationError',
  errors
});

export const emptyUserDataForValidation: UserData = {
  firstName: '', 
  lastName: '',
  email: '',
  password: ''
};