const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { validateTaskInput } = require('../middleware/validate');
const { getIsConnected } = require('../config/db');
const { cache, getCacheStats, recordHit, recordMiss } = require('../config/cache');
const taskEvents = require('../events/taskEvents');

// In-Memory Tasks Storage Fallback (Practical 4 requirement & resilience)
let memoryTasks = [
  {
    _id: 'mem_1',
    title: 'Complete Practical 1 - 7 Reports',
    description: 'Build full stack Vite React + Node Express app for ITUE301',
    completed: true,
    priority: 'high',
    createdAt: new Date()
  },
  {
    _id: 'mem_2',
    title: 'Review React useState and useEffect Hooks',
    description: 'Study IBM Coursera Module 2 & 3 references for viva',
    completed: false,
    priority: 'medium',
    createdAt: new Date()
  }
];

// Practical 9 Debug Route: GET /api/tasks/cache/stats
// Exposed cache-hit / cache-miss counter metrics
router.get('/cache/stats', (req, res) => {
  const stats = getCacheStats();
  return res.status(200).json({
    status: 'success',
    message: 'Practical 9 In-Memory Caching Performance Metrics',
    timestamp: new Date().toISOString(),
    metrics: stats
  });
});

// @route   GET /api/tasks
// @desc    Get all tasks with Practical 9 In-Memory Caching
router.get('/', async (req, res, next) => {
  const startTime = Date.now();
  try {
    const cacheKey = 'all_tasks';
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      recordHit();
      const responseTime = Date.now() - startTime;
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Response-Time', `${responseTime}ms`);
      console.log(`[Cache HIT] Returned ${cachedData.length} tasks from node-cache in ${responseTime}ms`);
      return res.status(200).json(cachedData);
    }

    // Cache MISS: Query MongoDB or In-Memory fallback
    recordMiss();
    let tasks;
    if (getIsConnected()) {
      tasks = await Task.find().sort({ createdAt: -1 });
    } else {
      tasks = memoryTasks;
    }

    // Store query result in cache for 60 seconds (TTL)
    cache.set(cacheKey, tasks);
    const responseTime = Date.now() - startTime;
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Response-Time', `${responseTime}ms`);
    console.log(`[Cache MISS] Queried database/storage and populated node-cache key '${cacheKey}' in ${responseTime}ms`);

    return res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// @route   GET /api/tasks/:id
// @desc    Get single task by ID with Practical 9 Single-Item Caching
router.get('/:id', async (req, res, next) => {
  const startTime = Date.now();
  try {
    const { id } = req.params;
    const cacheKey = `task_${id}`;
    const cachedTask = cache.get(cacheKey);

    if (cachedTask) {
      recordHit();
      const responseTime = Date.now() - startTime;
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Response-Time', `${responseTime}ms`);
      console.log(`[Cache HIT] Single Task ID ${id} retrieved from node-cache in ${responseTime}ms`);
      return res.status(200).json(cachedTask);
    }

    recordMiss();
    let task = null;

    if (getIsConnected()) {
      task = await Task.findById(id);
    } else {
      task = memoryTasks.find((t) => t._id === id);
    }

    if (!task) {
      return res.status(404).json({ error: 'Not Found', message: `Task with ID ${id} not found` });
    }

    cache.set(cacheKey, task);
    const responseTime = Date.now() - startTime;
    res.setHeader('X-Cache', 'MISS');
    res.setHeader('X-Response-Time', `${responseTime}ms`);
    console.log(`[Cache MISS] Single Task ID ${id} fetched from DB and cached in ${responseTime}ms`);

    return res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// @route   POST /api/tasks
// @desc    Create a new task with Practical 9 Cache Invalidation & Practical 10 EventEmitter
router.post('/', validateTaskInput, async (req, res, next) => {
  try {
    const { title, description, completed, priority, assignedUser } = req.body;
    let newTask;

    if (getIsConnected()) {
      newTask = await Task.create({
        title,
        description,
        completed: completed || false,
        priority: priority || 'medium'
      });
    } else {
      newTask = {
        _id: `mem_${Date.now()}`,
        title: title.trim(),
        description: description ? description.trim() : '',
        completed: completed || false,
        priority: priority || 'medium',
        createdAt: new Date()
      };
      memoryTasks.unshift(newTask);
    }

    // Practical 9 Requirement: Invalidate cache on write operations so stale data is never served
    cache.del('all_tasks');
    console.log(`[Cache Invalidate] Cleared 'all_tasks' cache key following POST request.`);

    // Practical 10 Requirement: Respond immediately to client before event handler completes
    const responseTimestamp = new Date().toISOString();
    console.log(`\n=======================================================================`);
    console.log(`[API Response Sent] 201 Created returned to client at ${responseTimestamp}`);
    console.log(`=======================================================================`);

    res.status(201).json(newTask);

    // Emit asynchronous 'task-created' event after sending the HTTP response
    taskEvents.emit('task-created', {
      ...newTask.toObject ? newTask.toObject() : newTask,
      assignedUser: assignedUser || 'Riya Thesia (CHARUSAT)'
    });

  } catch (err) {
    next(err);
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update task by ID with Practical 9 Cache Invalidation
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;
    let updatedTask;

    if (getIsConnected()) {
      updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description, completed, priority },
        { new: true, runValidators: true }
      );

      if (!updatedTask) {
        return res.status(404).json({ error: 'Not Found', message: `Task with ID ${id} not found` });
      }
    } else {
      const index = memoryTasks.findIndex((t) => t._id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Not Found', message: `Task with ID ${id} not found` });
      }

      memoryTasks[index] = {
        ...memoryTasks[index],
        title: title !== undefined ? title : memoryTasks[index].title,
        description: description !== undefined ? description : memoryTasks[index].description,
        completed: completed !== undefined ? completed : memoryTasks[index].completed,
        priority: priority !== undefined ? priority : memoryTasks[index].priority
      };
      updatedTask = memoryTasks[index];
    }

    // Practical 9 Requirement: Invalidate cache keys for both all_tasks and specific item
    cache.del('all_tasks');
    cache.del(`task_${id}`);
    console.log(`[Cache Invalidate] Cleared 'all_tasks' and 'task_${id}' cache keys following PUT request.`);

    return res.status(200).json(updatedTask);
  } catch (err) {
    next(err);
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete task by ID with Practical 9 Cache Invalidation & Practical 10 Event Emission
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    let deletedTask;

    if (getIsConnected()) {
      deletedTask = await Task.findByIdAndDelete(id);
      if (!deletedTask) {
        return res.status(404).json({ error: 'Not Found', message: `Task with ID ${id} not found` });
      }
    } else {
      const index = memoryTasks.findIndex((t) => t._id === id);
      if (index === -1) {
        return res.status(404).json({ error: 'Not Found', message: `Task with ID ${id} not found` });
      }
      deletedTask = memoryTasks[index];
      memoryTasks.splice(index, 1);
    }

    // Practical 9 Requirement: Invalidate cache keys
    cache.del('all_tasks');
    cache.del(`task_${id}`);
    console.log(`[Cache Invalidate] Cleared 'all_tasks' and 'task_${id}' cache keys following DELETE request.`);

    const responseTimestamp = new Date().toISOString();
    console.log(`[API Response Sent] 200 OK Task deletion returned at ${responseTimestamp}`);

    res.status(200).json({ message: 'Task deleted successfully', id });

    // Practical 10 Supplementary: Emit task-deleted event
    taskEvents.emit('task-deleted', { id, title: deletedTask.title });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
