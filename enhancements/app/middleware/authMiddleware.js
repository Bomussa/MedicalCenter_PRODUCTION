import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({ ok: false, error: 'no auth token' });

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ ok: false, error: 'token not found' });

        const decoded = jwt.verify(token, config.SESSION_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        return res.status(401).json({ ok: false, error: 'invalid or expired token' });
    }
}

export function verifyRole(role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ ok: false, error: 'Forbidden: Insufficient permissions' });
        }
    };
}


