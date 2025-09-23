import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

export const config = {
    PORT: process.env.PORT || 4000,
    CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
    SESSION_SECRET: process.env.SESSION_SECRET || 'secret',
    SUPERADMIN_USER: process.env.SUPERADMIN_USER || 'admin',
    SUPERADMIN_PASS: process.env.SUPERADMIN_PASS || 'admin',
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'a_very_secret_key_of_32_bytes_long',
};


