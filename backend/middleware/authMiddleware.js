// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Authentication middleware to protect routes
function auth(req, res, next) {
  // Support both Authorization: Bearer <token> and x-auth-token
  const authHeader = req.headers.authorization || req.header('x-auth-token') || '';
  let token = '';

  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (typeof authHeader === 'string') {
    token = authHeader;
  }

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    // NOTE: For real production, ALWAYS set JWT_SECRET in your .env and remove the fallback.
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    // Attach user id from token to request object
    req.userId = payload.id;
    return next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = auth;
