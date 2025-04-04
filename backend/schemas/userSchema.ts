import {checkEmail, checkPassword, checkUserType} from '../utils/validation';

import {Schema} from 'mongoose';
import {UserDto} from '../types/models/user.dto';
import {UserTypes} from '../types/enums/user-types';

const userSchema = new Schema<UserDto>({
	firstName: {
		type: String,
		required: true,
		minLength: 3,
		maxLength: 50,
	},
	lastName: {
		type: String,
		required: true,
		minLength: 3,
		maxLength: 50,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		validate: {
			validator: checkEmail,
			message: (props: any) => `${props.value} is not a valid email`,
		},
	},
	type: {
		type: String,
		enum: ['USER', 'ADMIN'],
		default: UserTypes.USER,
		validate: {
			validator: checkUserType,
			message: (props: any) => `${props.value} is not a valid user type`,
		},
	},
});

export default userSchema;
