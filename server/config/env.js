export function validateEnv() {
  const required = [
    'MONGO_URI',
    'JWT_SECRET',
    'ENCRYPTION_KEY',
    'CORS_ORIGINS',
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`❌ Missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
  const key = process.env.ENCRYPTION_KEY;
  if (![32, 64].includes(key.length)) {
    console.error('❌ ENCRYPTION_KEY must be 32 bytes (hex) or 32 chars length');
    process.exit(1);
  }
}
