import { Types } from 'mongoose';
import MaterialModel from '../../models/materialModel';
import * as materialService from '../../services/materialService';
import { 
  validMaterialData,
  mockProjectId,
} from '../mockData/mockMaterial';
import { deleteFileByUrl } from '../../utils/fileUtils';

jest.mock('../../models/materialModel');
jest.mock('../../utils/fileUtils');

describe('materialService', () => {
  const mockMaterialId = new Types.ObjectId();
  const mockMaterialDto = {
    _id: mockMaterialId,
    projectId: new Types.ObjectId(mockProjectId),
    ...validMaterialData,
    cost: validMaterialData.cost,
    save: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProjectMaterials', () => {
    it('should return materials for a project', async () => {
      (MaterialModel.find as jest.Mock).mockResolvedValue([mockMaterialDto]);

      const result = await materialService.fetchProjectMaterials(new Types.ObjectId(mockProjectId));

      expect(result).toEqual([{
        id: mockMaterialId,
        name: validMaterialData.name,
        imageUrl: undefined,
        status: validMaterialData.status,
        deliveryDate: undefined,
        allDay: validMaterialData.allDay,
        cost: validMaterialData.cost,
        quantity: validMaterialData.quantity,
        unit: validMaterialData.unit,
        location: undefined,
        link: undefined,
        note: undefined,
        type: undefined,
      }]);
      expect(MaterialModel.find).toHaveBeenCalledWith({ projectId: new Types.ObjectId(mockProjectId) });
    });

    it('should throw error when materials not found', async () => {
      (MaterialModel.find as jest.Mock).mockResolvedValue([]); 

      await expect(materialService.fetchProjectMaterials(new Types.ObjectId(mockProjectId)))
        .rejects
        .toThrow('Error fetching project materials');
    });
  });

  describe('fetchMaterialById', () => {
    it('should return a material by ID', async () => {
      (MaterialModel.findOne as jest.Mock).mockResolvedValue(mockMaterialDto);

      const result = await materialService.fetchMaterialById(
        new Types.ObjectId(mockProjectId),
        mockMaterialId
      );

      expect(result).toEqual({
        id: mockMaterialId,
        name: validMaterialData.name,
        imageUrl: undefined,
        status: validMaterialData.status,
        deliveryDate: undefined,
        allDay: validMaterialData.allDay,
        cost: validMaterialData.cost,
        quantity: validMaterialData.quantity,
        unit: validMaterialData.unit,
        location: undefined,
        link: undefined,
        note: undefined,
        type: undefined,
      });
    });

    it('should throw error when material not found', async () => {
      (MaterialModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(materialService.fetchMaterialById(
        new Types.ObjectId(mockProjectId),
        mockMaterialId
      )).rejects.toThrow('Error fetching material by ID');
    });
  });

  describe('createMaterial', () => {
    it('should create a new material', async () => {
      const saveMock = jest.fn().mockResolvedValue(mockMaterialDto);
      (MaterialModel as unknown as jest.Mock).mockImplementation(() => ({
        ...mockMaterialDto,
        save: saveMock
      }));

      const result = await materialService.createMaterial(
        new Types.ObjectId(mockProjectId),
        validMaterialData
      );

      expect(result).toEqual({
        id: mockMaterialId,
        name: validMaterialData.name,
        imageUrl: undefined,
        status: validMaterialData.status,
        deliveryDate: undefined,
        allDay: validMaterialData.allDay,
        cost: validMaterialData.cost,
        quantity: validMaterialData.quantity,
        unit: validMaterialData.unit,
        location: undefined,
        link: undefined,
        note: undefined,
        type: undefined,
      });
      expect(saveMock).toHaveBeenCalled();
    });

    it('should throw error when creation fails', async () => {
      (MaterialModel as unknown as jest.Mock).mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Save failed'))
      }));

      await expect(materialService.createMaterial(
        new Types.ObjectId(mockProjectId),
        validMaterialData
      )).rejects.toThrow('Error creating material');
    });
  });

  describe('updateMaterial', () => {
    it('should update an existing material', async () => {
      const updatedData = { ...validMaterialData, name: 'Updated Material' };
      const updatedMaterial = { ...mockMaterialDto, name: 'Updated Material' };
      
      (MaterialModel.findOne as jest.Mock)
        .mockResolvedValueOnce(mockMaterialDto) 
        .mockResolvedValueOnce(updatedMaterial); 

      (MaterialModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedMaterial);

      const result = await materialService.updateMaterial(
        new Types.ObjectId(mockProjectId),
        mockMaterialId,
        updatedData
      );

      expect(result.name).toBe('Updated Material');
      expect(MaterialModel.findOneAndUpdate).toHaveBeenCalledWith(
        { projectId: new Types.ObjectId(mockProjectId), _id: mockMaterialId },
        { $set: updatedData },
        { new: true, runValidators: true }
      );
    });

    it('should throw error when material not found', async () => {
      (MaterialModel.findOne as jest.Mock).mockResolvedValue(null);
      (MaterialModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(materialService.updateMaterial(
        new Types.ObjectId(mockProjectId),
        mockMaterialId,
        validMaterialData
      )).rejects.toThrow('Error updating material');
    });
  });

  describe('deleteMaterial', () => {
    it('should delete a material and its image', async () => {
        const materialWithImage = { 
          ...mockMaterialDto, 
          imageUrl: 'test-image.jpg'
        };
        
        (MaterialModel.findOne as jest.Mock).mockResolvedValue(materialWithImage);
        (MaterialModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });
      
        const result = await materialService.deleteMaterial(
          new Types.ObjectId(mockProjectId),
          mockMaterialId
        );
      
        expect(result).toEqual({ 
          message: 'Material and associated image (if any) deleted successfully' 
        });
        expect(deleteFileByUrl).toHaveBeenCalledWith('test-image.jpg');
      });

    it('should delete material without image', async () => {
    (MaterialModel.findOne as jest.Mock).mockResolvedValue(mockMaterialDto);
    (MaterialModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

    const result = await materialService.deleteMaterial(
        new Types.ObjectId(mockProjectId),
        mockMaterialId
    );

    expect(result).toEqual({ 
        message: 'Material and associated image (if any) deleted successfully' 
    });
    expect(deleteFileByUrl).not.toHaveBeenCalled();
    });

    it('should throw error when material not found', async () => {
      (MaterialModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(materialService.deleteMaterial(
        new Types.ObjectId(mockProjectId),
        mockMaterialId
      )).rejects.toThrow('Error deleting material');
    });
  });
});