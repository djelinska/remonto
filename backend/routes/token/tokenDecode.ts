import express, { Response } from 'express'
import { checkTokenValidity } from '../../utils/validation';
import jwt, { JwtPayload } from 'jsonwebtoken'
import { User } from '../../types/models/user.dto';
import TokenRequest from '../../types/models/tokenRequest.dto';
const router = express.Router();
router.post("/api/token/decode", async (req: TokenRequest, res: Response) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res
                .status(400)
                .json({ message: "Token not provided in request body" });
        }
        if (!checkTokenValidity(token)) {
            return res.status(400).json({ message: "Token is invalid" });
        }

        const data: JwtPayload | string | null = jwt.decode(token);
        if (!data) {
            return res
                .status(400)
                .json({ message: "Could not decode data from token" });
        }
        res.json({
            message: "Token decoded success",
            data: data as User,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router
