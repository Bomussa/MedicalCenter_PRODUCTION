import { readJson, writeJson } from "../models/index.js";
import { dailyPin } from "../utils/pinGenerator.js";
import { paths, backupNow, restoreLatestData, listBackups, logError } from "../utils/autoHeal.js";
import fs from 'fs';
import path from 'path';

export const getSettings = (_req, res) => {
    const settings = readJson("settings.json", {});
    res.json({ ok: true, data: settings });
};

export const updateSettings = (req, res) => {
    const settings = readJson("settings.json", {});
    if (typeof req.body.overrideAllClinics === "boolean") {
        settings.overrideAllClinics = req.body.overrideAllClinics;
    }
    writeJson("settings.json", settings);
    res.json({ ok: true, data: settings });
};

export const getPins = (_req, res) => {
    const clinics = readJson("clinics.json", []);
    const data = clinics.map(c => ({
        clinicId: c.id,
        name_ar: c.name_ar,
        name_en: c.name_en,
        pin: dailyPin(c.id)
    }));
    res.json({ ok: true, data });
};

export const getBackups = (_req, res) => {
    const list = listBackups(paths(path.resolve()).backupsDir);
    res.json({ ok: true, data: list });
};

export const createBackup = (_req, res) => {
    const out = backupNow(path.resolve());
    res.json({ ok: true, data: out });
};

export const restoreBackup = (_req, res) => {
    const ok = restoreLatestData(path.resolve());
    res.json({ ok: !!ok });
};

export const getErrorLogs = (_req, res) => {
    try {
        const p = path.join(paths(path.resolve()).logsDir, "errors.log");
        const txt = fs.existsSync(p) ? fs.readFileSync(p, "utf-8") : "";
        res.json({ ok: true, data: txt });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
};


