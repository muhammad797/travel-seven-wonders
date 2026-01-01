import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Import env config - this will validate environment variables
// Note: We need to handle the case where logger might be imported before env validation
let logLevel: string;
let nodeEnv: string;
try {
  // Try to import env, but if it fails (e.g., during initial load), use default
  const envModule = require('../config/env');
  logLevel = envModule.LOG_LEVEL || 'info';
  nodeEnv = envModule.NODE_ENV || 'development';
} catch {
  // Fallback during initial validation
  logLevel = process.env.LOG_LEVEL || 'info';
  nodeEnv = process.env.NODE_ENV || 'development';
}

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: { service: 'travel-wonders-api' },
  transports: [
    // Write all logs to combined.log
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write error logs to error.log
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Write request/response logs to requests.log
    new winston.transports.File({
      filename: path.join(logsDir, 'requests.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// If not in production and not in test, also log to console
if (nodeEnv !== 'production' && nodeEnv !== 'test') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;

