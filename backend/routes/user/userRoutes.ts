import express, { Response } from 'express'
import userService from '../../services/userService';
import AppError from '../../utils/AppError';
import { UserDto } from '../../types/models/user.dto';
import authenticateUser from '../../middlewares/authenticateUser';
import AuthRequest from '../../types/models/authRequest.dto';

const router = express.Router();

router.get('/api/users/profile', [authenticateUser], async (req: AuthRequest, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError("User id not found in request", 400)
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
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ message: error.message });
        }

        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
});
export default router
