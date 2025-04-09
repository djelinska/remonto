import { Types } from 'mongoose';
import { ToolData } from '../../types/models/tool.dto';
import { mockProjectId } from './mockProject';
import { ElementStatus } from '../../types/enums/element-status';

export const mockToolId = new Types.ObjectId().toString();

export const validToolData: ToolData = {
  name: 'Test Tool',
  status: ElementStatus.AVAILABLE,
  allDay: false, 
  quantity: 5,
  cost: 100,
  projectId: new Types.ObjectId(mockProjectId)
};

export const invalidToolData: Partial<ToolData> = {
  name: '', 
  status: 'invalid-status' as ElementStatus, 
  allDay: undefined, 
  quantity: -5, 
  cost: -100, 
  projectId: new Types.ObjectId(mockProjectId)
};

export const emptyToolData: Partial<ToolData> = {
  name: undefined,
  status: undefined,
  allDay: undefined,
  quantity: undefined,
  cost: undefined,
  projectId: undefined
};

export const mockValidationError = (errors: Record<string, { message: string }>) => ({
  name: 'ValidationError',
  errors
});

export const getMockToolRequest = (overrides: Partial<ToolData> = {}) => ({
  params: { projectId: mockProjectId },
  body: { ...validToolData, ...overrides }
});