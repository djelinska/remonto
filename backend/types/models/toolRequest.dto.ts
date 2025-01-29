import { User } from './user.dto';
import { ToolData } from './tool.dto';
import { Request } from 'express'
export interface ToolRequest extends Request {
    user?: User
    params: {
        projectId?: string;
        toolId?: string;
    }
}
export interface PostToolRequest extends ToolRequest {
    body: ToolData
}
