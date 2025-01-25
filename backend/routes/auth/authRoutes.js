const express = require('express');
const authService = require('../../services/authService');
const AppError = require('../../utils/AppError');
const validateUserData = require('../../middlewares/validateUser');

const router = express.Router();

router.post('/api/register', [validateUserData], async (req, res) => {
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

        console.error(error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

router.post('/api/login', async (req, res) => {
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

        console.error(error);
        res.status(500).json({ message: 'Błąd serwera' });
    }
});

module.exports = router;
