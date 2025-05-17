"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        res.status(401).json({ message: 'No token provided' });
        return;
    }
    const headerParts = authHeader.split(' ');
    if (headerParts.length !== 2 || headerParts[0].toLowerCase() !== 'bearer') {
        res.status(401).json({ message: 'Invalid token format' });
        return;
    }
    const token = headerParts[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET is not defined in environment variables');
        res.status(500).json({ message: 'Server configuration error' });
        return;
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, secret);
        req.userId = decodedToken.userId;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
exports.authMiddleware = authMiddleware;
