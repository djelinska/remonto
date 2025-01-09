const mongoose = require('mongoose');
const { userSchema } = require('../schemas/userSchema');

const User = mongoose.model('Users', userSchema, 'users');

module.exports = {
	User,
};
