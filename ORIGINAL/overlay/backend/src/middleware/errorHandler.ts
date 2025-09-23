import { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  const status = err?.status || 500;
  const message = err?.message || 'Internal Server Error';
  const payload = {
    ok: false,
    error: err?.code || 'INTERNAL_ERROR',
    message,
    ts: new Date().toISOString()
  };
  if (process.env.NODE_ENV !== 'production') {
    (payload as any).stack = err?.stack;
  }
  res.status(status).json(payload);
}
