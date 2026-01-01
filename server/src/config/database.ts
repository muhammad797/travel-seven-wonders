import mongoose from 'mongoose';
import logger from '../utils/logger';
import { MONGODB_URI } from './env';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info('MongoDB connected successfully');
    console.log('MongoDB connected successfully');
  } catch (error) {
    logger.error('MongoDB connection error:', error);
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected');
  } catch (error) {
    logger.error('MongoDB disconnection error:', error);
  }
};

