import express from 'express';
import { registerUser, loginUser } from '../controllers/userController';
import { registerValidation, loginValidation } from '../middleware/userValidator';

export const userRoutes = express.Router();

userRoutes.post('/register', registerValidation, registerUser);
userRoutes.post('/login', loginValidation, loginUser);