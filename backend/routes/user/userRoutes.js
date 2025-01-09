const express = require('express');
const authenticateUser = require('../../middlewares/authenticateUser');
const userService = require('../../services/userService');
const AppError = require('../../utils/AppError');

const router = express.Router();

router.get('/api/users/profile', authenticateUser, async (req, res) => {
	const userId = req.user.id;

	try {
		const user = await userService.fetchUserProfile(userId);

		res.status(200).json({
			id: user.id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			type: user.type,
		});
	} catch (error) {
		if (error instanceof AppError) {
			return res.status(error.statusCode).json({ message: error.message });
		}

		console.error(error);
		return res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
