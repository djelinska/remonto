import jwt, { JwtPayload } from 'jsonwebtoken'
import { Response, NextFunction } from 'express';
import { User } from '../types/models/user.dto';
import AuthRequest from '../types/models/authRequest.dto';

const authenticateUser = (req: AuthRequest, res: Response, next: NextFunction) => {
	try {
		// Get token from the 'Authorization' header (format: Bearer <token>)
		const authHeader = req.headers['authorization'];

		if (!authHeader) {
			return res
				.status(401)
				.json({ message: 'Authorization header is missing' });
		}

		// Extract token from "Bearer <token>" format
		const token = authHeader.split(' ')[1];

		if (!token) {
			return res
				.status(401)
				.json({ message: 'Authentication token is missing' });
		}

		// Verify the token
		const decoded: string | JwtPayload = jwt.verify(token, process.env.SECRETKEY as jwt.Secret);

		// Attach user data to the request object
		req.user = decoded as User;

		next();
	} catch (error: any) {
		console.error('Authentication error:', error.message);
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

export default authenticateUser
