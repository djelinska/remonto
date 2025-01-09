const { User } = require('../models/userModel');
const AppError = require('../utils/AppError');
const generateToken = require('../utils/generateToken');
const {
	checkPassword,
	checkEmail,
	encryptPassword,
	comparePassword,
} = require('../utils/validation');

const registerUser = async (email, firstName, lastName, password) => {
	if (!firstName || !lastName || !email || !password) {
		throw new AppError('Brak wymaganych pól', 400);
	}

	if (!checkEmail(email) || !checkPassword(password)) {
		throw new AppError('Niepoprawny format emaila lub hasła', 400);
	}

	const existingUser = await User.findOne({ email });
	if (existingUser) {
		throw new AppError('Email jest już powiązany z innym kontem', 409);
	}

	const encryptedPassword = await encryptPassword(password);

	const newUser = await User.create({
		firstName,
		lastName,
		email,
		password: encryptedPassword,
	});

	if (!newUser) {
		throw new AppError('Nie udało się zarejestrować użytkownika', 500);
	}

	return {
		id: newUser._id,
		email: newUser.email,
		firstName: newUser.firstName,
		lastName: newUser.lastName,
		type: newUser.type,
	};
};

const loginUser = async (email, password) => {
	if (!email || !password) {
		throw new AppError('Brak wymaganych pól', 400);
	}

	const user = await User.findOne({ email });
	if (!user) {
		throw new AppError('Nieprawidłowe dane logowania', 401);
	}

	const passwordsMatch = await comparePassword(password, user.password);
	if (!passwordsMatch) {
		throw new AppError('Nieprawidłowe dane logowania', 401);
	}

	const token = generateToken(user);

	return {
		token,
		user: {
			id: user._id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			type: user.type,
		},
	};
};

module.exports = { loginUser, registerUser };
