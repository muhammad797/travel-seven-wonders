import { Document } from 'mongoose';

/**
 * User interface extending Mongoose Document
 */
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  rewardPoints: number;
  joinedAt: Date;
  isEmailVerified: boolean;
  emailVerificationOTP?: string;
  emailVerificationOTPExpires?: Date;
  passwordResetOTP?: string;
  passwordResetOTPExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * User creation input (without auto-generated fields)
 */
export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

/**
 * User update input (all fields optional)
 */
export interface UpdateUserInput {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  phone?: string;
  rewardPoints?: number;
}

/**
 * Login credentials
 */
export interface LoginInput {
  email: string;
  password: string;
}

/**
 * Signup input
 */
export interface SignupInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

/**
 * User response (without password)
 */
export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  rewardPoints: number;
  joinedAt: string;
  isEmailVerified: boolean;
}

/**
 * Forgot password input
 */
export interface ForgotPasswordInput {
  email: string;
}

/**
 * Verify OTP input
 */
export interface VerifyOTPInput {
  email: string;
  otp: string;
}

/**
 * Reset password input
 */
export interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

/**
 * Verify email input
 */
export interface VerifyEmailInput {
  email: string;
  otp: string;
}

/**
 * Resend verification email input
 */
export interface ResendVerificationInput {
  email: string;
}

/**
 * Auth response with token and user
 */
export interface AuthResponse {
  token: string;
  user: UserResponse;
}

/**
 * JWT Payload
 */
export interface JWTPayload {
  userId: string;
  email: string;
}

