/**
 * Auth API Module
 * 
 * This module provides functions to interact with the authentication API endpoints.
 */

import { API_CONFIG, type ApiResponse } from './config';
import type { User } from '../types';

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup data
 */
export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * Auth response with token and user
 */
export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Token storage key
 */
const TOKEN_KEY = 'auth_token';

/**
 * Get stored authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Store authentication token
 */
export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove authentication token
 */
export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Get authorization header for API requests
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

/**
 * Sign up a new user
 */
export async function signup(data: SignupData): Promise<AuthResponse> {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create account');
  }

  const result: ApiResponse<AuthResponse> = await response.json();
  
  if (result.success && result.data) {
    // Store token
    setAuthToken(result.data.token);
    return result.data;
  }

  throw new Error('Invalid response from server');
}

/**
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Invalid email or password');
  }

  const result: ApiResponse<AuthResponse> = await response.json();
  
  if (result.success && result.data) {
    // Store token
    setAuthToken(result.data.token);
    return result.data;
  }

  throw new Error('Invalid response from server');
}

/**
 * Get current user profile
 */
export async function getCurrentUser(): Promise<User> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/me`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token is invalid, remove it
      removeAuthToken();
      throw new Error('Session expired. Please login again.');
    }
    
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch user profile');
  }

  const result: ApiResponse<User> = await response.json();
  
  if (result.success && result.data) {
    return result.data;
  }

  throw new Error('Invalid response from server');
}

/**
 * Update user profile
 */
export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}

export async function updateProfile(data: UpdateProfileData): Promise<User> {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/profile`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token is invalid, remove it
      removeAuthToken();
      throw new Error('Session expired. Please login again.');
    }
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update profile');
    } else {
      // Handle non-JSON error responses (like HTML error pages)
      const text = await response.text();
      throw new Error(`Failed to update profile: ${response.status} ${response.statusText}`);
    }
  }

  const result: ApiResponse<User> = await response.json();
  
  if (result.success && result.data) {
    return result.data;
  }

  throw new Error('Invalid response from server');
}

/**
 * Logout user (client-side token removal)
 */
export async function logout(): Promise<void> {
  const token = getAuthToken();
  
  if (token) {
    try {
      // Call logout endpoint (optional, mainly for server-side logging)
      await fetch(`${API_CONFIG.baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
    } catch (error) {
      // Ignore errors, we'll still remove the token client-side
      console.error('Logout API call failed:', error);
    }
  }
  
  // Always remove token client-side
  removeAuthToken();
}

/**
 * Request password reset OTP
 */
export async function forgotPassword(email: string): Promise<void> {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to send password reset OTP');
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to send password reset OTP');
  }
}

/**
 * Verify password reset OTP
 */
export async function verifyPasswordResetOTP(email: string, otp: string): Promise<boolean> {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/verify-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to verify OTP');
  }

  const result: ApiResponse<{ isValid: boolean }> = await response.json();
  
  if (result.success && result.data) {
    return result.data.isValid;
  }

  throw new Error('Invalid response from server');
}

/**
 * Reset password with OTP
 */
export async function resetPassword(email: string, otp: string, newPassword: string): Promise<void> {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp, newPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reset password');
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to reset password');
  }
}

/**
 * Verify email with OTP
 */
export async function verifyEmail(email: string, otp: string): Promise<User> {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/verify-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to verify email');
  }

  const result: ApiResponse<User> = await response.json();
  
  if (result.success && result.data) {
    return result.data;
  }

  throw new Error('Invalid response from server');
}

/**
 * Resend email verification OTP
 */
export async function resendVerificationEmail(email: string): Promise<void> {
  const response = await fetch(`${API_CONFIG.baseUrl}/api/auth/resend-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to resend verification email');
  }

  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.message || 'Failed to resend verification email');
  }
}

