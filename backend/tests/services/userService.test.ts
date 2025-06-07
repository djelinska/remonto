import { Types } from 'mongoose';
import userService from '../../services/userService';
import UserModel from '../../models/userModel';
import ProjectModel from '../../models/projectModel';
import TaskModel from '../../models/taskModel';
import MaterialModel from '../../models/materialModel';
import ToolModel from '../../models/toolModel';
import { mockUserDto } from '../mockData/mockUser';
import { UserTypes } from '../../types/enums/user-types';
import { comparePassword, encryptPassword } from '../../utils/validation';
import AppError from '../../utils/AppError';

jest.mock('../../models/userModel');
jest.mock('../../models/projectModel');
jest.mock('../../models/taskModel');
jest.mock('../../models/materialModel');
jest.mock('../../models/toolModel');
jest.mock('../../utils/validation');

describe('userService', () => {
    const mockUserId = mockUserDto._id.toString();
    const mockProjectId = new Types.ObjectId();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('fetchUserProfile', () => {
        it('should return user profile', async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue(mockUserDto);

            const result = await userService.fetchUserProfile(mockUserId);

            expect(result).toEqual(mockUserDto);
            expect(UserModel.findById).toHaveBeenCalledWith(new Types.ObjectId(mockUserId));
        });

        it('should throw error when user not found', async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue(null);

            await expect(userService.fetchUserProfile(mockUserId))
                .rejects
                .toThrow('User not found');
        });
    });

    describe('fetchAllUserData', () => {
        it('should return empty arrays when no projects found', async () => {
            (ProjectModel.find as jest.Mock).mockImplementation(() => ({
                select: jest.fn().mockReturnValue({
                    lean: jest.fn().mockResolvedValue([])
                })
            }));

            const result = await userService.fetchAllUserData(mockUserId);

            expect(result).toEqual({
                tasks: [],
                materials: [],
                tools: []
            });
        });
    });

    describe('deleteUserProfile', () => {
        it('should delete user and all related data', async () => {
            const mockProjects = [{
                _id: mockProjectId,
                userId: mockUserDto._id
            }];

            (UserModel.findById as jest.Mock).mockResolvedValue(mockUserDto);
            (ProjectModel.find as jest.Mock).mockResolvedValue(mockProjects);
            (TaskModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 1 });
            (MaterialModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 1 });
            (ToolModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 1 });
            (ProjectModel.deleteMany as jest.Mock).mockResolvedValue({ deletedCount: 1 });
            (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUserDto);

            await userService.deleteUserProfile(mockUserId);

            expect(UserModel.findById).toHaveBeenCalledWith(new Types.ObjectId(mockUserId));
            expect(ProjectModel.find).toHaveBeenCalledWith({ userId: new Types.ObjectId(mockUserId) });
            expect(TaskModel.deleteMany).toHaveBeenCalledWith({ projectId: { $in: [mockProjectId] } });
            expect(UserModel.findByIdAndDelete).toHaveBeenCalledWith(new Types.ObjectId(mockUserId));
        });

        it('should delete user with no projects', async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue(mockUserDto);
            (ProjectModel.find as jest.Mock).mockResolvedValue([]);
            (UserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUserDto);

            await userService.deleteUserProfile(mockUserId);

            expect(TaskModel.deleteMany).not.toHaveBeenCalled();
            expect(UserModel.findByIdAndDelete).toHaveBeenCalled();
        });

        it('should throw error when user not found', async () => {
            (UserModel.findById as jest.Mock).mockResolvedValue(null);

            await expect(userService.deleteUserProfile(mockUserId))
                .rejects
                .toThrow('Nie znaleziono użytkownika');
        });
    });
});