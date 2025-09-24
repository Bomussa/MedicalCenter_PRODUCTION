import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';

import { paths, backupNow, restoreLatestData } from './utils/autoHeal.js';
import { config } from './config/index.js';
import logger from './utils/logger.js'; // Import the new logger
import dailyCodeJob from './jobs/dailyCodeJob.js';
import recoveryService from './services/recoveryService.js';

import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import visitsRoutes from './routes/visitsRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import enhancementRoutes from './routes/enhancementRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "cdn.jsdelivr.net"],
            connectSrc: ["'self'"],
            scriptSrcAttr: ["'unsafe-inline'"] // Allow inline event handlers
        },
    },
}));
app.use(express.json());
app.use(cors({ origin: config.CORS_ORIGIN }));
app.use('/', express.static(path.join(__dirname, 'public')));

try {
    backupNow(__dirname);
    logger.info('Initial backup successful.');
} catch (e) {
    logger.error(`Initial backup failed: ${e.message}`);
}

process.on('uncaughtException', (err) => {
    logger.error('uncaughtException:', err);
    try { restoreLatestData(__dirname); } catch (e) { logger.error(`Restore after uncaughtException failed: ${e.message}`); }
});

process.on('unhandledRejection', (err) => {
    logger.error('unhandledRejection:', err);
});

// Routes
app.use('/admin', authRoutes);
app.use('/admin', adminRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/print', reportRoutes);
app.use('/api/enhancements', enhancementRoutes);

app.get('/health', (_req, res) => res.json({ ok: true }));
app.get('/ready', (_req, res) => res.json({ ok: true }));

app.listen(config.PORT, () => logger.info(`Fullstack server on http://localhost:${config.PORT}`));


