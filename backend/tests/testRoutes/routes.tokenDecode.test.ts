import request from 'supertest';
import express from 'express';
import decodeRouter from '../../routes/token/tokenDecode'; // adjust path accordingly
import * as validationUtils from '../../utils/validation';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());
app.use(decodeRouter);

jest.mock('../../utils/validation');
jest.mock('jsonwebtoken');

describe('POST /api/token/decode', () => {
  const mockUser = { id: '123', email: 'test@example.com' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if token is not provided', async () => {
    const res = await request(app).post('/api/token/decode').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Token not provided in request body');
  });

  it('should return 400 if token is invalid', async () => {
    (validationUtils.checkTokenValidity as jest.Mock).mockReturnValue(false);

    const res = await request(app).post('/api/token/decode').send({ token: 'fake-token' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Token is invalid');
  });

  it('should return 400 if token cannot be decoded', async () => {
    (validationUtils.checkTokenValidity as jest.Mock).mockReturnValue(true);
    (jwt.decode as jest.Mock).mockReturnValue(null);

    const res = await request(app).post('/api/token/decode').send({ token: 'fake-token' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Could not decode data from token');
  });

  it('should return 200 and decoded data if token is valid', async () => {
    (validationUtils.checkTokenValidity as jest.Mock).mockReturnValue(true);
    (jwt.decode as jest.Mock).mockReturnValue(mockUser);

    const res = await request(app).post('/api/token/decode').send({ token: 'valid-token' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Token decoded success');
    expect(res.body.data).toEqual(mockUser);
  });

  it('should return 500 on unexpected error', async () => {
    (validationUtils.checkTokenValidity as jest.Mock).mockImplementation(() => {
      throw new Error('Unexpected failure');
    });

    const res = await request(app).post('/api/token/decode').send({ token: 'any-token' });
    expect(res.status).toBe(500);
    expect(res.body.message).toBe('Server error');
  });
});

