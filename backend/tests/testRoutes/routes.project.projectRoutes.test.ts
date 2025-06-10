import request from 'supertest';
import express from 'express';
import router from '../../routes/project/projectRoutes'; 
import * as projectService from '../../services/projectService';
import { Types } from 'mongoose';
import { ProjectNoteDto } from '../../types/models/project.dto';

jest.mock('../../middlewares/authenticateUser', () => (req: any, res: any, next: any) => {
  req.user = { id: new Types.ObjectId().toHexString() };
  next();
});

jest.mock('../../middlewares/validateProject', () => (req: any, res: any, next: any) => next());

jest.mock('../../utils/fileUtils', () => ({ deleteFileByUrl: jest.fn() }));
jest.mock('../../services/projectService');

const app = express();
app.use(express.json());
app.use(router);

const userId = new Types.ObjectId().toHexString();
const projectId = new Types.ObjectId().toHexString();
const noteId = new Types.ObjectId().toHexString();
const mockProject = { _id: projectId, name: 'Test Project', notes: [], imageUrls: [] };

describe('Project Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  test('GET /api/projects should return all user projects', async () => {
    (projectService.fetchUserProjects as jest.Mock).mockResolvedValue([mockProject]);
    const res = await request(app).get('/api/projects');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([mockProject]);
  });

  test('GET /api/projects/:projectId should return a single project', async () => {
    (projectService.fetchUserProjectById as jest.Mock).mockResolvedValue(mockProject);
    const res = await request(app).get(`/api/projects/${projectId}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockProject);
  });

  test('POST /api/projects should create a project', async () => {
    (projectService.createUserProject as jest.Mock).mockResolvedValue(mockProject);
    const res = await request(app).post('/api/projects').send({ name: 'New Project' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockProject);
  });

  test('PUT /api/projects/:projectId should update a project', async () => {
    const updated = { ...mockProject, name: 'Updated' };
    (projectService.updateUserProject as jest.Mock).mockResolvedValue(updated);
    const res = await request(app).put(`/api/projects/${projectId}`).send({ name: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Updated');
  });

  test('DELETE /api/projects/:projectId should delete project', async () => {
    (projectService.deleteUserProject as jest.Mock).mockResolvedValue({ message: 'Deleted' });
    const res = await request(app).delete(`/api/projects/${projectId}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Deleted');
  });

  test('GET /api/projects/:projectId/budget should return budget data', async () => {
    const budget = { total: 1000 };
    (projectService.fetchProjectBudget as jest.Mock).mockResolvedValue(budget);
    const res = await request(app).get(`/api/projects/${projectId}/budget`);
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1000);
  });

  test('PATCH /api/projects/:projectId/images should add image', async () => {
    const images = ['img1.jpg'];
    (projectService.addImageToProject as jest.Mock).mockResolvedValue(images);
    const res = await request(app).patch(`/api/projects/${projectId}/images`).send({ imageUrl: 'img1.jpg' });
    expect(res.status).toBe(200);
    expect(res.body.imageUrls).toEqual(images);
  });

  test('PATCH /api/projects/:projectId/notes should add note', async () => {
    const notes = ['note1'];
    (projectService.addNoteToProject as jest.Mock).mockResolvedValue(notes);
    const res = await request(app).patch(`/api/projects/${projectId}/notes`).send({ note: 'note1' });
    expect(res.status).toBe(200);
    expect(res.body.notes).toEqual(notes);
  });

  test('PATCH /api/projects/:projectId/notes/:noteId should delete note', async () => {
    const notes: ProjectNoteDto[] = [];
    (projectService.deleteNoteFromProject as jest.Mock).mockResolvedValue(notes);
    const res = await request(app).patch(`/api/projects/${projectId}/notes/${noteId}`);
    expect(res.status).toBe(200);
    expect(res.body.notes).toEqual([]);
  });

  test('DELETE /api/projects/:projectId/images/:imageUrl should delete image', async () => {
    const encodedUrl = encodeURIComponent('img.jpg');
    (projectService.removeImageFromProject as jest.Mock).mockResolvedValue(true);
    const res = await request(app).delete(`/api/projects/${projectId}/images/${encodedUrl}`);
    expect(res.status).toBe(204);
  });
});

