import api from './axios';
import { LoginParams, LoginResponse, RegisterParams, RegisterResponse } from '../types/auth';

export const loginUser = (params: LoginParams) => api.post<LoginResponse>('/users/login', params);

export const registerUser = (params: RegisterParams) => api.post<RegisterResponse>('/users/register', params);