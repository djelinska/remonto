import express, { Response } from 'express';

import AppError from '../../utils/AppError';
import AuthRequest from '../../types/models/authRequest.dto';
import { UserDto } from '../../types/models/user.dto';
import authenticateAdmin from '../../middlewares/authenticateAdmin';
import userService from '../../services/userService';

const router = express.Router();

router.patch('/api/admin/users/:userId', [authenticateAdmin], async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
        throw new AppError('User id not found in request', 400);
    }

    try {
        const updatedUser = await userService.updateUserProfile(userId.toString(), req.body);
        res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/api/admin/users/:userId', [authenticateAdmin], async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
        throw new AppError('User id not found in request', 400);
    }

    try {
        await userService.deleteUserProfile(userId.toString());
        res.status(200).json({ message: 'Konto zostało usunięte' });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

export default router;
