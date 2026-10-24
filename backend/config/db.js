const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://mongodb:27017/taskdb';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000 // Quick timeout fallback if MongoDB service is offline
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to Host: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Warning] Live MongoDB connection failed (${error.message}).`);
    console.warn(`[MongoDB Info] Server operating in In-Memory Task Manager mode for Practical Evaluation.`);
    isConnected = false;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };
