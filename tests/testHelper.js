import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { initializeRedis } from '../utils/cache.js';

let mongoServer;

// Connect to a new in-memory database before running any tests
export const setupDB = async () => {
  try {
    console.log('Setting up test databases...');

    // Setup MongoDB
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    console.log('Connected to test MongoDB');

    // Setup Redis with timeout
    try {
      await initializeRedis(true);
      console.log('Connected to test Redis');
    } catch (error) {
      console.warn('Redis not available, tests will run without cache');
    }
  } catch (error) {
    console.error('Error in setupDB:', error);
    throw error;
  }
};

// Remove and close the db and server
export const teardownDB = async () => {
  try {
    console.log('Tearing down test databases...');

    // Disconnect MongoDB
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('Disconnected from test MongoDB');
    }
    if (mongoServer) {
      await mongoServer.stop();
      console.log('Stopped MongoDB memory server');
    }
  } catch (error) {
    console.error('Error in teardownDB:', error);
    throw error;
  }
};

// Clear all test data after every test
export const clearDatabase = async () => {
  try {
    console.log('Clearing test databases...');

    // Clear MongoDB collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany();
    }
    console.log('Cleared MongoDB collections');
  } catch (error) {
    console.error('Error in clearDatabase:', error);
    throw error;
  }
};
