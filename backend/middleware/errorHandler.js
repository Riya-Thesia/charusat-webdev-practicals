// Practical 4 & 5: Global Centralized Error Handling Middleware
// MUST be defined with 4 parameters (err, req, res, next) so Express recognizes it as an error handler
const errorHandler = (err, req, res, next) => {
  console.error('[Global Error Stack]:', err.stack || err);

  // Mongoose Validation Error (Structured response for Practical 5)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: messages
    });
  }

  // Mongoose CastError (Invalid ObjectId format)
  if (err.name === 'CastError') {
    return res.status(404).json({
      error: 'Resource Not Found',
      message: `Invalid ID format: ${err.value}`
    });
  }

  // Default internal server error (500)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong on the server'
  });
};

module.exports = errorHandler;
