"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const user_1 = require("../models/user");
const usernameRegex = /^[a-zA-Z0-9_]+$/;
exports.registerValidation = [
    (0, express_validator_1.body)('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .isLength({ max: 20 }).withMessage('Username must be at most 20 characters long')
        .matches(usernameRegex).withMessage('Username can only contain letters, numbers and underscores')
        .custom(async (username) => {
        const existingUser = await user_1.User.findOne({ username: username.toLowerCase() });
        if (existingUser) {
            throw new Error('Username already taken');
        }
    }),
    (0, express_validator_1.body)('email')
        .trim()
        .normalizeEmail()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .custom(async (email) => {
        const existingUser = await user_1.User.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }
    }),
    (0, express_validator_1.body)('password')
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
exports.loginValidation = [
    (0, express_validator_1.body)('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .custom(async (username) => {
        const existingUser = await user_1.User.findOne({ username: username.toLowerCase() });
        if (!existingUser) {
            throw new Error('User does not exist');
        }
    }),
    (0, express_validator_1.body)('password')
        .notEmpty().withMessage('Password is required')
];
