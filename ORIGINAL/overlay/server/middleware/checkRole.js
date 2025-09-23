export const checkRole = (role) => (req, res, next) => {
  const userRole = req.headers["x-role"] || "user";
  if (userRole !== role) return res.status(403).json({ error: "غير مصرح" });
  next();
};
