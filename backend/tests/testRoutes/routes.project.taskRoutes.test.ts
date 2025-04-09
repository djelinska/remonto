import request from 'supertest';
import express from 'express';
import taskRouter from '../../routes/project/taskRoutes'; // <- update this to match your actual path
import * as taskService from '../../services/taskService';
import { Types } from 'mongoose';

// Mock middlewares
jest.mock('../../middlewares/authenticateUser', () => (req: any, res: any, next: any) => {
  req.user = { id: new Types.ObjectId().toHexString() };
  next();
});
jest.mock('../../middlewares/validateTask', () => (req: any, res: any, next: any) => next());

jest.mock('../../services/taskService');

const app = express();
app.use(express.json());
app.use('/projects/:projectId/tasks', taskRouter);

const projectId = new Types.ObjectId().toHexString();
const taskId = new Types.ObjectId().toHexString();
const userId = new Types.ObjectId().toHexString();

const mockTask = {
  _id: taskId,
  title: 'Mock Task',
  description: 'A task for testing',
  completed: false,
};

describe('Task Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /', () => {
    it('should fetch all tasks for a project', async () => {
      (taskService.fetchProjectTasks as jest.Mock).mockResolvedValue([mockTask]);

      const res = await request(app).get(`/projects/${projectId}/tasks`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([mockTask]);
    });

    it('should handle service error', async () => {
      (taskService.fetchProjectTasks as jest.Mock).mockRejectedValue(new Error('Something went wrong'));

      const res = await request(app).get(`/projects/${projectId}/tasks`);
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error');
    });
  });

  describe('GET /:taskId', () => {
    it('should fetch task by ID', async () => {
      (taskService.fetchProjectTaskById as jest.Mock).mockResolvedValue(mockTask);

      const res = await request(app).get(`/projects/${projectId}/tasks/${taskId}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockTask);
    });

    it('should handle service error', async () => {
      (taskService.fetchProjectTaskById as jest.Mock).mockRejectedValue(new Error('fail'));

      const res = await request(app).get(`/projects/${projectId}/tasks/${taskId}`);
      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error');
    });
  });

  describe('POST /', () => {
    it('should create a new task', async () => {
      (taskService.createProjectTask as jest.Mock).mockResolvedValue(mockTask);

      const res = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({ title: 'New Task', description: '...', completed: false });

      expect(res.status).toBe(201);
      expect(res.body).toEqual(mockTask);
    });

    it('should handle creation error', async () => {
      (taskService.createProjectTask as jest.Mock).mockRejectedValue(new Error('fail'));

      const res = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({ title: 'New Task' });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error');
    });
  });

  describe('PUT /:taskId', () => {
    it('should update a task', async () => {
      const updatedTask = { ...mockTask, completed: true };
      (taskService.updateProjectTask as jest.Mock).mockResolvedValue(updatedTask);

      const res = await request(app)
        .put(`/projects/${projectId}/tasks/${taskId}`)
        .send({ title: 'Updated Task', completed: true });

      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it('should handle update error', async () => {
      (taskService.updateProjectTask as jest.Mock).mockRejectedValue(new Error('fail'));

      const res = await request(app)
        .put(`/projects/${projectId}/tasks/${taskId}`)
        .send({ title: 'Fail Task' });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error');
    });
  });

  describe('DELETE /:taskId', () => {
    it('should delete a task', async () => {
      (taskService.deleteProjectTask as jest.Mock).mockResolvedValue(true);

      const res = await request(app).delete(`/projects/${projectId}/tasks/${taskId}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Task deleted successfully');
    });

    it('should handle deletion error', async () => {
      (taskService.deleteProjectTask as jest.Mock).mockRejectedValue(new Error('fail'));

      const res = await request(app).delete(`/projects/${projectId}/tasks/${taskId}`);

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Server error');
    });
  });
});

