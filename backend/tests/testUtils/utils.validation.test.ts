import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import {
    checkIfCorrectId,
    checkTokenValidity,
    checkIfAdmin,
    checkTaskStatus,
    checkTaskPriority,
    checkToolsMaterialsStatus,
    checkTaskCategory,
    checkEmail,
    checkStartAndEndDate,
    checkUserType,
    checkPassword,
    comparePassword,
    encryptPassword,
} from '../../utils/validation'; // Update with your actual module path
import { User } from '../../types/models/user.dto';
import { UserTypes } from '../../types/enums/user-types';
import { TaskStatus } from '../../types/enums/task-status';
import { TaskPriority } from '../../types/enums/task-priority';
import { ElementStatus } from '../../types/enums/element-status';
import { TaskCategory } from '../../types/enums/task-category';

describe('Utility Functions', () => {
    describe('checkIfCorrectId', () => {
        it('should return true for a valid ObjectId string', () => {
            const validId = new Types.ObjectId().toString();
            expect(checkIfCorrectId(validId)).toBe(true);
        });
        it('should return false for an invalid ObjectId string', () => {
            expect(checkIfCorrectId('invalid-id')).toBe(false);
        });
    });

    describe('checkTokenValidity', () => {
        const secret = 'testsecret';
        beforeAll(() => {
            process.env.SECRETKEY = secret;
        });
        it('should return true for a valid token', () => {
            const token = jwt.sign({ data: 'test' }, secret);
            expect(checkTokenValidity(token)).toBe(true);
        });
        it('should return false for an invalid token', () => {
            expect(checkTokenValidity('invalid-token')).toBe(false);
        });
    });

    describe('checkIfAdmin', () => {
        it('should return true if user type is ADMIN', () => {
            const user = { id: new Types.ObjectId(), firstName: "", lastName: "", email: "", type: UserTypes.ADMIN };
            expect(checkIfAdmin(user)).toBe(true);
        });
        it('should return false if user type is not ADMIN', () => {
            const user = { id: new Types.ObjectId(), firstName: "", lastName: "", email: "", type: UserTypes.USER };
            expect(checkIfAdmin(user)).toBe(false);
        });
    });

    describe('checkTaskStatus', () => {
        it('should return true for valid task statuses', () => {
            expect(checkTaskStatus(TaskStatus.COMPLETED)).toBe(true);
            expect(checkTaskStatus(TaskStatus.IN_PROGRESS)).toBe(true);
            expect(checkTaskStatus(TaskStatus.NOT_STARTED)).toBe(true);
        });
        it('should return false for an invalid task status', () => {
            expect(checkTaskStatus('DELAYED' as any)).toBe(false);
        });
    });

    describe('checkTaskPriority', () => {
        it('should return true for valid task priorities', () => {
            expect(checkTaskPriority(TaskPriority.LOW)).toBe(true);
            expect(checkTaskPriority(TaskPriority.MEDIUM)).toBe(true);
            expect(checkTaskPriority(TaskPriority.HIGH)).toBe(true);
        });
        it('should return false for an invalid task priority', () => {
            expect(checkTaskPriority('URGENT' as any)).toBe(false);
        });
    });

    describe('checkToolsMaterialsStatus', () => {
        it('should return true for valid tools/materials statuses', () => {
            expect(checkToolsMaterialsStatus(ElementStatus.ORDERED)).toBe(true);
            expect(checkToolsMaterialsStatus(ElementStatus.RECEIVED)).toBe(true);
            expect(checkToolsMaterialsStatus(ElementStatus.REQUIRED)).toBe(true);
            expect(checkToolsMaterialsStatus(ElementStatus.AVAILABLE)).toBe(true);
            expect(checkToolsMaterialsStatus(ElementStatus.IN_DELIVERY)).toBe(true);
            expect(checkToolsMaterialsStatus(ElementStatus.NOT_ORDERED)).toBe(true);
            expect(checkToolsMaterialsStatus(ElementStatus.READY_FOR_PICKUP)).toBe(true);
        });
        it('should return false for an invalid tools/materials status', () => {
            expect(checkToolsMaterialsStatus('BROKEN' as any)).toBe(false);
        });
    });

    describe('checkTaskCategory', () => {
        it('should return true for valid task categories', () => {
            expect(checkTaskCategory(TaskCategory.DESIGN)).toBe(true);
            expect(checkTaskCategory(TaskCategory.CLEANUP)).toBe(true);
            expect(checkTaskCategory(TaskCategory.CARPENTRY)).toBe(true);
            expect(checkTaskCategory(TaskCategory.FINISHING)).toBe(true);
            expect(checkTaskCategory(TaskCategory.LOGISTICS)).toBe(true);
            expect(checkTaskCategory(TaskCategory.SMART_HOME)).toBe(true);
            expect(checkTaskCategory(TaskCategory.CONSTRUCTION)).toBe(true);
            expect(checkTaskCategory(TaskCategory.INSTALLATIONS)).toBe(true);
        });
        it('should return false for an invalid task category', () => {
            expect(checkTaskCategory('ARCHITECTURE' as any)).toBe(false);
        });
    });

    describe('checkEmail', () => {
        it('should return true for a valid email', () => {
            expect(checkEmail('test@example.com')).toBe(true);
        });
        it('should return false for an invalid email', () => {
            expect(checkEmail('invalid-email')).toBe(false);
        });
    });

    describe('checkStartAndEndDate', () => {
        it('should return true if start date is before end date', () => {
            const start = new Date('2020-01-01');
            const end = new Date('2020-01-02');
            expect(checkStartAndEndDate(start, end)).toBe(true);
        });
        it('should return true if start date is equal to end date', () => {
            const date = new Date('2020-01-01');
            expect(checkStartAndEndDate(date, date)).toBe(true);
        });
        it('should return false if start date is after end date', () => {
            const start = new Date('2020-01-02');
            const end = new Date('2020-01-01');
            expect(checkStartAndEndDate(start, end)).toBe(false);
        });
        it('should throw an error for an invalid date format', () => {
            expect(() => checkStartAndEndDate('invalid-date', '2020-01-01')).toThrow('Invalid date format provided.');
        });
    });

    describe('checkUserType', () => {
        it('should return true for valid user types', () => {
            expect(checkUserType(UserTypes.ADMIN)).toBe(true);
            expect(checkUserType(UserTypes.USER)).toBe(true);
        });
        it('should return false for an invalid user type', () => {
            expect(checkUserType('GUEST' as any)).toBe(false);
        });
    });

    describe('checkPassword', () => {
        it('should return true for a password that meets the criteria', () => {
            // Password must include at least one lowercase, one uppercase, one digit, one special character, and be at least 8 characters long.
            expect(checkPassword('Password1!')).toBe(true);
        });
        it('should return false for a password that does not meet the criteria', () => {
            expect(checkPassword('password')).toBe(false);
        });
    });

    describe('comparePassword and encryptPassword', () => {
        it('should correctly encrypt and validate the password', async () => {
            const password = 'Password1!';
            const hash = await encryptPassword(password);
            expect(hash).toBeDefined();
            const isMatch = await comparePassword(password, hash);
            expect(isMatch).toBe(true);
        });
        it('should return false when comparing an incorrect password', async () => {
            const password = 'Password1!';
            const wrongPassword = 'WrongPassword1!';
            const hash = await encryptPassword(password);
            const isMatch = await comparePassword(wrongPassword, hash);
            expect(isMatch).toBe(false);
        });
    });
});

