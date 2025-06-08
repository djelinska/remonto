import UserModel from "../models/userModel";
import { User, UserDto } from "../types/models/user.dto";
import AppError from "../utils/AppError";
import generateToken from "../utils/generateToken";
import { checkEmail, checkPassword, comparePassword, encryptPassword } from "../utils/validation";

export const registerUser = async (email: string, firstName: string, lastName: string, password: string): Promise<User> => {
    if (!firstName || !lastName || !email || !password) {
        throw new AppError('Brak wymaganych pól', 400);
    }

    const normalizedEmail = email.toLowerCase();

    if (!checkEmail(normalizedEmail) || !checkPassword(password)) {
        throw new AppError('Niepoprawny format emaila lub hasła', 400);
    }

    const existingUser: UserDto | null = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
        throw new AppError('Email jest już powiązany z innym kontem', 409);
    }

    const encryptedPassword = await encryptPassword(password);

    const newUser = await UserModel.create({
        firstName,
        lastName,
        email,
        password: encryptedPassword,
    });

    if (!newUser) {
        throw new AppError('Nie udało się zarejestrować użytkownika', 500);
    }

    return {
        id: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        type: newUser.type,
    };
};

export const loginUser = async (email: string, password: string): Promise<{ token: string, user: User }> => {
    if (!email || !password) {
        throw new AppError('Brak wymaganych pól', 400);
    }

    const normalizedEmail = email.toLowerCase();

    const user: UserDto | null = await UserModel.findOne({ email: normalizedEmail });
    if (!user) {
        throw new AppError('Nieprawidłowe dane logowania', 401);
    }

    const passwordsMatch: boolean = await comparePassword(password, user.password);
    if (!passwordsMatch) {
        throw new AppError('Nieprawidłowe dane logowania', 401);
    }

    const token = generateToken(user);

    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            type: user.type,
        },
    };
};
const authService = { loginUser: loginUser, registerUser: registerUser }
export default authService
