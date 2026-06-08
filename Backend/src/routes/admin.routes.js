const express = require('express');
const router = express.Router();
const admin = require('../middleware/adminMiddleware');
const RefreshToken = require('../models/RefreshToken');
const BlacklistedToken = require('../models/BlacklistedToken');

router.use(admin);

// GET /admin/tokens/refresh
router.get('/tokens/refresh', async (req, res) => {
  const tokens = await RefreshToken.find().select('-__v');
  res.json(tokens);
});

// DELETE /admin/tokens/refresh/:token
router.delete('/tokens/refresh/:token', async (req, res) => {
  const { token } = req.params;
  await RefreshToken.deleteOne({ token });
  res.json({ message: 'Refresh token supprimé' });
});

// GET /admin/tokens/blacklist
router.get('/tokens/blacklist', async (req, res) => {
  const items = await BlacklistedToken.find().select('-__v');
  res.json(items);
});

// DELETE /admin/tokens/blacklist/:id
router.delete('/tokens/blacklist/:id', async (req, res) => {
  const { id } = req.params;
  await BlacklistedToken.deleteOne({ _id: id });
  res.json({ message: 'Blacklisted token supprimé' });
});

module.exports = router;
