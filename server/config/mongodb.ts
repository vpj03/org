import 'dotenv/config';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import session from 'express-session';

// MongoDB Atlas connection URL - using environment variable for security
const MONGODB_URL = process.env.MONGODB_URL;

// MongoDB Atlas connection options
const mongooseOptions = {
  retryWrites: true,
  w: 'majority',
  maxPoolSize: 50,
  socketTimeoutMS: 45000,
  family: 4
} as mongoose.ConnectOptions;

// Connect to MongoDB
// Track connection state and listeners
let isConnecting = false;
let connectionListeners: { error: Function; disconnected: Function } | null = null;

export async function connectToDatabase() {
  const maxRetries = 5;
  const retryDelay = 5000; // 5 seconds
  let retryCount = 0;

  // Clean up existing listeners
  const cleanupListeners = () => {
    if (connectionListeners) {
      mongoose.connection.off('error', connectionListeners.error);
      mongoose.connection.off('disconnected', connectionListeners.disconnected);
      connectionListeners = null;
    }
  };

  const tryConnect = async () => {
    try {
      // Prevent multiple simultaneous connection attempts
      if (isConnecting) {
        console.log('Connection attempt already in progress...');
        return true;
      }

      if (mongoose.connection.readyState === 1) {
        console.log('MongoDB is already connected.');
        return true;
      }

      isConnecting = true;
      console.log('Attempting to connect to MongoDB...');

      // Clean up any existing listeners before setting new ones
      cleanupListeners();

      // Setup connection listeners
      const errorHandler = async (err: Error) => {
        console.error('MongoDB connection error:', err);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          await tryConnect();
        } else {
          console.error('Max retries reached. Could not connect to MongoDB.');
          process.exit(1);
        }
      };

      const disconnectHandler = async () => {
        console.log('MongoDB disconnected. Attempting to reconnect...');
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          await tryConnect();
        } else {
          console.error('Max retries reached. Could not reconnect to MongoDB.');
          process.exit(1);
        }
      };

      connectionListeners = {
        error: errorHandler,
        disconnected: disconnectHandler
      };

      mongoose.connection.on('error', errorHandler);
      mongoose.connection.on('disconnected', disconnectHandler);

      await mongoose.connect(MONGODB_URL, {
        ...mongooseOptions,
        serverSelectionTimeoutMS: 10000,
        heartbeatFrequencyMS: 3000,
        maxPoolSize: 50,
        minPoolSize: 10
      });

      if (mongoose.connection.readyState !== 1) {
        throw new Error(`MongoDB connection failed. Connection state: ${mongoose.connection.readyState}`);
      }

      console.log('Successfully connected to MongoDB.');
      
      // Insert sample data in development environment
      if (process.env.NODE_ENV === 'development') {
        await insertSampleData();
      }

      isConnecting = false;
      return true;
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      isConnecting = false;

      if (retryCount < maxRetries) {
        retryCount++;
        console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return tryConnect();
      } else {
        console.error('Max retries reached. Could not connect to MongoDB.');
        throw error;
      }
    }
  };

  return tryConnect();
}

// Add new helper function to insert sample data into MongoDB
async function insertSampleData() {
  try {
    // Import the User model (adjust the path if needed)
    const { User } = require('../models/user.model');
    const count = await User.countDocuments();
    if (count === 0) {
      const sampleUsers = [
        { 
          name: 'Admin User',
          username: 'admin',
          email: 'admin@example.com',
          password: 'admin123', // This should be hashed in production
          phone: '+1234567890',
          address: '123 Admin Street',
          role: 'admin'
        },
        { 
          name: 'John Doe',
          username: 'johndoe',
          email: 'john@example.com',
          password: 'password123',
          phone: '+1987654321',
          address: '456 Buyer Lane',
          role: 'buyer'
        },
        { 
          name: 'Jane Smith',
          username: 'janesmith',
          email: 'jane@example.com',
          password: 'password456',
          phone: '+1122334455',
          address: '789 Seller Avenue',
          role: 'seller'
        }
      ];
      await User.insertMany(sampleUsers);
      console.log('Inserted sample users.');
    } else {
      console.log('Sample data already exists.');
    }
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

// Close MongoDB connection
export async function closeDatabaseConnection() {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    throw error;
  }
}

// Create MongoDB session store
export const sessionStore = MongoStore.create({
  mongoUrl: MONGODB_URL,
  dbName: 'organic-marketplace',
  collectionName: 'sessions',
  ttl: 24 * 60 * 60, // Session TTL (1 day)
  stringify: false,
  autoRemove: 'interval',
  autoRemoveInterval: 1440
});

// Export mongoose instance
export { mongoose };