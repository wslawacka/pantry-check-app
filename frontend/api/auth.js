import api from './axios';

export const loginUser = (username, password) => api.post('/users/login', { username, password });

export const registerUser = (username, email, password) => api.post('/users/register', { username, email, password });