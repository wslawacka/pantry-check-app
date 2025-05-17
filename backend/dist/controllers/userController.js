"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const user_1 = require("../models/user");
async function registerUser(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { username, email, password } = req.body;
        const salt = await bcryptjs_1.default.genSalt(12);
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newUser = new user_1.User({
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            passwordHash
        });
        const savedUser = await newUser.save();
        if (!savedUser) {
            console.error("Failed to save user:", newUser);
            res.status(500).json({ message: 'Failed to register user' });
            return;
        }
        res.status(201).json({
            message: 'User registered successfully',
            user: { id: savedUser._id, username: savedUser.username, email: savedUser.email }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
}
;
async function loginUser(req, res) {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const { username, password } = req.body;
        const user = await user_1.User.findOne({ username: username.toLowerCase() });
        if (!user) {
            res.status(400).json({ message: 'Invalid username or password' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid username or password' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, username: user.username.toLowerCase() }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
}
