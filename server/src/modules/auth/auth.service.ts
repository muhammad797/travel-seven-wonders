import jwt from 'jsonwebtoken';
import { User } from './user.model';
import { TokenBlacklist } from './tokenBlacklist.model';
import {
  CreateUserInput,
  LoginInput,
  SignupInput,
  UserResponse,
  AuthResponse,
  JWTPayload,
  ForgotPasswordInput,
  VerifyOTPInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ResendVerificationInput,
  UpdateUserInput,
} from './auth.types';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../config/env';
import logger from '../../utils/logger';
import {
  generateOTP,
  sendVerificationEmail,
  sendPasswordResetEmail,
} from '../../utils/email';

/**
 * Auth Service - Contains all business logic for authentication operations
 */
export class AuthService {
  /**
   * Generate JWT token for user
   */
  private generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  /**
   * Convert user document to response format (without password)
   */
  private toUserResponse(user: any): UserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      phone: user.phone,
      rewardPoints: user.rewardPoints || 0,
      joinedAt: user.joinedAt.toISOString(),
      isEmailVerified: user.isEmailVerified || false,
    };
  }

  /**
   * Generate auth response from user object (used after passport authentication)
   */
  generateAuthResponse(user: any): AuthResponse {
    const token = this.generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    return {
      token,
      user: this.toUserResponse(user),
    };
  }

  /**
   * Sign up a new user
   */
  async signup(input: SignupInput): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: input.email.toLowerCase() });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user (no avatar - will use initials placeholder)
      const userData: CreateUserInput = {
        email: input.email.toLowerCase(),
        password: input.password,
        firstName: input.firstName,
        lastName: input.lastName,
        // Don't set avatar - frontend will show initials placeholder
      };

      const user = new User(userData);
      
      // Generate email verification OTP
      const verificationOTP = generateOTP();
      const otpExpires = new Date();
      otpExpires.setMinutes(otpExpires.getMinutes() + 10); // OTP expires in 10 minutes
      
      user.emailVerificationOTP = verificationOTP;
      user.emailVerificationOTPExpires = otpExpires;
      user.isEmailVerified = false;
      
      await user.save();

      // Send verification email
      try {
        await sendVerificationEmail(user.email, verificationOTP, user.firstName);
      } catch (emailError) {
        logger.error('Failed to send verification email:', emailError);
        // Don't fail signup if email fails, but log it
      }

      // Generate token
      const token = this.generateToken({
        userId: user._id.toString(),
        email: user.email,
      });

      logger.info(`New user signed up: ${user.email}`);

      return {
        token,
        user: this.toUserResponse(user),
      };
    } catch (error) {
      logger.error('Error during signup:', error);
      throw error;
    }
  }

  /**
   * Login user with email and password
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    try {
      // Find user and include password field
      const user = await User.findOne({ email: input.email.toLowerCase() }).select(
        '+password'
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check password
      const isPasswordValid = await user.comparePassword(input.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate token
      const token = this.generateToken({
        userId: user._id.toString(),
        email: user.email,
      });

      logger.info(`User logged in: ${user.email}`);

      return {
        token,
        user: this.toUserResponse(user),
      };
    } catch (error) {
      logger.error('Error during login:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<UserResponse | null> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        return null;
      }
      return this.toUserResponse(user);
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserResponse | null> {
    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return null;
      }
      return this.toUserResponse(user);
    } catch (error) {
      logger.error('Error fetching user:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, input: UpdateUserInput): Promise<UserResponse> {
    try {
      // Build update object with only provided fields
      const updateData: any = {};
      
      if (input.firstName !== undefined) {
        updateData.firstName = input.firstName.trim();
        if (updateData.firstName.length === 0) {
          throw new Error('First name cannot be empty');
        }
      }
      
      if (input.lastName !== undefined) {
        updateData.lastName = input.lastName.trim();
        if (updateData.lastName.length === 0) {
          throw new Error('Last name cannot be empty');
        }
      }
      
      if (input.phone !== undefined) {
        updateData.phone = input.phone.trim() || undefined; // Allow empty string to clear phone
      }

      if (input.avatar !== undefined) {
        updateData.avatar = input.avatar.trim() || undefined; // Allow empty string to clear avatar
      }

      // Don't allow email or password updates through this endpoint
      // Email should be changed through a separate verification process
      // Password should be changed through password reset flow

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      logger.info(`Profile updated for user: ${user.email}`);
      return this.toUserResponse(user);
    } catch (error) {
      logger.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Update user reward points
   */
  async updateRewardPoints(userId: string, points: number): Promise<UserResponse> {
    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { $inc: { rewardPoints: points } },
        { new: true }
      );

      if (!user) {
        throw new Error('User not found');
      }

      return this.toUserResponse(user);
    } catch (error) {
      logger.error('Error updating reward points:', error);
      throw error;
    }
  }

  /**
   * Add token to blacklist
   */
  async blacklistToken(token: string, userId: string): Promise<void> {
    try {
      // Decode token to get expiration time
      const decoded = jwt.decode(token) as jwt.JwtPayload | null;
      if (!decoded || !decoded.exp) {
        throw new Error('Invalid token');
      }

      // Calculate expiration date
      const expiresAt = new Date(decoded.exp * 1000);

      // Add to blacklist (or update if exists)
      await TokenBlacklist.findOneAndUpdate(
        { token },
        {
          token,
          userId,
          expiresAt,
        },
        { upsert: true, new: true }
      );

      logger.info(`Token blacklisted for user: ${userId}`);
    } catch (error) {
      logger.error('Error blacklisting token:', error);
      throw error;
    }
  }

  /**
   * Check if token is blacklisted
   */
  async isTokenBlacklisted(token: string): Promise<boolean> {
    try {
      const blacklisted = await TokenBlacklist.findOne({ token });
      return !!blacklisted;
    } catch (error) {
      logger.error('Error checking token blacklist:', error);
      return false; // If we can't check, allow the request (fail open)
    }
  }

  /**
   * Forgot password - send OTP to email
   */
  async forgotPassword(input: ForgotPasswordInput): Promise<void> {
    try {
      const user = await User.findOne({ email: input.email.toLowerCase() }).select('+passwordResetOTP +passwordResetOTPExpires');

      if (!user) {
        // Don't reveal if user exists for security
        logger.info(`Password reset requested for non-existent email: ${input.email}`);
        return;
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpires = new Date();
      otpExpires.setMinutes(otpExpires.getMinutes() + 10); // OTP expires in 10 minutes

      // Save OTP to user
      user.passwordResetOTP = otp;
      user.passwordResetOTPExpires = otpExpires;
      await user.save({ validateBeforeSave: false });

      // Send password reset email
      await sendPasswordResetEmail(user.email, otp, user.firstName);

      logger.info(`Password reset OTP sent to: ${user.email}`);
    } catch (error) {
      logger.error('Error in forgot password:', error);
      throw error;
    }
  }

  /**
   * Verify OTP for password reset
   */
  async verifyPasswordResetOTP(input: VerifyOTPInput): Promise<boolean> {
    try {
      const user = await User.findOne({ email: input.email.toLowerCase() }).select('+passwordResetOTP +passwordResetOTPExpires');

      if (!user || !user.passwordResetOTP || !user.passwordResetOTPExpires) {
        return false;
      }

      // Check if OTP is expired
      if (new Date() > user.passwordResetOTPExpires) {
        return false;
      }

      // Verify OTP
      return user.passwordResetOTP === input.otp;
    } catch (error) {
      logger.error('Error verifying password reset OTP:', error);
      return false;
    }
  }

  /**
   * Reset password with OTP
   */
  async resetPassword(input: ResetPasswordInput): Promise<void> {
    try {
      // Verify OTP first
      const isValidOTP = await this.verifyPasswordResetOTP({
        email: input.email,
        otp: input.otp,
      });

      if (!isValidOTP) {
        throw new Error('Invalid or expired OTP');
      }

      // Find user and update password
      const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password +passwordResetOTP +passwordResetOTPExpires');

      if (!user) {
        throw new Error('User not found');
      }

      // Update password (will be hashed by pre-save hook)
      user.password = input.newPassword;
      // Clear OTP fields
      user.passwordResetOTP = undefined;
      user.passwordResetOTPExpires = undefined;
      await user.save();

      logger.info(`Password reset successful for: ${user.email}`);
    } catch (error) {
      logger.error('Error resetting password:', error);
      throw error;
    }
  }

  /**
   * Verify email with OTP
   */
  async verifyEmail(input: VerifyEmailInput): Promise<UserResponse> {
    try {
      const user = await User.findOne({ email: input.email.toLowerCase() }).select('+emailVerificationOTP +emailVerificationOTPExpires');

      if (!user) {
        throw new Error('User not found');
      }

      if (user.isEmailVerified) {
        throw new Error('Email already verified');
      }

      if (!user.emailVerificationOTP || !user.emailVerificationOTPExpires) {
        throw new Error('No verification OTP found. Please request a new one.');
      }

      // Check if OTP is expired
      if (new Date() > user.emailVerificationOTPExpires) {
        throw new Error('Verification OTP has expired. Please request a new one.');
      }

      // Verify OTP
      if (user.emailVerificationOTP !== input.otp) {
        throw new Error('Invalid verification OTP');
      }

      // Mark email as verified and clear OTP
      user.isEmailVerified = true;
      user.emailVerificationOTP = undefined;
      user.emailVerificationOTPExpires = undefined;
      await user.save({ validateBeforeSave: false });

      logger.info(`Email verified for: ${user.email}`);

      return this.toUserResponse(user);
    } catch (error) {
      logger.error('Error verifying email:', error);
      throw error;
    }
  }

  /**
   * Resend email verification OTP
   */
  async resendVerificationEmail(input: ResendVerificationInput): Promise<void> {
    try {
      const user = await User.findOne({ email: input.email.toLowerCase() }).select('+emailVerificationOTP +emailVerificationOTPExpires');

      if (!user) {
        throw new Error('User not found');
      }

      if (user.isEmailVerified) {
        throw new Error('Email already verified');
      }

      // Generate new OTP
      const verificationOTP = generateOTP();
      const otpExpires = new Date();
      otpExpires.setMinutes(otpExpires.getMinutes() + 10); // OTP expires in 10 minutes

      // Save OTP
      user.emailVerificationOTP = verificationOTP;
      user.emailVerificationOTPExpires = otpExpires;
      await user.save({ validateBeforeSave: false });

      // Send verification email
      await sendVerificationEmail(user.email, verificationOTP, user.firstName);

      logger.info(`Verification email resent to: ${user.email}`);
    } catch (error) {
      logger.error('Error resending verification email:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();

