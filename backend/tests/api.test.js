// Practical 12: Automated Integration Tests for CI/CD Pipeline
// Course: ITUE301 Advanced Web Development Frameworks
// Student: Riya Thesia (CHARUSAT)

const request = require('supertest');
const app = require('../server');

describe('ITUE301 Full-Stack Task Manager REST API Test Suite', () => {

  // Test 1: Server Root Health Check
  describe('GET / (Server Root)', () => {
    it('should return 200 OK and valid API metadata payload', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('API Active');
      expect(res.body.course).toContain('ITUE301');
      expect(res.body.student).toContain('Riya Thesia');
    });
  });

  // Test 2: GET /api/tasks Endpoint
  describe('GET /api/tasks', () => {
    it('should return 200 OK and an array of task items', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      // Validate Practical 9 cache response header
      expect(res.headers).toHaveProperty('x-cache');
    });
  });

  // Test 3: Cache Metrics Endpoint (Practical 9 Integration)
  describe('GET /api/tasks/cache/stats', () => {
    it('should return 200 OK and node-cache operational metrics', async () => {
      const res = await request(app).get('/api/tasks/cache/stats');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.metrics).toHaveProperty('hits');
      expect(res.body.metrics).toHaveProperty('misses');
      expect(res.body.metrics).toHaveProperty('hitRatio');
    });
  });

  // Test 4: POST /api/tasks with Valid Payload
  describe('POST /api/tasks', () => {
    it('should create a new task and return 201 Created', async () => {
      const newTask = {
        title: 'CI/CD Pipeline Validation Task',
        description: 'Verify automated Jest testing suite on GitHub Actions push',
        priority: 'high',
        completed: false
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Content-Type', 'application/json');

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('_id');
      expect(res.body.title).toBe(newTask.title);
      expect(res.body.priority).toBe('high');
    });

    // Test 5: Validation Middleware Test (Empty title should fail)
    it('should return 400 Bad Request when task title is missing or empty', async () => {
      const invalidTask = {
        title: '',
        description: 'Missing title test'
      };

      const res = await request(app)
        .post('/api/tasks')
        .send(invalidTask)
        .set('Content-Type', 'application/json');

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Validation Error');
    });
  });

  // Test 6: Undefined Route Handling (404)
  describe('GET /api/nonexistent-route', () => {
    it('should return 404 Not Found for undefined routes', async () => {
      const res = await request(app).get('/api/nonexistent-route');
      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe('Not Found');
    });
  });

  /*
   * =========================================================================
   * PRACTICAL 12 REQUIREMENT: Deliberate Failing Test Demonstration
   * =========================================================================
   * To demonstrate a failing CI pipeline (Red X / Job Failure):
   * Uncomment the test below. The test asserts an impossible status code (200 instead of 404),
   * causing Jest to exit with code 1 and triggering GitHub Actions failure notification.
   *
   * it('DELIBERATE BROKEN TEST DEMO: should deliberately fail CI pipeline', async () => {
   *   const res = await request(app).get('/api/nonexistent-broken-route');
   *   expect(res.statusCode).toBe(200); // FAILS: Expected 200, Received 404
   * });
   * =========================================================================
   */
});
