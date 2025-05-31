import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

// create Axios instance
const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// request interceptor: attach JWT token if available
api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// response interceptor: handle 401 Unauthorized globally
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // remove token if invalid/expired
            const token = await SecureStore.getItemAsync('token');
            if (token) await SecureStore.deleteItemAsync('token');
            // redirect to login
            router.replace('/login');
        }
        return Promise.reject(error);
    }
);


export default api;