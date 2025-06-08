import { Types } from 'mongoose';
import userService from '../../services/userService';
import UserModel from '../../models/userModel';
import ProjectModel from '../../models/projectModel';
import TaskModel from '../../models/taskModel';
import MaterialModel from '../../models/materialModel';
import ToolModel from '../../models/toolModel';
import { mockUserDto } from '../mockData/mockUser';
import { UserTypes } from '../../types/enums/user-types';
import { comparePassword, encryptPassword, checkEmail, checkPassword } from '../../utils/validation';
import AppError from '../../utils/AppError';

jest.mock('../../models/userModel');
jest.mock('../../models/projectModel');
jest.mock('../../models/taskModel');
jest.mock('../../models/materialModel');
jest.mock('../../models/toolModel');
jest.mock('../../utils/validation', () => ({
    ...jest.requireActual('../../utils/validation'),
    checkEmail: jest.fn(),
    checkPassword: jest.fn(),
    encryptPassword: jest.fn(),
    comparePassword: jest.fn()
}));

describe('userService', () => {
    const mockUserId = mockUserDto._id.toString();
    const mockProjectId = new Types.ObjectId();

    beforeEach(() => {
        jest.clearAllMocks();
        (checkEmail as jest.Mock).mockImplementation((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        (checkPassword as jest.Mock).mockImplementation((pass) => pass.length >= 8 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /\d/.test(pass) && /[!@#$%^&*]/.test(pass));
        (encryptPassword as jest.Mock).mockResolvedValue('$hashedPassword123');
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
                .toThrow('Nie znaleziono użytkownika');
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

    describe('updateUserProfile', () => {
    const validMockUser = { 
        ...mockUserDto,
        email: 'valid@example.com',
        firstName: 'Updated' 
    };

    const validPassword = 'ValidPass123!';
    const invalidPassword = 'weak';
    const invalidEmail = 'invalid-email';

    beforeEach(() => {
        jest.clearAllMocks();
        (checkEmail as jest.Mock).mockImplementation((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        (checkPassword as jest.Mock).mockImplementation((pass) => pass.length >= 8 && /[A-Z]/.test(pass) && /[a-z]/.test(pass) && /\d/.test(pass) && /[!@#$%^&*]/.test(pass));
        (encryptPassword as jest.Mock).mockResolvedValue('$hashedPassword123');
    });

    it('should reject invalid email format', async () => {
        (checkEmail as jest.Mock).mockReturnValueOnce(false);
        
        await expect(userService.updateUserProfile(
            mockUserId, 
            { email: invalidEmail }
        )).rejects.toThrow('Nieprawidłowy format emaila');
    });

    it('should reject weak passwords', async () => {
        (checkPassword as jest.Mock).mockReturnValueOnce(false);
        
        await expect(userService.updateUserProfile(
            mockUserId, 
            { password: invalidPassword }
        )).rejects.toThrow('Hasło musi mieć co najmniej 8 znaków');
    });

    it('should handle database errors', async () => {
        (UserModel.findByIdAndUpdate as jest.Mock).mockImplementation(() => {
            throw new Error('Database error');
        });

        await expect(userService.updateUserProfile(
            mockUserId, 
            { firstName: 'Updated' }
        )).rejects.toThrow('Database error');
    });

    it('should normalize email to lowercase', async () => {
        const mockExec = jest.fn().mockResolvedValue(validMockUser);
        const mockLean = jest.fn().mockReturnValue({ exec: mockExec });
        const mockSelect = jest.fn().mockReturnValue({ lean: mockLean });
        
        (UserModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
            select: mockSelect,
            lean: mockLean
        });
        (UserModel.findOne as jest.Mock).mockResolvedValue(null);

        const result = await userService.updateUserProfile(
            mockUserId, 
            { email: 'VALID@example.com' }
        );

        expect(UserModel.findByIdAndUpdate).toHaveBeenCalledWith(
            new Types.ObjectId(mockUserId),
            { $set: { email: 'valid@example.com' } },
            { new: true }
        );
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