import request from 'supertest';
import express from 'express';
import authRoutes from '../../routes/auth/authRoutes';
import authService from '../../services/authService';
import validateUserData from '../../middlewares/validateUser';
import AppError from '../../utils/AppError';

jest.mock('../../services/authService');
jest.mock('../../middlewares/validateUser', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use(authRoutes);

describe('Auth Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/register', () => {
    it('should register a user and return 201', async () => {
      const mockUser = { email: 'test@example.com', firstName: 'John', lastName: 'Doe', _id: '123' };
      (authService.registerUser as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).post('/api/register').send({
        email: 'test@example.com',
        password: 'pass123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('message', 'Użytkownik zarejestrowany pomyślnie');
      expect(res.body).toHaveProperty('user');
      expect(authService.registerUser).toHaveBeenCalledWith(
        'test@example.com',
        'John',
        'Doe',
        'pass123'
      );
    });

    it('should handle AppError properly', async () => {
      (authService.registerUser as jest.Mock).mockRejectedValue(new AppError('User already exists', 409));

      const res = await request(app).post('/api/register').send({
        email: 'test@example.com',
        password: 'pass123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(res.statusCode).toBe(409);
      expect(res.body).toHaveProperty('message', 'User already exists');
    });

    it('should handle server error', async () => {
      (authService.registerUser as jest.Mock).mockRejectedValue(new Error('Database crash'));

      const res = await request(app).post('/api/register').send({
        email: 'test@example.com',
        password: 'pass123',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('message', 'Błąd serwera');
    });
  });

  describe('POST /api/login', () => {
    it('should login a user and return token', async () => {
      const mockUser = { email: 'test@example.com', _id: '123', firstName: 'Jane' };
      const mockToken = 'fake.jwt.token';
      (authService.loginUser as jest.Mock).mockResolvedValue({ user: mockUser, token: mockToken });

      const res = await request(app).post('/api/login').send({
        email: 'test@example.com',
        password: 'pass123',
      });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Użytkownik zalogowany pomyślnie');
      expect(res.body).toHaveProperty('user');
      expect(res.body).toHaveProperty('token', mockToken);
    });

    it('should handle AppError on login failure', async () => {
      (authService.loginUser as jest.Mock).mockRejectedValue(new AppError('Invalid credentials', 401));

      const res = await request(app).post('/api/login').send({
        email: 'test@example.com',
        password: 'wrongpass',
      });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should handle unexpected errors', async () => {
      (authService.loginUser as jest.Mock).mockRejectedValue(new Error('Something bad'));

      const res = await request(app).post('/api/login').send({
        email: 'test@example.com',
        password: 'pass123',
      });

      expect(res.statusCode).toBe(500);
      expect(res.body).toHaveProperty('message', 'Błąd serwera');
    });
  });
});

