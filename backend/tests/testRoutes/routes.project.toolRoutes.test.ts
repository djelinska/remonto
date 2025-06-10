import request from 'supertest';
import express from 'express';
import toolRouter from '../../routes/project/toolRoutes'; 
import * as toolService from '../../services/toolService';
import * as validationUtils from '../../utils/validation';
import { Types } from 'mongoose';

jest.mock('../../middlewares/authenticateUser', () => (req: any, res: any, next: any) => {
  req.user = { id: 'mockUserId' };
  next();
});

jest.mock('../../middlewares/validateTool', () => (req: any, res: any, next: any) => {
  next();
});

jest.mock('../../services/toolService');
jest.mock('../../utils/validation');

const app = express();
app.use(express.json());
app.use('/projects/:projectId/tools', toolRouter);

const projectId = new Types.ObjectId().toHexString();
const toolId = new Types.ObjectId().toHexString();

const mockTool = {
  _id: toolId,
  name: 'Mock Tool',
  description: 'Mock Description'
};
describe('Tool Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (validationUtils.checkIfCorrectId as jest.Mock).mockReturnValue(true);
  });

  describe('GET /:toolId', () => {
    it('should fetch tool by ID', async () => {
      (toolService.fetchToolById as jest.Mock).mockResolvedValue(mockTool);

      const res = await request(app).get(`/projects/${projectId}/tools/${toolId}`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTool);
    });

    it('should return 400 on service error', async () => {
      (toolService.fetchToolById as jest.Mock).mockRejectedValue(new Error('Failed'));

      const res = await request(app).get(`/projects/${projectId}/tools/${toolId}`);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Failed');
    });

    it('should return 400 for invalid ID', async () => {
      (validationUtils.checkIfCorrectId as jest.Mock).mockReturnValue(false);

      const res = await request(app).get(`/projects/${projectId}/tools/${toolId}`);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid IDs');
    });
  });

  describe('GET /', () => {
    it('should fetch all tools for a project', async () => {
      (toolService.fetchProjectTools as jest.Mock).mockResolvedValue([mockTool]);

      const res = await request(app).get(`/projects/${projectId}/tools`);
      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockTool]);
    });

    it('should return 400 on error', async () => {
      (toolService.fetchProjectTools as jest.Mock).mockRejectedValue(new Error('Error fetching'));

      const res = await request(app).get(`/projects/${projectId}/tools`);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Error fetching');
    });
  });

  describe('POST /', () => {
    it('should create a new tool', async () => {
      (toolService.createTool as jest.Mock).mockResolvedValue(mockTool);

      const res = await request(app)
        .post(`/projects/${projectId}/tools`)
        .send({ name: 'Tool', description: 'Some desc' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockTool);
    });

    it('should return 400 on error', async () => {
      (toolService.createTool as jest.Mock).mockRejectedValue(new Error('Create failed'));

      const res = await request(app)
        .post(`/projects/${projectId}/tools`)
        .send({ name: 'Tool' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Create failed');
    });
  });

  describe('PUT /:toolId', () => {
    it('should update a tool', async () => {
      (toolService.updateTool as jest.Mock).mockResolvedValue({ ...mockTool, name: 'Updated Tool' });

      const res = await request(app)
        .put(`/projects/${projectId}/tools/${toolId}`)
        .send({ name: 'Updated Tool' });

      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Updated Tool');
    });

    it('should return 400 on error', async () => {
      (toolService.updateTool as jest.Mock).mockRejectedValue(new Error('Update error'));

      const res = await request(app)
        .put(`/projects/${projectId}/tools/${toolId}`)
        .send({ name: 'Updated Tool' });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Update error');
    });
  });

  describe('DELETE /:toolId', () => {
    it('should delete a tool', async () => {
      (toolService.deleteTool as jest.Mock).mockResolvedValue({ message: 'Deleted' });

      const res = await request(app).delete(`/projects/${projectId}/tools/${toolId}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Deleted');
    });

    it('should return 400 on error', async () => {
      (toolService.deleteTool as jest.Mock).mockRejectedValue(new Error('Delete error'));

      const res = await request(app).delete(`/projects/${projectId}/tools/${toolId}`);
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Delete error');
    });
  });
});
