module.exports = (req, res, next) => {
  const key = req.headers['x-admin-key'];
  if (!process.env.ADMIN_API_KEY) return res.status(403).json({ message: 'Admin key not configured' });
  if (!key || key !== process.env.ADMIN_API_KEY) return res.status(403).json({ message: 'Forbidden' });
  next();
};
