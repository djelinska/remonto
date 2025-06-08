import jwt, { JwtPayload } from 'jsonwebtoken'
import { Response, NextFunction } from 'express';
import { User } from '../types/models/user.dto';
import AuthRequest from '../types/models/authRequest.dto';

const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers['authorization'];

		if (!authHeader) {
			return res
				.status(401)
				.json({ message: 'Authorization header is missing' });
		}

		const token = authHeader.split(' ')[1];

		if (!token) {
			return res
				.status(401)
				.json({ message: 'Authentication token is missing' });
		}

		const decoded: string | JwtPayload = jwt.verify(token, process.env.SECRETKEY as jwt.Secret);

		req.user = decoded as User;

		next();
	} catch (error: any) {
		console.error('Authentication error:', error.message);
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

export default authenticateUser
