import { nanoid } from 'nanoid';
import { readJson, writeJson } from '../models/index.js';

export const startExam = (req, res) => {
    const { idNumber, gender, examType } = req.body || {};
    if (!idNumber || !gender || !examType) {
        return res.status(400).json({ ok: false, error: 'missing fields' });
    }

    const clinics = readJson('clinics.json', []);
    const routes = readJson('routes.json', {});
    const settings = readJson('settings.json', {});

    const routeIds = (routes[examType]?.order) || [];
    const route = routeIds.map(id => clinics.find(x => x.id === id)).filter(Boolean);

    const sessionId = nanoid(10);
    const sessions = readJson('sessions.json', []);

    sessions.push({ sessionId, idNumber, gender, examType, route: routeIds, current: 0, createdAt: Date.now() });
    writeJson('sessions.json', sessions);

    res.json({ ok: true, sessionId, route, current: 0, settings });
};

export const getPatientRoute = (req, res) => {
    const sessions = readJson('sessions.json', []);
    const clinics = readJson('clinics.json', []);
    const session = sessions.find(x => x.sessionId === req.params.sessionId);

    if (!session) {
        return res.status(404).json({ ok: false, error: 'session not found' });
    }

    const route = session.route.map(id => clinics.find(x => x.id === id)).filter(Boolean);
    res.json({ ok: true, route, current: session.current });
};


