import { NextFunction, Request, Response } from 'express';

export function latencyLogger(req: Request, res: Response, next: NextFunction) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const ms = Number(end - start) / 1e6;
    if (ms > 800) {
      // slow request marker; use your logger here
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[SLOW]', req.method, req.originalUrl, ms.toFixed(1)+'ms');
      }
    }
  });
  next();
}
