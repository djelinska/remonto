import fs from 'fs';
import path from 'path';
import { deleteFileByUrl } from '../utils/fileUtils'; // adjust path as needed

const uploadsDir = path.join(process.cwd(), 'uploads');

describe('deleteFileByUrl', () => {
  const testFilename = 'test-file.txt';
  const testFilePath = path.join(uploadsDir, testFilename);
  const testFileUrl = `./uploads/${testFilename}`;

  beforeAll(() => {
    // Ensure uploads dir exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir);
    }

    // Create test file
    fs.writeFileSync(testFilePath, 'Hello, world!');
  });

  it('should delete the file and return true', () => {
    const result = deleteFileByUrl(testFileUrl);
    expect(result).toBe(true);
    expect(fs.existsSync(testFilePath)).toBe(false);
  });

  it('should return false if file does not exist', () => {
    const result = deleteFileByUrl('/uploads/non-existent-file.txt');
    expect(result).toBe(false);
  });

  it('should return false if URL is malformed or empty', () => {
    expect(deleteFileByUrl('')).toBe(false);
    expect(deleteFileByUrl('/uploads/')).toBe(false);
  });
});

