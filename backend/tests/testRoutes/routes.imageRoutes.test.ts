import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs';
import router from '../../routes/image/imageRoutes';

jest.mock('../../middlewares/authenticateUser', () =>
    jest.fn((req, res, next) => {
        req.user = { id: 'mockUserId' };
        next();
    })
);

const app = express();
app.use(express.json());
app.use(router);

const uploadsDir = path.join(__dirname, '../../uploads');

beforeAll(() => {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir);
    }
});

afterAll(() => {
    fs.readdirSync(uploadsDir).forEach(file => {
        fs.unlinkSync(path.join(uploadsDir, file));
    });
});

describe('Image Routes', () => {
    describe('POST /api/images/upload', () => {
        it('should upload a file and return its URL', async () => {
            const testImagePath = path.join(__dirname, '../test-assets/test-image.jpg');

            if (!fs.existsSync(testImagePath)) {
                fs.writeFileSync(testImagePath, 'fake image content');
            }

            const res = await request(app)
                .post('/api/images/upload')
                .attach('image', testImagePath);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('filename');
            expect(res.body.filename).toContain('/api/images/');
        });

        it('should return 400 if no file is uploaded', async () => {
            const res = await request(app)
                .post('/api/images/upload');

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Bad request');
        });
    });

    describe('GET /api/images/:id', () => {
        it('should return an uploaded file', async () => {
            const testFileName = 'dummy.txt';
            const testFilePath = path.join(uploadsDir, testFileName);
            fs.writeFileSync(testFilePath, 'hello world');

            const res = await request(app).get(`/api/images/${testFileName}`);

            expect(res.status).toBe(200);
            expect(res.text).toBe('hello world');
        });
    });

    describe('DELETE /api/images/:id', () => {
        it('should delete an existing file', async () => {
            const testFileName = 'delete-me.txt';
            const testFilePath = path.join(uploadsDir, testFileName);
            fs.writeFileSync(testFilePath, 'to be deleted');

            const res = await request(app).delete(`/api/images/${testFileName}`);

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('File deleted successfully');
            expect(fs.existsSync(testFilePath)).toBe(false);
        });

        it('should return 404 for non-existent file', async () => {
            const res = await request(app).delete('/api/images/non-existent-file.jpg');

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('File not found');
        });
    });
});

