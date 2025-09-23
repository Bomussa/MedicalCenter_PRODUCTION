export function notFoundHandler(req, res, next) {
  res.status(404).json({ message: 'المورد غير موجود', path: req.originalUrl });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const code = err.code || 'SERVER_ERROR';
  const msg =
    process.env.NODE_ENV === 'production'
      ? 'حدث خطأ غير متوقع'
      : err.message || 'خطأ في الخادم';
  console.error('❌ Error:', { status, code, message: err.message, stack: err.stack });
  res.status(status).json({ code, message: msg });
}
