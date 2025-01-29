import { User } from './user.dto'
import { TaskData } from './task.dto';
import { Request } from "express"
export interface TaskRequest extends Request {
    user?: User;
    params: {
        projectId?: string;
        taskId?: string;
    }
}
export interface PostTaskRequest extends TaskRequest{
    body: TaskData;
}
