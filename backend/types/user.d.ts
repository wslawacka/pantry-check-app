export interface User {
    _id: string;
    username: string;
    email: string;
    password?: string;
}

export interface LoginParams {
    username: string;
    password: string;
}

export interface RegisterParams {
    username: string;
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: User;
}

export interface RegisterResponse {
    message: string;
    user: User;
}

export interface IUser {
    username: string;
    email: string;
    passwordHash: string;
}
