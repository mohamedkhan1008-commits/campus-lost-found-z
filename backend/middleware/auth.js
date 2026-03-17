// Authentication Middleware
// Verifies JWT token and protects routes that require authentication

const jwt = require('jsonwebtoken');

// Middleware function to verify JWT token
const verifyToken = (req, res, next) => {
  try {
    // Get token from Authorization header (format: "Bearer TOKEN")
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided. Please login first.' 
      });
    }

    // Extract token from header
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token using JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user ID to request object for later use
    req.userId = decoded.id;
    req.userEmail = decoded.email;

    next(); // Continue to next middleware/route
  } catch (error) {
    // Handle token verification errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired. Please login again.' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token. Please login again.' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error.' 
    });
  }
};

// Middleware that tries to verify token but does not reject if missing/invalid
// Useful for routes where contact info should only be shown to logged-in users
const optionalVerifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
  } catch (error) {
    // Ignore errors, do not stop request
  }

  next();
};

module.exports = {
  verifyToken,
  optionalVerifyToken,
};
