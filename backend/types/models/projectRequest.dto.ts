import { Request } from "express"
import { User } from "./user.dto";
import { ProjectData } from "./project.dto";
export interface ProjectRequest extends Request {
    user?: User;
    params: {
        projectId?: string;
    }
}
export interface PostProjectRequest extends ProjectRequest{
    body: ProjectData;
}
