import crypto from 'crypto';

const ALGO = 'aes-256-gcm';

export function encrypt(text) {
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, key.slice(0, 32), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, encrypted]).toString('base64');
}

export function decrypt(b64) {
  const raw = Buffer.from(b64, 'base64');
  const iv = raw.slice(0, 12);
  const tag = raw.slice(12, 28);
  const data = raw.slice(28);
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8').slice(0, 32);
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString('utf8');
}
