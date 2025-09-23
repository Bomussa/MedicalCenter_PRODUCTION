import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';

export const adminLogin = (req, res) => {
    const { username, password } = req.body || {};
    if (username === config.SUPERADMIN_USER && password === config.SUPERADMIN_PASS) {
        const token = jwt.sign({ role: 'superAdmin', u: username }, config.SESSION_SECRET, { expiresIn: '12h' });
        return res.json({ ok: true, token });
    }
    res.status(401).json({ ok: false, error: 'invalid credentials' });
};


