/**
 * Jest setup file - runs before all tests
 * This file suppresses console output during tests
 */

// Suppress console.error, console.warn, and console.log during tests
// Uncomment the lines below if you want to completely silence console output

// const originalError = console.error;
// const originalWarn = console.warn;
// const originalLog = console.log;

// console.error = jest.fn();
// console.warn = jest.fn();
// console.log = jest.fn();

// If you want to restore console after tests, uncomment:
// afterAll(() => {
//   console.error = originalError;
//   console.warn = originalWarn;
//   console.log = originalLog;
// });

// Set NODE_ENV to test if not already set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'test';
}

// Set LOG_LEVEL to error to suppress info/warn logs during tests
if (!process.env.LOG_LEVEL) {
  process.env.LOG_LEVEL = 'error';
}

