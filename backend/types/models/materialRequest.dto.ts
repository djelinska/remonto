import { Request } from "express"
import { MaterialData } from "./material.dto";
import { User } from "./user.dto";
export interface MaterialRequest extends Request {
    user?: User;
    params: {
        materialId?: string;
        projectId?: string;
        taskId?: string;
    }
}
export interface PostMaterialRequest extends MaterialRequest{
    body: MaterialData;
}
