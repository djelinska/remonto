import { Types } from 'mongoose';
import ToolModel from '../../models/toolModel';
import * as toolService from '../../services/toolService';
import { 
  validToolData,  
  mockToolId
} from '../mockData/mockTool';
import { deleteFileByUrl } from '../../utils/fileUtils';
import { mockProjectId } from '../mockData/mockProject';

jest.mock('../../models/toolModel');
jest.mock('../../utils/fileUtils');

describe('Tool Service', () => {
  const mockProjectObjectId = new Types.ObjectId(mockProjectId);
  const mockToolObjectId = new Types.ObjectId(mockToolId);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchProjectTools', () => {
    it('should fetch tools for a project successfully', async () => {
      const mockTools = [
        {
          _id: mockToolObjectId,
          projectId: mockProjectObjectId,
          name: 'Tool 1',
          imageUrl: 'http://example.com/image1.jpg',
          status: 'AVAILABLE',
          deliveryDate: new Date(),
          allDay: false,
          cost: 100,
          quantity: 5,
          location: 'Location 1',
          link: 'http://example.com',
          note: 'Note 1',
          toObject: jest.fn().mockReturnThis()
        }
      ];

      (ToolModel.find as jest.Mock).mockResolvedValue(mockTools);

      const result = await toolService.fetchProjectTools(mockProjectObjectId);

      expect(ToolModel.find).toHaveBeenCalledWith({ projectId: mockProjectObjectId });
      expect(result).toEqual([
        {
          id: mockToolObjectId,
          name: 'Tool 1',
          imageUrl: 'http://example.com/image1.jpg',
          status: 'AVAILABLE',
          deliveryDate: mockTools[0].deliveryDate,
          allDay: false,
          cost: 100,
          quantity: 5,
          location: 'Location 1',
          link: 'http://example.com',
          note: 'Note 1'
        }
      ]);
    });

    it('should throw an error when fetching tools fails', async () => {
      (ToolModel.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(toolService.fetchProjectTools(mockProjectObjectId)).rejects.toThrow(
        'Error fetching project tools'
      );
    });
  });

  describe('fetchToolById', () => {
    it('should fetch a tool by ID successfully', async () => {
      const mockTool = {
        _id: mockToolObjectId,
        projectId: mockProjectObjectId,
        name: 'Tool 1',
        imageUrl: 'http://example.com/image1.jpg',
        status: 'AVAILABLE',
        deliveryDate: new Date(),
        allDay: false,
        cost: 100,
        quantity: 5,
        location: 'Location 1',
        link: 'http://example.com',
        note: 'Note 1',
        toObject: jest.fn().mockReturnThis()
      };

      (ToolModel.findOne as jest.Mock).mockResolvedValue(mockTool);

      const result = await toolService.fetchToolById(mockProjectObjectId, mockToolObjectId);

      expect(ToolModel.findOne).toHaveBeenCalledWith({
        projectId: mockProjectObjectId,
        _id: mockToolObjectId
      });
      expect(result).toEqual({
        id: mockToolObjectId,
        name: 'Tool 1',
        imageUrl: 'http://example.com/image1.jpg',
        status: 'AVAILABLE',
        deliveryDate: mockTool.deliveryDate,
        allDay: false,
        cost: 100,
        quantity: 5,
        location: 'Location 1',
        link: 'http://example.com',
        note: 'Note 1'
      });
    });

    it('should throw an error when tool is not found', async () => {
      (ToolModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        toolService.fetchToolById(mockProjectObjectId, mockToolObjectId)
      ).rejects.toThrow('Error fetching tool by ID');
    });

    it('should throw an error when fetching tool fails', async () => {
      (ToolModel.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(
        toolService.fetchToolById(mockProjectObjectId, mockToolObjectId)
      ).rejects.toThrow('Error fetching tool by ID');
    });
  });

  describe('createTool', () => {
    it('should create a tool successfully', async () => {
      const mockTool = {
        _id: mockToolObjectId,
        projectId: mockProjectObjectId,
        ...validToolData,
        save: jest.fn().mockResolvedValue(undefined),
        toObject: jest.fn().mockReturnThis()
      };

      (ToolModel as jest.MockedClass<any>).mockImplementation(() => mockTool);

      const result = await toolService.createTool(mockProjectObjectId, validToolData);

      expect(ToolModel).toHaveBeenCalledWith({
        projectId: mockProjectObjectId,
        name: validToolData.name,
        imageUrl: validToolData.imageUrl,
        status: validToolData.status,
        deliveryDate: validToolData.deliveryDate,
        allDay: validToolData.allDay,
        cost: validToolData.cost,
        quantity: validToolData.quantity,
        location: validToolData.location,
        link: validToolData.link,
        note: validToolData.note,
      });
      expect(mockTool.save).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockToolObjectId,
        name: validToolData.name,
        imageUrl: validToolData.imageUrl,
        status: validToolData.status,
        deliveryDate: validToolData.deliveryDate,
        allDay: validToolData.allDay,
        cost: validToolData.cost,
        quantity: validToolData.quantity,
        location: validToolData.location,
        link: validToolData.link,
        note: validToolData.note,
      });
    });

    it('should throw an error when tool creation fails', async () => {
      const mockTool = {
        _id: mockToolObjectId,
        projectId: mockProjectObjectId,
        ...validToolData,
        save: jest.fn().mockRejectedValue(new Error('Validation error')),
        toObject: jest.fn().mockReturnThis()
      };

      (ToolModel as jest.MockedClass<any>).mockImplementation(() => mockTool);

      await expect(
        toolService.createTool(mockProjectObjectId, validToolData)
      ).rejects.toThrow('Error creating tool');
    });
  });

  describe('updateTool', () => {
    it('should update a tool successfully', async () => {
      const currentTool = {
        _id: mockToolObjectId,
        projectId: mockProjectObjectId,
        ...validToolData,
        imageUrl: 'http://example.com/old-image.jpg',
        toObject: jest.fn().mockReturnThis()
      };

      const updatedTool = {
        _id: mockToolObjectId,
        projectId: mockProjectObjectId,
        ...validToolData,
        name: 'Updated Tool',
        imageUrl: 'http://example.com/new-image.jpg',
        toObject: jest.fn().mockReturnThis()
      };

      (ToolModel.findOne as jest.Mock).mockResolvedValueOnce(currentTool);
      (ToolModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedTool);

      const result = await toolService.updateTool(
        mockProjectObjectId,
        mockToolObjectId,
        { ...validToolData, name: 'Updated Tool', imageUrl: 'http://example.com/new-image.jpg' }
      );

      expect(ToolModel.findOne).toHaveBeenCalledWith({
        projectId: mockProjectObjectId,
        _id: mockToolObjectId
      });
      expect(ToolModel.findOneAndUpdate).toHaveBeenCalledWith(
        { projectId: mockProjectObjectId, _id: mockToolObjectId },
        { $set: { ...validToolData, name: 'Updated Tool', imageUrl: 'http://example.com/new-image.jpg' } },
        { new: true, runValidators: true }
      );
      expect(deleteFileByUrl).toHaveBeenCalledWith('http://example.com/old-image.jpg');
      expect(result).toEqual({
        id: mockToolObjectId,
        name: 'Updated Tool',
        imageUrl: 'http://example.com/new-image.jpg',
        status: validToolData.status,
        deliveryDate: validToolData.deliveryDate,
        allDay: validToolData.allDay,
        cost: validToolData.cost,
        quantity: validToolData.quantity,
        location: validToolData.location,
        link: validToolData.link,
        note: validToolData.note,
      });
    });

    it('should not delete old image if new image is the same', async () => {
      const currentTool = {
        _id: mockToolObjectId,
        projectId: mockProjectObjectId,
        ...validToolData,
        imageUrl: 'http://example.com/same-image.jpg',
        toObject: jest.fn().mockReturnThis()
      };

      const updatedTool = {
        _id: mockToolObjectId,
        projectId: mockProjectObjectId,
        ...validToolData,
        name: 'Updated Tool',
        imageUrl: 'http://example.com/same-image.jpg',
        toObject: jest.fn().mockReturnThis()
      };

      (ToolModel.findOne as jest.Mock).mockResolvedValueOnce(currentTool);
      (ToolModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedTool);

      await toolService.updateTool(
        mockProjectObjectId,
        mockToolObjectId,
        { ...validToolData, name: 'Updated Tool', imageUrl: 'http://example.com/same-image.jpg' }
      );

      expect(deleteFileByUrl).not.toHaveBeenCalled();
    });

    it('should throw an error when tool is not found', async () => {
      (ToolModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        toolService.updateTool(mockProjectObjectId, mockToolObjectId, validToolData)
      ).rejects.toThrow('Error updating tool');
    });

    it('should throw an error when tool update fails', async () => {
      (ToolModel.findOne as jest.Mock).mockResolvedValue({
        _id: mockToolObjectId,
        projectId: mockProjectObjectId,
        ...validToolData
      });
      (ToolModel.findOneAndUpdate as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(
        toolService.updateTool(mockProjectObjectId, mockToolObjectId, validToolData)
      ).rejects.toThrow('Error updating tool');
    });
  });

  describe('deleteTool', () => {
    it('should delete a tool successfully with image', async () => {
      const mockTool = {
        _id: mockToolObjectId,
        projectId: mockProjectObjectId,
        ...validToolData,
        imageUrl: 'http://example.com/image.jpg',
        toObject: jest.fn().mockReturnThis()
      };

      (ToolModel.findOne as jest.Mock).mockResolvedValue(mockTool);
      (ToolModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });
      (deleteFileByUrl as jest.Mock).mockReturnValue(true);

      const result = await toolService.deleteTool(mockProjectObjectId, mockToolObjectId);

      expect(ToolModel.findOne).toHaveBeenCalledWith({
        projectId: mockProjectObjectId,
        _id: mockToolObjectId
      });
      expect(ToolModel.deleteOne).toHaveBeenCalledWith({
        projectId: mockProjectObjectId,
        _id: mockToolObjectId
      });
      expect(deleteFileByUrl).toHaveBeenCalledWith('http://example.com/image.jpg');
      expect(result).toEqual({ message: 'Tool and associated image (if any) deleted successfully' });
    });

    it('should delete a tool successfully without image', async () => {
      const mockTool = {
        _id: mockToolObjectId,
        projectId: mockProjectObjectId,
        ...validToolData,
        imageUrl: undefined,
        toObject: jest.fn().mockReturnThis()
      };

      (ToolModel.findOne as jest.Mock).mockResolvedValue(mockTool);
      (ToolModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

      const result = await toolService.deleteTool(mockProjectObjectId, mockToolObjectId);

      expect(deleteFileByUrl).not.toHaveBeenCalled();
      expect(result).toEqual({ message: 'Tool and associated image (if any) deleted successfully' });
    });

    it('should throw an error when tool is not found', async () => {
      (ToolModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(
        toolService.deleteTool(mockProjectObjectId, mockToolObjectId)
      ).rejects.toThrow('Error deleting tool');
    });

    it('should throw an error when image deletion fails', async () => {
      const mockTool = {
        _id: mockToolObjectId,
        projectId: mockProjectObjectId,
        ...validToolData,
        imageUrl: 'http://example.com/image.jpg',
        toObject: jest.fn().mockReturnThis()
      };

      (ToolModel.findOne as jest.Mock).mockResolvedValue(mockTool);
      (ToolModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });
      (deleteFileByUrl as jest.Mock).mockReturnValue(false);

      await expect(
        toolService.deleteTool(mockProjectObjectId, mockToolObjectId)
      ).rejects.toThrow('Error deleting tool');
    });

    it('should throw an error when tool deletion fails', async () => {
      const mockTool = {
        _id: mockToolObjectId,
        projectId: mockProjectObjectId,
        ...validToolData,
        toObject: jest.fn().mockReturnThis()
      };

      (ToolModel.findOne as jest.Mock).mockResolvedValue(mockTool);
      (ToolModel.deleteOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      await expect(
        toolService.deleteTool(mockProjectObjectId, mockToolObjectId)
      ).rejects.toThrow('Error deleting tool');
    });
  });
});