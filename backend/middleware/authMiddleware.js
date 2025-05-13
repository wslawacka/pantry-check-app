const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const headerParts = authHeader.split(' ');
    if (headerParts.length !== 2 || headerParts[0].toLowerCase() !== 'bearer') {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    const token = headerParts[1];

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.userId;
        next();
    } catch(error) {
        console.error(error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};