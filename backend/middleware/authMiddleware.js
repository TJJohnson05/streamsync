// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization || req.header('x-auth-token') || '';
  let token = '';

  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
	token = authHeader.slice(7)
  } else {
	token = authHeader;
  }
  if (!token) 
	return res.status(401).json({ message: 'No token provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  module.exports = auth;
};

