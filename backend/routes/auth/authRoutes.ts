import express, { Response } from 'express'
import {RegisterRequest, LoginRequest} from '../../types/models/authRequest.dto';
import authService from '../../services/authService';
import AppError from '../../utils/AppError';
import validateUserData from '../../middlewares/validateUser';

const router = express.Router();

router.post('/api/register', [validateUserData], async (req: RegisterRequest, res: Response) => {
    const { email, firstName, lastName, password } = req.body;

    try {
        const user = await authService.registerUser(
            email,
            firstName,
            lastName,
            password
        );

        res.status(201).json({
            message: 'Użytkownik zarejestrowany pomyślnie',
            user,
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        res.status(500).json({ message: 'Błąd serwera' });
    }
});

router.post('/api/login', async (req: LoginRequest, res: Response) => {
    const { email, password } = req.body;

    try {
        const { user, token } = await authService.loginUser(email, password);

        res.json({
            message: 'Użytkownik zalogowany pomyślnie',
            user,
            token,
        });
    } catch (error) {
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        res.status(500).json({ message: 'Błąd serwera' });
    }
});

export default router
