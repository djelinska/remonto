import { Types } from "mongoose";
import { UserDto } from "../types/models/user.dto";
import UserModel from "../models/userModel";
import AppError from "../utils/AppError";

const fetchUserProfile = async (userId: string): Promise<UserDto> => {
    const user: UserDto | null = await UserModel.findById(new Types.ObjectId(userId));
    if (!user) {
        throw new AppError('User not found', 404);
    }

    return user;
};
const userService = {
    fetchUserProfile: fetchUserProfile
}
export default userService
