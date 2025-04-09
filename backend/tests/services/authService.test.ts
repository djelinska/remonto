import UserModel from '../../models/userModel';
import authService from '../../services/authService';
import { 
  mockUserDto, 
  mockUser, 
  validUserRegistrationData,
} from '../mockData/mockUser';
import AppError from '../../utils/AppError';
import { checkEmail, checkPassword, comparePassword, encryptPassword } from '../../utils/validation';
import generateToken from '../../utils/generateToken';

jest.mock('../../models/userModel');
jest.mock('../../utils/validation');
jest.mock('../../utils/generateToken');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (checkEmail as jest.Mock).mockReturnValue(true);
    (checkPassword as jest.Mock).mockReturnValue(true);
  });

  describe('registerUser', () => {
    it('should register a new user with valid data', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (encryptPassword as jest.Mock).mockResolvedValue('hashedPassword');
      (UserModel.create as jest.Mock).mockResolvedValue(mockUserDto);

      const result = await authService.registerUser(
        validUserRegistrationData.email,
        validUserRegistrationData.firstName,
        validUserRegistrationData.lastName,
        validUserRegistrationData.password
      );

      expect(result).toEqual(mockUser);
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: validUserRegistrationData.email });
      expect(encryptPassword).toHaveBeenCalledWith(validUserRegistrationData.password);
      expect(UserModel.create).toHaveBeenCalledWith({
        firstName: validUserRegistrationData.firstName,
        lastName: validUserRegistrationData.lastName,
        email: validUserRegistrationData.email,
        password: 'hashedPassword'
      });
    });

    it('should throw error when required fields are missing', async () => {
      await expect(authService.registerUser('', '', '', ''))
        .rejects
        .toThrow(new AppError('Brak wymaganych pól', 400));
    });

    it('should throw error for invalid email format', async () => {
      (checkEmail as jest.Mock).mockReturnValue(false);
      
      await expect(authService.registerUser(
        'invalid-email',
        validUserRegistrationData.firstName,
        validUserRegistrationData.lastName,
        validUserRegistrationData.password
      )).rejects.toThrow(new AppError('Niepoprawny format emaila lub hasła', 400));
    });

    it('should throw error for invalid password', async () => {
      (checkPassword as jest.Mock).mockReturnValue(false);
      
      await expect(authService.registerUser(
        validUserRegistrationData.email,
        validUserRegistrationData.firstName,
        validUserRegistrationData.lastName,
        'weak'
      )).rejects.toThrow(new AppError('Niepoprawny format emaila lub hasła', 400));
    });

    it('should throw error when email already exists', async () => {
      (checkEmail as jest.Mock).mockReturnValue(true);
      (checkPassword as jest.Mock).mockReturnValue(true);
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUserDto);
      
      await expect(authService.registerUser(
        validUserRegistrationData.email,
        validUserRegistrationData.firstName,
        validUserRegistrationData.lastName,
        validUserRegistrationData.password
      )).rejects.toThrow(new AppError('Email jest już powiązany z innym kontem', 409));
    });

    it('should throw error when user creation fails', async () => {
      (checkEmail as jest.Mock).mockReturnValue(true);
      (checkPassword as jest.Mock).mockReturnValue(true);
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      (UserModel.create as jest.Mock).mockResolvedValue(null);
      
      await expect(authService.registerUser(
        validUserRegistrationData.email,
        validUserRegistrationData.firstName,
        validUserRegistrationData.lastName,
        validUserRegistrationData.password
      )).rejects.toThrow(new AppError('Nie udało się zarejestrować użytkownika', 500));
    });
  });

  describe('loginUser', () => {
    it('should login user with valid credentials', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUserDto);
      (comparePassword as jest.Mock).mockResolvedValue(true);
      (generateToken as jest.Mock).mockReturnValue('mockToken');

      const result = await authService.loginUser(
        mockUserDto.email,
        'correctPassword'
      );

      expect(result).toEqual({
        token: 'mockToken',
        user: mockUser
      });
      expect(UserModel.findOne).toHaveBeenCalledWith({ email: mockUserDto.email });
      expect(comparePassword).toHaveBeenCalledWith('correctPassword', mockUserDto.password);
      expect(generateToken).toHaveBeenCalledWith(mockUserDto);
    });

    it('should throw error when email or password is missing', async () => {
      await expect(authService.loginUser('', ''))
        .rejects
        .toThrow(new AppError('Brak wymaganych pól', 400));
    });

    it('should throw error when user is not found', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(null);
      
      await expect(authService.loginUser(
        'nonexistent@example.com',
        'somePassword'
      )).rejects.toThrow(new AppError('Nieprawidłowe dane logowania', 401));
    });

    it('should throw error when password is incorrect', async () => {
      (UserModel.findOne as jest.Mock).mockResolvedValue(mockUserDto);
      (comparePassword as jest.Mock).mockResolvedValue(false);
      
      await expect(authService.loginUser(
        mockUserDto.email,
        'wrongPassword'
      )).rejects.toThrow(new AppError('Nieprawidłowe dane logowania', 401));
    });
  });
});