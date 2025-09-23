module.exports = (err, req, res, next) => {
  const code = err.status || err.statusCode || 500;
  const payload = {
    ok: false,
    code,
    path: req.originalUrl,
    method: req.method,
    message: process.env.NODE_ENV==='production' ? 'Internal Error' : err.message
  };
  if (process.env.NODE_ENV!=='production' && err.stack) payload.stack = err.stack.split('\n').slice(0,6);
  res.status(code).json(payload);
};
