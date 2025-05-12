const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true,
        trim: true
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;