const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/db');
const requestLogger = require('./middleware/logger');
const { validateContentType } = require('./middleware/validate');
const errorHandler = require('./middleware/errorHandler');

// Practical 10: Import event listeners at startup
require('./events/taskListeners');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS Middleware (Practical 6: Enable frontend localhost:5173 cross-origin requests)
app.use(cors());

// 2. Parse incoming JSON requests (Practical 4 requirement)
app.use(express.json());

// 3. Custom Global Request Logger Middleware (Practical 4 requirement)
app.use(requestLogger);

// 4. Content-Type Header Validation Middleware (Practical 4 supplementary requirement)
app.use(validateContentType);

// Server Root Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'API Active',
    course: 'ITUE301 Advanced Web Development Frameworks',
    student: 'Riya Thesia (CHARUSAT)',
    practicals: 'Practicals 4 - 12 Full-Stack Task Manager',
    features: {
      practical_8: 'Lazy Loading & Code Splitting (React.lazy / Suspense)',
      practical_9: 'In-Memory Caching with node-cache & Cache Invalidation',
      practical_10: 'Asynchronous Event-Driven Architecture with EventEmitter',
      practical_11: 'Multi-Container Docker & Docker Compose Orchestration',
      practical_12: 'Automated CI/CD Pipeline with GitHub Actions & Jest'
    },
    endpoints: {
      auth: ['POST /api/auth/register', 'POST /api/auth/login', 'GET /api/auth/me'],
      tasks: ['GET /api/tasks', 'GET /api/tasks/:id', 'POST /api/tasks', 'PUT /api/tasks/:id', 'DELETE /api/tasks/:id'],
      cache_debug: ['GET /api/tasks/cache/stats']
    }
  });
});

// 5. Mount API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 6. Custom 404 Handler for Undefined Routes (Practical 4 supplementary requirement)
app.use((req, res, next) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}. Route does not exist on this server.`
  });
});

// 7. Global Centralized Error Handling Middleware (MUST BE LAST IN PIPELINE) (Practical 4 requirement)
app.use(errorHandler);

// Connect to MongoDB and start Express server (only if not running under Jest test runner)
if (process.env.NODE_ENV !== 'test') {
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`  🚀 Express Server active on http://localhost:${PORT}`);
      console.log(`  📚 ITUE301 Practicals 4 - 12 Backend Operational`);
      console.log(`=======================================================`);
    });
  });
}

module.exports = app;
