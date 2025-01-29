import { JwtPayload } from "jsonwebtoken";
import { User, UserDto } from "../types/models/user.dto";
import jwt from 'jsonwebtoken'

export default function generateToken(user: UserDto): string {
    const payload: JwtPayload = {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        type: user.type,
    };
    // 7 days -> 7days*24h*60min*60sec
    const expiresIn = 7 * 24 * 60 * 60;
    const token: string = jwt.sign(payload, process.env.SECRETKEY as jwt.Secret, { expiresIn });
    return token;
}
