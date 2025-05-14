import api from './axios';

export const loginUser = (username, password) => {
    return api.post('/users/login', { username, password });
};

export const registerUser = (username, email, password) => {
    return api.post('/users/register', { username, email, password });
};