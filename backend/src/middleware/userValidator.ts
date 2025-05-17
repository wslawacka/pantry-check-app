import { body } from 'express-validator';
import { User } from '../models/user';

const usernameRegex = /^[a-zA-Z0-9_]+$/;

export const registerValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .isLength({ max: 20 }).withMessage('Username must be at most 20 characters long')
        .matches(usernameRegex).withMessage('Username can only contain letters, numbers and underscores')
        .custom(async (username: string) => {
            const existingUser = await User.findOne({ username: username.toLowerCase() });
            if (existingUser) {
                throw new Error('Username already taken');
            }
        }),
    body('email')
        .trim()
        .normalizeEmail()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .custom(async (email: string) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new Error('Email already registered');
            }
        }),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }).withMessage('Password must include uppercase, lowercase, number and symbol')

];

export const loginValidation = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .custom(async (username: string) => {
            const existingUser = await User.findOne({ username: username.toLowerCase() });
            if (!existingUser) {
                throw new Error('User does not exist');
            }
        }),
    body('password')
        .notEmpty().withMessage('Password is required')
];