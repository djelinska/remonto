import { InferSchemaType, Model } from "mongoose";
import { UserDto } from "../types/models/user.dto";

import userSchema from "../schemas/userSchema";
import mongoose from 'mongoose';

const UserModel: Model<UserDto> = mongoose.model('Users', userSchema, 'users');
export default UserModel
