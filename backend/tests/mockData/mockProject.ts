import { Types } from 'mongoose';
import { ProjectData } from '../../types/models/project.dto';
import { mockUser } from './mockUser';

export const mockProjectId = new Types.ObjectId().toString();
export const mockUserId = mockUser.id;

export const validProjectData: ProjectData = {
  name: 'Test Project',
  description: 'Test Description',
  startDate: new Date(),
  budget: 10000,
};

export const invalidProjectData: ProjectData = {
  name: '', 
  description: 'Test Description',
  startDate: new Date('invalid-date'),
  budget: -100,
};

export const emptyProjectData: Partial<ProjectData> = {
  name: undefined,
  startDate: undefined,
  budget: undefined,
};

export const mockValidationError = (errors: Record<string, { message: string }>) => ({
  name: 'ValidationError',
  errors,
});

export const getMockProjectRequest = (overrides: Partial<ProjectData> = {}) => ({
  user: mockUser,
  body: { ...validProjectData, ...overrides },
});