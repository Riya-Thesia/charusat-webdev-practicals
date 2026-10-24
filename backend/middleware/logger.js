// Practical 4: Custom Global Request Logging Middleware
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[LOG] ${req.method} ${req.originalUrl} - ${timestamp}`);
  next();
};

module.exports = requestLogger;
