import mongoose, { Types } from 'mongoose';
import TemplateModel from '../../models/templateModel';
import * as service from '../../services/templateService';
import { TemplateFormDto } from '../../types/models/template.dto';
import ReturnMessage from '../../types/models/returnMessage.model';

jest.mock('../../models/templateModel');
const mockTemplateModel = TemplateModel as jest.Mocked<typeof TemplateModel>;

describe('Template Service', () => {
  const fakeId = new Types.ObjectId();
  const fakeTemplate = {
  _id: fakeId,
  project: { 
    name: 'Test Project',
    description: undefined,
    budget: undefined,
    userId: new Types.ObjectId(), 
    startDate: new Date(),        
    imageUrls: [],
    notes: []
  },
  tasks: [],
  materials: [],
  tools: []
} as unknown as TemplateFormDto;

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('fetchTemplates', () => {
    it('returns list of templates with complete structure when templates exist', async () => {
    mockTemplateModel.find.mockResolvedValue([fakeTemplate]);
    const list = await service.fetchTemplates();
    
    expect(list).toEqual([{
      id: fakeId,
      project: {
        name: 'Test Project',
        description: undefined,
        budget: undefined
      },
      tasks: [],
      materials: [],
      tools: [],
      taskCount: 0,
      materialCount: 0,
      toolCount: 0
    }]);
    expect(mockTemplateModel.find).toHaveBeenCalledTimes(1);
  });

    it('throws on model error', async () => {
      mockTemplateModel.find.mockRejectedValue(new Error('DB fail'));
      await expect(service.fetchTemplates()).rejects.toThrow('Error fetching templates');
    });
  });

  describe('fetchTemplateById', () => {
    it('returns a template when found', async () => {
      mockTemplateModel.findById.mockResolvedValue(fakeTemplate);
      const tpl = await service.fetchTemplateById(fakeId);
      
      expect(tpl).toEqual({
        id: fakeId,
        project: {
          name: 'Test Project',
          description: undefined,
          budget: undefined
        },
        tasks: [],
        materials: [],
        tools: []
      });
      expect(mockTemplateModel.findById).toHaveBeenCalledWith(fakeId);
    });

    it('throws when not found', async () => {
      mockTemplateModel.findById.mockResolvedValue(null);
      await expect(service.fetchTemplateById(fakeId)).rejects.toThrow('Error fetching template');
    });

    it('throws on model error', async () => {
      mockTemplateModel.findById.mockRejectedValue(new Error('DB fail'));
      await expect(service.fetchTemplateById(fakeId)).rejects.toThrow('Error fetching template');
    });
  });

  describe('createTemplate', () => {
    it('saves and returns the new template', async () => {
      const mockInstance = {
        save: jest.fn().mockResolvedValue(undefined),
        ...fakeTemplate
      };
      // @ts-ignore override constructor
      mockTemplateModel.mockImplementation(() => mockInstance);
      const result = await service.createTemplate(fakeTemplate);
      expect(mockInstance.save).toHaveBeenCalled();
      expect(result).toBe(mockInstance);
    });

    it('throws on save error', async () => {
      const mockInstance = {
        save: jest.fn().mockRejectedValue(new Error('fail')),
      };
      // @ts-ignore
      mockTemplateModel.mockImplementation(() => mockInstance);
      await expect(service.createTemplate(fakeTemplate)).rejects.toThrow('Error creating template');
    });
  });

  describe('updateTemplate', () => {
    it('updates and returns when found', async () => {
      const updated = { ...fakeTemplate, project: { name: 'Updated' } };
      mockTemplateModel.findByIdAndUpdate.mockResolvedValue(updated as any);
      const result = await service.updateTemplate(fakeId, updated as any);
      expect(result).toBe(updated);
      expect(mockTemplateModel.findByIdAndUpdate).toHaveBeenCalledWith(
        fakeId,
        { $set: updated },
        { new: true, runValidators: true }
      );
    });

    it('throws when not found', async () => {
      mockTemplateModel.findByIdAndUpdate.mockResolvedValue(null);
      await expect(service.updateTemplate(fakeId, fakeTemplate)).rejects.toThrow('Error updating template');
    });

    it('throws on model error', async () => {
      mockTemplateModel.findByIdAndUpdate.mockRejectedValue(new Error('fail'));
      await expect(service.updateTemplate(fakeId, fakeTemplate)).rejects.toThrow('Error updating template');
    });
  });

  describe('deleteTemplate', () => {
    it('deletes and returns message when found', async () => {
      mockTemplateModel.findByIdAndDelete.mockResolvedValue(fakeTemplate as any);
      const res: ReturnMessage = await service.deleteTemplate(fakeId);
      expect(res).toEqual({ message: 'Template deleted successfully' });
      expect(mockTemplateModel.findByIdAndDelete).toHaveBeenCalledWith(fakeId);
    });

    it('throws when not found', async () => {
      mockTemplateModel.findByIdAndDelete.mockResolvedValue(null);
      await expect(service.deleteTemplate(fakeId)).rejects.toThrow('Error deleting template');
    });

    it('throws on model error', async () => {
      mockTemplateModel.findByIdAndDelete.mockRejectedValue(new Error('fail'));
      await expect(service.deleteTemplate(fakeId)).rejects.toThrow('Error deleting template');
    });
  });
});