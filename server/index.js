import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { validateEnv } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';

dotenv.config();
validateEnv();

const app = express();
const PORT = process.env.PORT || 3000;

// اتصال قاعدة البيانات
mongoose
  .connect(process.env.MONGO_URI, { dbName: process.env.MONGO_DB || 'medicalcenter' })
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// أمان وأداء
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: process.env.CORS_ORIGINS?.split(',').map((s) => s.trim()),
    credentials: true,
  })
);
app.use(compression());
app.use(morgan(process.env.LOG_FORMAT || 'combined'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.disable('x-powered-by');

// Rate limiting أساسي
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// صحة النظام
app.get('/health', (_, res) => res.status(200).json({ status: 'OK', ts: Date.now() }));

// ربط المسارات
app.use('/api', routes);

// 404 و معالجة الأخطاء
app.use(notFoundHandler);
app.use(errorHandler);

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
