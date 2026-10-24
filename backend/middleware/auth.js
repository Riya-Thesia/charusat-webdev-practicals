const jwt = require('jsonwebtoken');

// Practical 7: JWT Authentication Middleware
const authMiddleware = (req, res, next) => {
  // Extract Authorization header (Expected format: "Bearer <token>")
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Access denied. No authentication token provided in Authorization header.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const secret = process.env.JWT_SECRET || 'charusat_itue301_secret_key_2026_riya';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // Attach decoded payload { id, email } to req object
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or expired token. Please login again.'
    });
  }
};

module.exports = authMiddleware;
