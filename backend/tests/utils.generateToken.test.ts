import generateToken from '../utils/generateToken'; // adjust path as needed
import jwt from 'jsonwebtoken';
import { UserDto } from '../types/models/user.dto';
import { UserTypes } from '../types/enums/user-types';
import { Types } from 'mongoose';

describe('generateToken', () => {
    const id = new Types.ObjectId()
    const mockUser: UserDto = {
        _id: id,
        password: "123",
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        type: UserTypes.USER
    };

    const secretKey = 'test-secret-key';

    beforeAll(() => {
        process.env.SECRETKEY = secretKey;
    });

    it('should generate a valid JWT with correct payload', () => {
        const token = generateToken(mockUser);

        const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;

        expect(decoded).toMatchObject({
            id: mockUser._id.toString(),
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            email: mockUser.email,
            type: mockUser.type,
        });

        expect(decoded.exp).toBeDefined(); // check that expiration exists
        expect(decoded.iat).toBeDefined(); // check that issued at exists
    });
});

