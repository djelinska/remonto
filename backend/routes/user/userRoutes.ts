import express, { Response } from 'express';

import AppError from '../../utils/AppError';
import AuthRequest, { ResetPasswordRequest } from '../../types/models/authRequest.dto';
import { UserDto } from '../../types/models/user.dto';
import authenticateUser from '../../middlewares/authenticateUser';
import userService from '../../services/userService';

const router = express.Router();

router.get('/api/user/profile', [authenticateUser], async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError('User id not found in request', 400);
    }

    try {
        const user: UserDto = await userService.fetchUserProfile(userId.toString());

        res.status(200).json({
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            type: user.type,
        });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});

router.get('/api/user/data', [authenticateUser], async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError('User id not found in request', 400);
    }

    try {
        const data = await userService.fetchAllUserData(userId.toString());
        res.status(200).json(data);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});
router.patch('/api/user/profile', [authenticateUser], async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError('User id not found in request', 400);
    }
    try {
        const isAccOwner = await userService.checkAllowedOperation(req.body.currentPassword, userId)
        if (!isAccOwner) {
            throw new AppError('User unauthorized to change data', 401);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(401).json({ message: 'User unauthorized to change data' });
    }


    try {
        const updatedUser = await userService.updateUserProfile(userId.toString(), req.body);
        res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});
router.patch('/api/user/profile/changePassword', [authenticateUser], async (req: ResetPasswordRequest, res: Response) => {
    const { oldPassword, newPassword } = req.body
    try {
        if (!oldPassword || !newPassword || !req.user?.email) {
            throw new AppError('Passwords not found in request', 400);
        }
    } catch (error: any) {
        console.error(error);
        return res.status(400).json({ message: 'Passwords not found in request' });
    }

    try {
        const updatedUser = await userService.resetUserPassword(req.user.email, oldPassword, newPassword);
        res.status(200).json(updatedUser);
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Old password does not match current password' });
    }
});

router.delete('/api/user/profile', [authenticateUser], async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
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
