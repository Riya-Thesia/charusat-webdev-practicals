const taskEvents = require('./taskEvents');

// Practical 10: Event Listeners for Background Asynchronous Processing

// 1. Primary Listener: 'task-created' event
taskEvents.on('task-created', (task) => {
  const handlerStartTime = new Date().toISOString();
  console.log(`[Event Handler Started] 'task-created' event received at ${handlerStartTime}`);
  console.log(`  └─ Task Title: "${task.title}"`);
  console.log(`  └─ Assigned User: ${task.assignedUser || 'Riya Thesia (CHARUSAT)'}`);

  // Artificial delay (1000ms) to demonstrate non-blocking background processing
  // API response was ALREADY sent to the client before this finishes!
  setTimeout(() => {
    const completionTime = new Date().toISOString();
    console.log(`[Event Handler Completed] 'task-created' background processing finished at ${completionTime}`);
    console.log(`  └─ Notification sent successfully for Task ID: ${task._id}`);
  }, 1000);
});

// 2. Supplementary Listener: 'task-deleted' event
taskEvents.on('task-deleted', (taskData) => {
  const handlerTime = new Date().toISOString();
  console.log(`[Event Handler Started] 'task-deleted' event received at ${handlerTime}`);
  console.log(`  └─ Deleted Task ID: ${taskData.id}`);

  setTimeout(() => {
    console.log(`[Event Handler Completed] Cleanup & notification done for deleted Task ID: ${taskData.id} at ${new Date().toISOString()}`);
  }, 800);
});

// 3. Supplementary Listener: 'error' event (prevents server crash on event errors)
taskEvents.on('error', (err) => {
  console.error(`[Event Error Listener] Caught asynchronous event error: ${err.message}`);
});

console.log('⚡ [Practical 10] Event Listeners initialized and listening for task-created & task-deleted events.');

module.exports = taskEvents;
