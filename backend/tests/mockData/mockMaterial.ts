import { Types } from 'mongoose';
import { MaterialUnit } from '../../types/enums/material-unit';
import { MaterialData } from '../../types/models/material.dto';
import { ElementStatus } from '../../types/enums/element-status';

export const mockProjectId = new Types.ObjectId().toString();

export const validMaterialData: MaterialData = {
  status: ElementStatus.AVAILABLE,
  name: 'Test Material',
  allDay: false,
  cost: 100,
  quantity: 10,
  unit: MaterialUnit.KILOGRAM
};

export const invalidMaterialData: MaterialData = {
  ...validMaterialData, 
  status: 'undefined' as unknown as ElementStatus, 
  name: '',
  quantity: -5,
  unit: 'invalid-unit' as MaterialUnit,
};

export const emptyMaterialData: MaterialData = {
  status: undefined as unknown as ElementStatus,
  name: '',
  allDay: false,
  cost: 0,
  quantity: 0,
  unit: MaterialUnit.KILOGRAM
};

export const mockValidationError = (errors: Record<string, { message: string }>) => ({
  name: 'ValidationError',
  errors,
});

export const getMockMaterialRequest = (overrides: Partial<MaterialData> = {}) => ({
  params: { projectId: mockProjectId },
  body: { ...validMaterialData, ...overrides },
});