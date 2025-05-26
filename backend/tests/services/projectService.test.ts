import { Types } from 'mongoose';
import * as projectService from '../../services/projectService';
import ProjectModel from '../../models/projectModel';
import MaterialModel from '../../models/materialModel';
import ToolModel from '../../models/toolModel';
import TaskModel from '../../models/taskModel';
import { 
  validProjectData,
  mockProjectId,
  mockUserId
} from '../mockData/mockProject';

jest.mock('../../models/projectModel');
jest.mock('../../models/materialModel');
jest.mock('../../models/toolModel');
jest.mock('../../models/taskModel');

describe('projectService', () => {
  const mockProjectDto = {
    _id: new Types.ObjectId(mockProjectId),
    userId: new Types.ObjectId(mockUserId),
    name: validProjectData.name,
    description: validProjectData.description,
    startDate: validProjectData.startDate,
    endDate: validProjectData.endDate,
    budget: validProjectData.budget,
    imageUrls: [],
    notes: [],
    save: jest.fn(),
    toObject: jest.fn().mockReturnThis()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchUserProjects', () => {
    it('should return user projects', async () => {
        const mockProjects = [
            { ...mockProjectDto, _id: new Types.ObjectId() },
            { ...mockProjectDto, _id: new Types.ObjectId(), name: 'Second Project' }
        ];
        
        (ProjectModel.find as jest.Mock).mockResolvedValue(mockProjects);

        const result = await projectService.fetchUserProjects(new Types.ObjectId(mockUserId));

        expect(result).toEqual([
            { id: mockProjects[0]._id, name: mockProjects[0].name },
            { id: mockProjects[1]._id, name: mockProjects[1].name }
        ]);
        expect(ProjectModel.find).toHaveBeenCalledWith({ 
            userId: new Types.ObjectId(mockUserId) 
        });
    });

    it('should throw error when no projects found', async () => {
        (ProjectModel.find as jest.Mock).mockResolvedValue(null); // or []
        
        await expect(projectService.fetchUserProjects(new Types.ObjectId(mockUserId)))
            .rejects
            .toThrow('Error fetching projects');
    });
});

  describe('fetchUserProjectById', () => {
    it('should return a project by ID', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue(mockProjectDto);

      const result = await projectService.fetchUserProjectById(
        new Types.ObjectId(mockUserId),
        new Types.ObjectId(mockProjectId)
      );

      expect(result).toEqual({
        id: mockProjectDto._id,
        name: mockProjectDto.name,
        description: mockProjectDto.description,
        startDate: mockProjectDto.startDate,
        endDate: mockProjectDto.endDate,
        budget: mockProjectDto.budget,
        imageUrls: mockProjectDto.imageUrls,
        notes: mockProjectDto.notes
      });
    });

    it('should throw error when project not found', async () => {
      (ProjectModel.findOne as jest.Mock).mockResolvedValue(null);

      await expect(projectService.fetchUserProjectById(
        new Types.ObjectId(mockUserId),
        new Types.ObjectId(mockProjectId)
      )).rejects.toThrow('Error fetching projects');
    });
  });

  describe('createUserProject', () => {
    it('should create a new project', async () => {
      const saveMock = jest.fn().mockResolvedValue(mockProjectDto);
      (ProjectModel as unknown as jest.Mock).mockImplementation(() => ({
        ...mockProjectDto,
        save: saveMock
      }));

      const result = await projectService.createUserProject(
        new Types.ObjectId(mockUserId),
        validProjectData
      );

      expect(result).toEqual({
        id: mockProjectDto._id,
        name: mockProjectDto.name,
        description: mockProjectDto.description,
        startDate: mockProjectDto.startDate,
        endDate: mockProjectDto.endDate,
        budget: mockProjectDto.budget
      });
      expect(saveMock).toHaveBeenCalled();
    });

    it('should throw error when creation fails', async () => {
      (ProjectModel as unknown as jest.Mock).mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Save failed'))
      }));

      await expect(projectService.createUserProject(
        new Types.ObjectId(mockUserId),
        validProjectData
      )).rejects.toThrow('Error creating project');
    });
  });

  describe('updateUserProject', () => {
    it('should update an existing project', async () => {
      const updatedData = { ...validProjectData, name: 'Updated Project' };
      const updatedProject = { ...mockProjectDto, name: 'Updated Project' };
      
      (ProjectModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedProject);

      const result = await projectService.updateUserProject(
        new Types.ObjectId(mockUserId),
        new Types.ObjectId(mockProjectId),
        updatedData
      );

      expect(result.name).toBe('Updated Project');
      expect(ProjectModel.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: new Types.ObjectId(mockUserId), _id: new Types.ObjectId(mockProjectId) },
        { $set: updatedData },
        { new: true, runValidators: true }
      );
    });

    it('should throw error when project not found', async () => {
      (ProjectModel.findOneAndUpdate as jest.Mock).mockResolvedValue(null);

      await expect(projectService.updateUserProject(
        new Types.ObjectId(mockUserId),
        new Types.ObjectId(mockProjectId),
        validProjectData
      )).rejects.toThrow('Failed to update project');
    });
  });

  describe('deleteUserProject', () => {
    it('should delete a project and its related materials, tools, and tasks', async () => {
        (MaterialModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 1 });
        (ToolModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 1 });
        (TaskModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 1 });
        (ProjectModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 });

        const result = await projectService.deleteUserProject(
            new Types.ObjectId(mockUserId),
            new Types.ObjectId(mockProjectId)
        );

        expect(result).toEqual({ 
            message: 'Project deleted successfully' 
        });
        
        expect(MaterialModel.deleteMany).toHaveBeenCalledWith({ 
            projectId: new Types.ObjectId(mockProjectId) 
        });
        expect(ToolModel.deleteMany).toHaveBeenCalledWith({ 
            projectId: new Types.ObjectId(mockProjectId) 
        });
        expect(TaskModel.deleteMany).toHaveBeenCalledWith({ 
            projectId: new Types.ObjectId(mockProjectId) 
        });
        expect(ProjectModel.deleteOne).toHaveBeenCalledWith({ 
            userId: new Types.ObjectId(mockUserId), 
            _id: new Types.ObjectId(mockProjectId) 
        });
    });

    it('should return success message even when no project was deleted', async () => {
    (MaterialModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 0 });
    (ToolModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 0 });
    (TaskModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 0 });
    (ProjectModel.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 });

    const result = await projectService.deleteUserProject(
        new Types.ObjectId(mockUserId),
        new Types.ObjectId(mockProjectId)
    );

    expect(result).toEqual({
        message: 'Project deleted successfully'
    });
    });
});

  describe('fetchProjectBudget', () => {
    it('should return project budget details', async () => {
      const mockProject = { 
        ...mockProjectDto, 
        budget: 10000 
      };
      
      (ProjectModel.findOne as jest.Mock).mockResolvedValue(mockProject);
      (MaterialModel.aggregate as jest.Mock).mockResolvedValue([{ totalCost: 2000 }]);
      (ToolModel.aggregate as jest.Mock).mockResolvedValue([{ totalCost: 1500 }]);
      (TaskModel.aggregate as jest.Mock).mockResolvedValue([{ totalCost: 3000 }]);

      const result = await projectService.fetchProjectBudget(
        new Types.ObjectId(mockUserId),
        new Types.ObjectId(mockProjectId)
      );

      expect(result).toEqual({
        budget: 10000,
        totalSpent: 6500,
        materialsCost: 2000,
        toolsCost: 1500,
        laborCost: 3000
      });
    });

    it('should handle zero costs', async () => {
      const mockProject = { 
        ...mockProjectDto, 
        budget: 10000 
      };
      
      (ProjectModel.findOne as jest.Mock).mockResolvedValue(mockProject);
      (MaterialModel.aggregate as jest.Mock).mockResolvedValue([]);
      (ToolModel.aggregate as jest.Mock).mockResolvedValue([]);
      (TaskModel.aggregate as jest.Mock).mockResolvedValue([]);

      const result = await projectService.fetchProjectBudget(
        new Types.ObjectId(mockUserId),
        new Types.ObjectId(mockProjectId)
      );

      expect(result).toEqual({
        budget: 10000,
        totalSpent: 0,
        materialsCost: 0,
        toolsCost: 0,
        laborCost: 0
      });
    });
  });

  describe('image and note operations', () => {
    it('should add image to project', async () => {
      const updatedProject = { 
        ...mockProjectDto, 
        imageUrls: ['test-image.jpg'] 
      };
      
      (ProjectModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedProject);

      const result = await projectService.addImageToProject(
        new Types.ObjectId(mockUserId),
        new Types.ObjectId(mockProjectId),
        'test-image.jpg'
      );

      expect(result).toEqual(['test-image.jpg']);
    });

    it('should add note to project', async () => {
        const newNote = { 
          content: 'Test note', 
          createdAt: new Date() 
        };
        const updatedProject = { 
          ...mockProjectDto, 
          notes: [newNote] 
        };
        
        (ProjectModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedProject);
      
        const result = await projectService.addNoteToProject(
          new Types.ObjectId(mockUserId),
          new Types.ObjectId(mockProjectId),
          'Test note'
        );
      
        if (!result) {
          throw new Error('Result is undefined');
        }
        
        expect(result).toBeDefined();
        expect(result.length).toBeGreaterThan(0);
        expect(result[0].content).toBe('Test note');
      });

    it('should remove image from project', async () => {
      const updatedProject = { 
        ...mockProjectDto, 
        imageUrls: [] 
      };
      
      (ProjectModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedProject);

      await expect(projectService.removeImageFromProject(
        new Types.ObjectId(mockUserId),
        new Types.ObjectId(mockProjectId),
        'test-image.jpg'
      )).resolves.not.toThrow();
    });

    it('should delete note from project', async () => {
      const noteId = new Types.ObjectId();
      const updatedProject = { 
        ...mockProjectDto, 
        notes: [] 
      };
      
      (ProjectModel.findOneAndUpdate as jest.Mock).mockResolvedValue(updatedProject);

      const result = await projectService.deleteNoteFromProject(
        new Types.ObjectId(mockUserId),
        new Types.ObjectId(mockProjectId),
        noteId
      );

      expect(result).toEqual([]);
    });
  });
});