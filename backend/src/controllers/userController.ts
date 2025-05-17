import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { User } from '../models/user';

export async function registerUser(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { username, email, password } = req.body;

        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
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

    } catch (error) {
        console.error(error);
        res.status(500).json( { message: 'Server error during registration' });
    }
};

export async function loginUser(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }

    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            res.status(400).json({ message: 'Invalid username or password' });
            return;
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid username or password' });
            return;
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username.toLowerCase() },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user._id, username: user.username, email: user.email }});

    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
}