import request from 'supertest';
import express from 'express';
import userRouter from '../../routes/user/userRoutes';
import userService from '../../services/userService';
import authenticateUser from '../../middlewares/authenticateUser';
import AppError from '../../utils/AppError';

jest.mock('../../middlewares/authenticateUser');
jest.mock('../../services/userService');

const app = express();
app.use(express.json());
app.use(userRouter);

const mockUserId = '123';
(authenticateUser as jest.Mock).mockImplementation((req, res, next) => {
    req.user = { id: mockUserId, email: "mail@example.com"};
    next();
});

describe('User Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/user/profile', () => {
        it('should return user profile', async () => {
            const mockUser = {
                _id: mockUserId,
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe',
                type: 'admin',
            };

            (userService.fetchUserProfile as jest.Mock).mockResolvedValue(mockUser);

            const res = await request(app).get('/api/user/profile');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                id: mockUser._id,
                email: mockUser.email,
                firstName: mockUser.firstName,
                lastName: mockUser.lastName,
                type: mockUser.type,
            });
        });

        it('should handle server error', async () => {
            (userService.fetchUserProfile as jest.Mock).mockRejectedValue(new Error('Oops'));

            const res = await request(app).get('/api/user/profile');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'Server error');
        });
    });

    describe('GET /api/user/data', () => {
        it('should return all user data', async () => {
            const mockData = { something: 'value' };
            (userService.fetchAllUserData as jest.Mock).mockResolvedValue(mockData);

            const res = await request(app).get('/api/user/data');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockData);
        });
    });

    describe('PATCH /api/user/profile', () => {
        it('should update user profile if currentPassword is valid', async () => {
            (userService.checkAllowedOperation as jest.Mock).mockResolvedValue(true);
            const updatedUser = { email: 'new@example.com' };
            (userService.updateUserProfile as jest.Mock).mockResolvedValue(updatedUser);

            const res = await request(app)
                .patch('/api/user/profile')
                .send({ currentPassword: 'password', email: 'new@example.com' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(updatedUser);
        });

        it('should return 401 if password check fails', async () => {
            (userService.checkAllowedOperation as jest.Mock).mockResolvedValue(false);

            const res = await request(app)
                .patch('/api/user/profile')
                .send({ currentPassword: 'wrongpassword' });
            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message');
        });
    });

    describe('PATCH /api/user/changePassword', () => {
        it('should change user password', async () => {
            const updatedUser = { email: 'reset@example.com' };
            (userService.resetUserPassword as jest.Mock).mockResolvedValue(updatedUser);

            const res = await request(app)
                .patch('/api/user/changePassword')
                .send({ oldPassword: 'oldpass123', newPassword: 'newpass123' });
            expect(res.status).toBe(200);
            expect(res.body).toEqual(updatedUser);
        });

        it('should return 400 if password is missing', async () => {
            const res = await request(app)
                .patch('/api/user/changePassword')
                .send({ newPassword: "newpass123" });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Passwords not found in request');
        });
    });

    describe('DELETE /api/user/profile', () => {
        it('should delete user profile', async () => {
            (userService.deleteUserProfile as jest.Mock).mockResolvedValue(true);

            const res = await request(app).delete('/api/user/profile');

            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Konto zostało usunięte' });
        });

        it('should handle deletion errors', async () => {
            (userService.deleteUserProfile as jest.Mock).mockRejectedValue(new Error('Delete error'));

            const res = await request(app).delete('/api/user/profile');

            expect(res.status).toBe(500);
            expect(res.body).toHaveProperty('message', 'Server error');
        });
    });
});

