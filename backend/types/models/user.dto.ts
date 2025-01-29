import { Types } from "mongoose";
import { UserTypes } from "../enums/user-types";
export interface UserDto {
    _id: Types.ObjectId;
    firstName: string;
    lastName: string;
    password: string;
    email: string;
    type: UserTypes;
}
export type User = Omit<UserDto, "password" | '_id'> & { id: Types.ObjectId };
export type UserData = Omit<UserDto, '_id' | 'type'> 


