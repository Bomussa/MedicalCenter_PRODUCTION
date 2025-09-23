import { readJson, writeJson } from "../models/index.js";
import { dailyPin } from "../utils/pinGenerator.js";

export const enterClinic = (req, res) => {
    const { sessionId, pin } = req.body || {};
    const sessions = readJson("sessions.json", []);
    const session = sessions.find(x => x.sessionId === sessionId);

    if (!session) {
        return res.status(404).json({ ok: false, error: "session not found" });
    }

    const settings = readJson("settings.json", {});
    const clinics = readJson("clinics.json", []);
    const currentClinicId = session.route[session.current];
    const currentClinic = clinics.find(x => x.id === currentClinicId);

    if (!currentClinic) {
        return res.status(400).json({ ok: false, error: "invalid clinic" });
    }

    const isOverride = !!settings.overrideAllClinics;
    const expectedPin = String(dailyPin(currentClinic.id));

    if (currentClinic.requiresPIN && !isOverride) {
        if (!pin || pin !== expectedPin) {
            return res.status(401).json({ ok: false, error: "wrong pin" });
        }
    }

    session.current += 1;
    if (session.current >= session.route.length) {
        const reports = readJson("reports.json", []);
        const reportId = nanoid(8);
        reports.push({ reportId, sessionId, idNumber: session.idNumber, examType: session.examType, finishedAt: Date.now() });
        writeJson("reports.json", reports);
        writeJson("sessions.json", sessions);
        return res.json({ ok: true, done: true, reportId });
    }

    writeJson("sessions.json", sessions);
    const clinicsFull = session.route.map(id => clinics.find(x => x.id === id));
    return res.json({ ok: true, done: false, route: clinicsFull, current: session.current });
};


