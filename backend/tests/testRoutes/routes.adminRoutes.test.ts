import express, { Request, Response, NextFunction } from 'express';
import request from 'supertest';
import { Types } from 'mongoose';

jest.mock('../../services/templateService', () => ({
  fetchTemplates: jest.fn(),
  fetchTemplateById: jest.fn(),
  createTemplate: jest.fn(),
  updateTemplate: jest.fn(),
  deleteTemplate: jest.fn(),
}));
jest.mock('../../services/userService', () => ({
  updateUserProfile: jest.fn(),
  deleteUserProfile: jest.fn(),
}));


jest.mock('../../middlewares/authenticateUser', () => ({
  __esModule: true,
  default: (_req: Request, _res: Response, next: NextFunction) => next(),
}));
jest.mock('../../middlewares/authenticateAdmin', () => ({
  __esModule: true,
  default: (_req: Request, _res: Response, next: NextFunction) => next(),
}));


import router from '../../routes/admin/adminRoutes'; 
import {
  fetchTemplates,
  fetchTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} from '../../services/templateService';
import userService from '../../services/userService';

describe('Templates & Admin Users API', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(router);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/templates', () => {
    it('200 → returns list', async () => {
      const fake = [{ id: 't1' }, { id: 't2' }];
      (fetchTemplates as jest.Mock).mockResolvedValue(fake);

      const res = await request(app).get('/api/templates');

      expect(fetchTemplates).toHaveBeenCalled();
      expect(res.status).toBe(200);
      expect(res.body).toEqual(fake);
    });

    it('500 → on service error', async () => {
      (fetchTemplates as jest.Mock).mockRejectedValue(new Error('fail'));

      const res = await request(app).get('/api/templates');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('GET /api/admin/templates/:templateId', () => {
    const validId = '507f191e810c19729de860ea';

    it('200 → returns a template', async () => {
    const tpl = { id: validId, name: 'Test' };
    (fetchTemplateById as jest.Mock).mockResolvedValue(tpl);

    const res = await request(app).get(`/api/admin/templates/${validId}`);

    expect(fetchTemplateById).toHaveBeenCalledWith(expect.any(Types.ObjectId));
    expect(res.status).toBe(200);
    expect(res.body).toEqual(tpl);
  });

  it('500 → on service error', async () => {
    (fetchTemplateById as jest.Mock).mockRejectedValue(new Error('DB error'));

    const res = await request(app).get(`/api/admin/templates/${validId}`);

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ message: 'Server error' });
  })
  });

  describe('PATCH /api/admin/users/:userId', () => {
    it('200 → updates user', async () => {
      const updated = { id: 'u1', name: 'Alice' };
      (userService.updateUserProfile as jest.Mock).mockResolvedValue(updated);

      const res = await request(app)
        .patch('/api/admin/users/u1')
        .send({ name: 'Alice' });

      expect(userService.updateUserProfile).toHaveBeenCalledWith('u1', { name: 'Alice' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updated);
    });

    it('500 → on error', async () => {
      (userService.updateUserProfile as jest.Mock).mockRejectedValue(new Error());

      const res = await request(app)
        .patch('/api/admin/users/u1')
        .send({});

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('DELETE /api/admin/users/:userId', () => {
    it('200 → deletes user', async () => {
      (userService.deleteUserProfile as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).delete('/api/admin/users/u123');

      expect(userService.deleteUserProfile).toHaveBeenCalledWith('u123');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Konto zostało usunięte' });
    });

    it('500 → on error', async () => {
      (userService.deleteUserProfile as jest.Mock).mockRejectedValue(new Error());

      const res = await request(app).delete('/api/admin/users/u123');

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('POST /api/admin/templates', () => {
    it('201 → creates template', async () => {
      const created = { id: 't-new', title: 'New' };
      (createTemplate as jest.Mock).mockResolvedValue(created);

      const res = await request(app)
        .post('/api/admin/templates')
        .send({ title: 'New' });

      expect(createTemplate).toHaveBeenCalledWith({ title: 'New' });
      expect(res.status).toBe(201);
      expect(res.body).toEqual(created);
    });

    it('500 → on error', async () => {
      (createTemplate as jest.Mock).mockRejectedValue(new Error());

      const res = await request(app)
        .post('/api/admin/templates')
        .send({});

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('PATCH /api/admin/templates/:templateId', () => {
    const validId = '507f191e810c19729de860ea';

    it('200 → updates template', async () => {
      const upd = { id: validId, title: 'Updated' };
      (updateTemplate as jest.Mock).mockResolvedValue(upd);

      const res = await request(app)
        .patch(`/api/admin/templates/${validId}`)
        .send({ title: 'Updated' });

      expect(updateTemplate).toHaveBeenCalledWith(expect.any(Object), { title: 'Updated' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(upd);
    });

    it('500 → on error', async () => {
      (updateTemplate as jest.Mock).mockRejectedValue(new Error());

      const res = await request(app)
        .patch(`/api/admin/templates/${validId}`)
        .send({});

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });

  describe('DELETE /api/admin/templates/:templateId', () => {
    const validId = '507f191e810c19729de860ea';

    it('200 → deletes template', async () => {
      (deleteTemplate as jest.Mock).mockResolvedValue(undefined);

      const res = await request(app).delete(`/api/admin/templates/${validId}`);

      expect(deleteTemplate).toHaveBeenCalledWith(expect.any(Object));
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Template deleted successfully' });
    });

    it('500 → on error', async () => {
      (deleteTemplate as jest.Mock).mockRejectedValue(new Error());

      const res = await request(app).delete(`/api/admin/templates/${validId}`);

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Server error' });
    });
  });
});

