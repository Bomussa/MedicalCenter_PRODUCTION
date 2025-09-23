import path from 'path';
import { paths, logError, safeReadJson, safeWriteJson, restoreLatestData } from '../utils/autoHeal.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function pth(n) { return path.join(__dirname, '../data', n); }

export function readJson(n, f) {
    const fp = pth(n);
    try {
        return safeReadJson(fp, f);
    } catch (e) {
        logError(paths(__dirname).logsDir, `readJson failed for ${n}: ${e.message}`);
        const ok = restoreLatestData(__dirname);
        if (ok) return safeReadJson(fp, f);
        return f;
    }
}

export function writeJson(n, d) {
    const fp = pth(n);
    const ok = safeWriteJson(fp, d);
    if (!ok) logError(paths(__dirname).logsDir, `writeJson failed for ${n}`);
    return ok;
}


