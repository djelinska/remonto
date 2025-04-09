import request from 'supertest';
import express from 'express';
import router from '../../routes/project/materialRoutes';
import * as materialService from '../../services/materialService';
import authenticateUser from '../../middlewares/authenticateUser';
import validateMaterialData from '../../middlewares/validateMaterial';
import { Types } from 'mongoose';

// Mock middlewares
jest.mock('../../middlewares/authenticateUser', () => jest.fn((req, res, next) => {
    req.user = { id: 'mockUserId' };
    next();
}));

jest.mock('../../middlewares/validateMaterial', () => jest.fn((req, res, next) => next()));

// Mock services
jest.mock('../../services/materialService');

const app = express();
app.use(express.json());
app.use('/projects/:projectId/materials', router);

const mockProjectId = new Types.ObjectId().toString();
const mockMaterialId = new Types.ObjectId().toString();

describe('Materials Router', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /projects/:projectId/materials', () => {
        it('should return materials list', async () => {
            const mockMaterials = [{ name: 'Wood' }, { name: 'Steel' }];
            (materialService.fetchProjectMaterials as jest.Mock).mockResolvedValue(mockMaterials);

            const res = await request(app).get(`/projects/${mockProjectId}/materials`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockMaterials);
            expect(materialService.fetchProjectMaterials).toHaveBeenCalledWith(expect.any(Types.ObjectId));
        });
    });

    describe('GET /projects/:projectId/materials/:materialId', () => {
        it('should return a single material', async () => {
            const mockMaterial = { name: 'Wood', _id: mockMaterialId };
            (materialService.fetchMaterialById as jest.Mock).mockResolvedValue(mockMaterial);

            const res = await request(app).get(`/projects/${mockProjectId}/materials/${mockMaterialId}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockMaterial);
            expect(materialService.fetchMaterialById).toHaveBeenCalledWith(
                expect.any(Types.ObjectId),
                expect.any(Types.ObjectId)
            );
        });
    });

    describe('POST /projects/:projectId/materials', () => {
        it('should create a new material', async () => {
            const mockNewMaterial = { name: 'Concrete' };
            (materialService.createMaterial as jest.Mock).mockResolvedValue(mockNewMaterial);

            const res = await request(app)
                .post(`/projects/${mockProjectId}/materials`)
                .send({ name: 'Concrete' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual(mockNewMaterial);
            expect(materialService.createMaterial).toHaveBeenCalledWith(
                expect.any(Types.ObjectId),
                expect.objectContaining({ name: 'Concrete' })
            );
        });
    });

    describe('PUT /projects/:projectId/materials/:materialId', () => {
        it('should update an existing material', async () => {
            const updatedMaterial = { name: 'Updated Wood' };
            (materialService.updateMaterial as jest.Mock).mockResolvedValue(updatedMaterial);

            const res = await request(app)
                .put(`/projects/${mockProjectId}/materials/${mockMaterialId}`)
                .send({ name: 'Updated Wood' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(updatedMaterial);
            expect(materialService.updateMaterial).toHaveBeenCalledWith(
                expect.any(Types.ObjectId),
                expect.any(Types.ObjectId),
                expect.objectContaining({ name: 'Updated Wood' })
            );
        });
    });

    describe('DELETE /projects/:projectId/materials/:materialId', () => {
        it('should delete a material', async () => {
            const mockDeleteResponse = { success: true };
            (materialService.deleteMaterial as jest.Mock).mockResolvedValue(mockDeleteResponse);

            const res = await request(app).delete(`/projects/${mockProjectId}/materials/${mockMaterialId}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockDeleteResponse);
            expect(materialService.deleteMaterial).toHaveBeenCalledWith(
                expect.any(Types.ObjectId),
                expect.any(Types.ObjectId)
            );
        });
    });
});

