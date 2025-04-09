import { mongoose, connectToDatabase, closeDatabaseConnection } from './config/mongodb';

// Re-export the MongoDB connection functions and mongoose instance
export { mongoose, connectToDatabase, closeDatabaseConnection };