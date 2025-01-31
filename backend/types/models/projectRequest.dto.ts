import { ProjectData, ProjectNoteData } from './project.dto';

import { Request } from 'express';
import { User } from './user.dto';

export interface ProjectRequest extends Request {
	user?: User;
	params: {
		projectId?: string;
		noteId?: string;
	};
}
export interface PostProjectRequest extends ProjectRequest {
	body: ProjectData;
}
