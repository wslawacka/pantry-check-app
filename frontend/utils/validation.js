const usernameRegex = /^[a-zA-Z0-9_]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUsername(username) {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters long';
    if (username.length > 20) return 'Username must be at most 20 characters long';
    if (!usernameRegex.test(username)) return 'Username can contain only letters, numbers and underscores';
    return null;
}

export function validateEmail(email) {
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Invalid email format';
    return null;
}

export function validatePassword(password) {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    if (!/[A-Z]/.test(password)) return 'Password must include uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must include lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must include number';
    if (!/[\W_]/.test(password)) return 'Password must include symbol';
    return null;
}

export function validateLoginUsername(username) {
    if (!username) return 'Username is required';
    return null;
}

export function validateLoginPassword(password) {
    if (!password) return 'Password is required';
    return null;
}