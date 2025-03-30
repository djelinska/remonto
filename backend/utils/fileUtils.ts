import path from 'path';
import fs from 'fs';

const uploadsDir = path.join(process.cwd(), 'uploads');

export const deleteFileByUrl = (fileUrl: string) => {
    try {
        const filename = fileUrl.split('/').pop();
        if (!filename) {
            return false;
        }

        const filePath = path.join(uploadsDir, filename);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}