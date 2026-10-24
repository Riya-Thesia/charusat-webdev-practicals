const EventEmitter = require('events');

// Practical 10: Asynchronous Processing with Event-Driven Architecture
// Native Node.js EventEmitter class
class TaskEvents extends EventEmitter {}

const taskEvents = new TaskEvents();

module.exports = taskEvents;
