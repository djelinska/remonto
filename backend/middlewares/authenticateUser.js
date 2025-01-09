const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
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
		const decoded = jwt.verify(token, process.env.SECRETKEY);

		// Attach user data to the request object
		req.user = decoded;

		next();
	} catch (error) {
		console.error('Authentication error:', error.message);
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

module.exports = authenticateUser;
