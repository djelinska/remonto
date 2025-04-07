// test/upload.test.ts
import express, { Request, Response } from 'express';
import request from 'supertest';
import fs from 'fs';
import path from 'path';
import { upload } from '../utils/Multer'; // adjust path

const app = express();
const uploadsDir = path.join(process.cwd(), 'uploads');

// Set up a test route that uses the multer middleware
app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  res.status(200).json({ filename: req.file?.filename });
});

describe('Multer Upload', () => {
  afterAll(() => {
    // Clean up uploaded files after tests
    if (fs.existsSync(uploadsDir)) {
      fs.readdirSync(uploadsDir).forEach(file => {
        fs.unlinkSync(path.join(uploadsDir, file));
      });
    }
  });

  it('should upload a valid image file', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', Buffer.from('fake image data'), {
        filename: 'test-image.jpg',
        contentType: 'image/jpeg'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.filename).toMatch(/\.jpg$/);

    const uploadedFilePath = path.join(uploadsDir, res.body.filename);
    expect(fs.existsSync(uploadedFilePath)).toBe(true);
  });

  it('should reject non-image file types', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', Buffer.from('not an image'), {
        filename: 'test.txt',
        contentType: 'text/plain'
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.filename).toBeUndefined(); // multer skipped the file
  });

  it('should reject files larger than 2MB', async () => {
    const largeBuffer = Buffer.alloc(2 * 1024 * 1024 + 1); // just over 2MB

    const res = await request(app)
      .post('/upload')
      .attach('file', largeBuffer, {
        filename: 'large-image.jpg',
        contentType: 'image/jpeg'
      });

    expect(res.statusCode).toBe(500); // multer throws error, Express returns 500
  });
});

