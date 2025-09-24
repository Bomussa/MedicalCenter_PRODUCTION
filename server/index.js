import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ORIGINS = (process.env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:5173')
  .split(',').map(s => s.trim());

app.set('trust proxy', 1);
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(cors({
  origin: (origin, cb) => cb(null, !origin || ORIGINS.includes(origin)),
  credentials: true
}));

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.MONGO_DB || 'medicalcenter'
  }).then(() => console.log('[DB] connected'))
    .catch(err => console.error('[DB] connection error:', err.message));
}

app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

app.use((req, res) => res.status(404).json({ error: 'Not Found' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Server Error', details: err?.message });
});

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
