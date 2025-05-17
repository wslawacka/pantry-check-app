import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
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
        const decodedToken = jwt.verify(token, secret) as JwtPayload;
        req.userId = decodedToken.userId;
        next();
    } catch(error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};