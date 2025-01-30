import { Request } from "express"
import { User, UserData } from "./user.dto"
export default interface AuthRequest extends Request {
    user?: User
}
export interface RegisterRequest extends Request {
    body: UserData
}
export interface LoginRequest extends Request {
    body: {
        email: string;
        password: string;
    }
}
