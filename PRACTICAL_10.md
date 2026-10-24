# Practical 10: Asynchronous Processing with Event-Driven Architecture
**Course:** ITUE301 - Advanced Web Development Frameworks  
**Student Name:** Riya Thesia  
**Institution:** Charotar University of Science and Technology (CHARUSAT)  

---

## 🎯 Objective
To implement asynchronous non-blocking background task processing using Node.js native `EventEmitter` without external message queue dependencies, and demonstrate timestamp execution ordering.

---

## 🏗️ Architecture & Event Flow Diagram

```
POST /api/tasks Request
        │
        ▼
 Save Task to MongoDB / Memory
        │
        ▼
 Log: [API Response Sent] (201 Created) ──► HTTP 201 Response returned IMMEDIATELY to Client
        │
        ▼
 emit('task-created', taskData)
        │
        ▼ (Handled Asynchronously in Background)
 Notification Event Handler (taskListeners.js)
        ├── Simulated 1000ms Async Delay
        └── Log: [Event Handler Completed] at timestamp (1000ms AFTER HTTP response)
```

---

## 🛠️ Code Implementation

### 1. `events/taskEvents.js`
Custom `EventEmitter` singleton instance:
```javascript
const EventEmitter = require('events');
class TaskEvents extends EventEmitter {}
module.exports = new TaskEvents();
```

### 2. `events/taskListeners.js`
Listens to `task-created`, `task-deleted`, and `error` events with async background delay:
```javascript
const taskEvents = require('./taskEvents');

taskEvents.on('task-created', (task) => {
  console.log(`[Event Handler Started] 'task-created' at ${new Date().toISOString()}`);
  
  setTimeout(() => {
    console.log(`[Event Handler Completed] Background processing finished at ${new Date().toISOString()}`);
  }, 1000);
});

taskEvents.on('error', (err) => {
  console.error(`[Event Error Listener] ${err.message}`);
});
```

### 3. Route Event Emission (`routes/taskRoutes.js`)
Emits event **after** sending `res.status(201).json(newTask)` response:
```javascript
res.status(201).json(newTask);

taskEvents.emit('task-created', {
  ...newTask,
  assignedUser: 'Riya Thesia (CHARUSAT)'
});
```

---

## 🕒 Terminal Timestamp Evidence

```text
=======================================================================
[API Response Sent] 201 Created returned to client at 2026-10-09T05:03:09.475Z
=======================================================================
[Event Handler Started] 'task-created' event received at 2026-10-09T05:03:09.475Z
  └─ Task Title: "Practical 10 Async Event Task"
  └─ Assigned User: Riya Thesia
[LOG] GET /api/tasks - 2026-10-09T05:03:09.477Z
[Event Handler Completed] 'task-created' background processing finished at 2026-10-09T05:03:10.486Z
  └─ Notification sent successfully for Task ID: 6ac8758d59244443eb53ae42
```

**Key Proof Point:** The API HTTP response was sent at `05:03:09.475Z`. The client received response and proceeded with the next request at `05:03:09.477Z`. The event handler completed processing at `05:03:10.486Z` (1,011 ms later) **without blocking the client**.

---

## 🧠 Key Questions & Viva Analysis

1. **Why does emitting an event not block the API response?**
   - The HTTP response (`res.status(201).json()`) flushes the response payload and closes the socket connection to the client immediately. The event listener callback is queued in the event loop and executes asynchronously in background turns.

2. **What would happen to API response time if notification logic were synchronous?**
   - If notification logic (sending emails, webhook pushes, heavy logging) were synchronous, the API response time would increase by the duration of the notification work (e.g. 1000ms+), degrading client UX and throughput.

3. **Why is `EventEmitter` suitable for this lab but not enterprise multi-service production?**
   - `EventEmitter` operates in-memory on a single Node.js process. If the server process crashes or restarts while an event handler is queued, the event is permanently lost (no persistence/retry capability). Production systems use distributed message queues (e.g. RabbitMQ, BullMQ with Redis, Kafka) for persistent background jobs across worker clusters.

---

## ✅ Evaluation Rubric Checklist
- [x] Dedicated `events.js` and `taskListeners.js` modules
- [x] Emitted `task-created` and `task-deleted` events
- [x] Error listener registered to catch asynchronous exceptions
- [x] Verified non-blocking timestamp ordering in console logs
