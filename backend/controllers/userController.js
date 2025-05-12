const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/user');

async function registerUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
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
            return res.status(500).json({ message: 'Failed to register user' });
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

async function loginUser(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username.toLowerCase() });
        if (!user) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid username or password' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username.toLowerCase() },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user._id, username: user.username, email: user.email }});

    } catch(error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
}

module.exports = {
    registerUser,
    loginUser
};