const jwt = require('jsonwebtoken');

// Basic authentication - verifies JWT token
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing authorization header' });

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  try {
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key_12345';
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin authorization - checks if user is admin
const adminMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing authorization header' });

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  try {
    const jwtSecret = process.env.JWT_SECRET || 'default_secret_key_12345';
    const decoded = jwt.verify(token, jwtSecret);
    
    // Check if user is admin
    if (!decoded.isAdmin) {
      console.log(`⚠️ Access denied: ${decoded.email} is not an admin`);
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
module.exports.auth = authMiddleware;
module.exports.adminAuth = adminMiddleware;
