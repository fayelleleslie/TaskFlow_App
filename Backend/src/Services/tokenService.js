const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');

const createRefreshToken = async (userId, ttlDays = 30) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
  const doc = await RefreshToken.create({ token, user: userId, expiresAt });
  return doc;
};

const rotateRefreshToken = async (oldToken, userId) => {
  // revoke old
  await RefreshToken.updateOne({ token: oldToken }, { revoked: true });
  // create new
  const newDoc = await createRefreshToken(userId);
  return newDoc;
};

const revokeRefreshToken = async (token) => {
  return RefreshToken.updateOne({ token }, { revoked: true });
};

const findValid = async (token) => {
  return RefreshToken.findOne({ token, revoked: false, expiresAt: { $gt: new Date() } });
};

module.exports = { createRefreshToken, rotateRefreshToken, revokeRefreshToken, findValid };
