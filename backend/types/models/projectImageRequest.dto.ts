import { ProjectData, ProjectNoteData } from './project.dto';

import { Request } from 'express';
import { User } from './user.dto';

export interface ProjectImageRequest extends Request {
    user?: User;
    params: {
        projectId: string;
        imageUrl: string;
    };
}