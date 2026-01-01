/**
 * API Module Index
 * 
 * Central export point for all API modules.
 * Import APIs from here for cleaner imports throughout the application.
 */

// Blogs API
export * from './blogs';

// Auth API
export * from './auth';

// Places API
export * from './places';

// Flights API
export * from './flights';

// Stays API
export * from './stays';

// Config (exported for advanced use cases)
export { API_CONFIG } from './config';
export type { ApiResponse, PaginatedResponse } from './config';

