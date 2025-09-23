import { Response } from 'express';

export function sendOk(res: Response, data?: any, status = 200) {
  res.status(status).json({ ok: true, data });
}
export function sendFail(res: Response, code = 'BAD_REQUEST', message = 'Invalid request', status = 400) {
  res.status(status).json({ ok: false, error: code, message });
}
