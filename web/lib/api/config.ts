/**
 * API Configuration and Shared Types
 * 
 * This file contains shared configuration and types used across all API modules.
 */

// Get API base URL with fallback for development
// Remove trailing slash to avoid double slashes in URL construction
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001').replace(/\/+$/, '');

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
} as const;

// Log the API URL in development (helps with debugging)
if (process.env.NODE_ENV === 'development') {
  console.log('[API Config] Using API base URL:', API_CONFIG.baseUrl);
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

