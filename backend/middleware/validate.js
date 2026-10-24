// Practical 4 Supplementary: Validate Content-Type: application/json header on POST/PUT
const validateContentType = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(400).json({
        error: 'Bad Request',
        message: 'Content-Type header must be application/json'
      });
    }
  }
  next();
};

// Server-side Task Input Validation
const validateTaskInput = (req, res, next) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Task title is required and cannot be empty'
    });
  }
  next();
};

module.exports = { validateContentType, validateTaskInput };
