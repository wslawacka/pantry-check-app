import { Schema, model } from 'mongoose';
import { IUser } from '../../types/user';

const userSchema = new Schema<IUser>({
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

export const User = model<IUser>('User', userSchema);