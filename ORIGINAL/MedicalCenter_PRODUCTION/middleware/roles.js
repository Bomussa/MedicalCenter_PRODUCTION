/**
 * Role-based guard. Attach req.user from your auth layer before this.
 * For now, allow all if no auth (dev mode). Tighten in production.
 */
exports.requireRole = (roles = []) => (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') return next();
  const user = req.user || {};
  if (roles.length === 0) return next();
  if (roles.includes(user.role)) return next();
  return res.status(403).json({ error: 'Forbidden' });
};
