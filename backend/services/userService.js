const { User } = require('../models/userModel');
const AppError = require('../utils/AppError');

const fetchUserProfile = async (userId) => {
	const user = await User.findById(userId);
	if (!user) {
		throw new AppError('User not found');
	}

	return user;
};

module.exports = { fetchUserProfile };
