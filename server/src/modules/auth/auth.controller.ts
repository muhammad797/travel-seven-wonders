import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { authService } from './auth.service';
import {
  LoginInput,
  SignupInput,
  ForgotPasswordInput,
  VerifyOTPInput,
  ResetPasswordInput,
  VerifyEmailInput,
  ResendVerificationInput,
  UpdateUserInput,
} from './auth.types';
import logger from '../../utils/logger';
import { NODE_ENV } from '../../config/env';

/**
 * Auth Controller - Handles HTTP requests and responses
 */
export class AuthController {
  /**
   * Sign up a new user
   */
  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: SignupInput = {
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };

      // Validate required fields
      if (!input.email || !input.password || !input.firstName || !input.lastName) {
        res.status(400).json({
          success: false,
          message: 'All fields are required',
        });
        return;
      }

      const result = await authService.signup(input);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      logger.error('Signup error:', error);
      const statusCode = error.message === 'User with this email already exists' ? 409 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to create account',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
      // Don't call next() here since we've already handled the error response
    }
  };

  /**
   * Login user with email and password
   */
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    passport.authenticate('local', { session: false }, async (err: Error | null, user: any) => {
      if (err) {
        return next(err);
      }

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      try {
        // Generate auth response using authService
        const result = authService.generateAuthResponse(user);

        res.json({
          success: true,
          data: result,
        });
      } catch (error: any) {
        logger.error('Login error:', error);
        res.status(500).json({
          success: false,
          message: 'Failed to login',
          error: NODE_ENV === 'development' ? error.message : undefined,
        });
      }
    })(req, res, next);
  };

  /**
   * Get current user profile
   */
  getMe = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const user = await authService.getUserById(req.user._id.toString());

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error: any) {
      logger.error('Get me error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user profile',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };

  /**
   * Update current user profile
   */
  updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const input: UpdateUserInput = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        avatar: req.body.avatar,
      };

      // Validate that at least one field is provided
      if (input.firstName === undefined && input.lastName === undefined && input.phone === undefined && input.avatar === undefined) {
        res.status(400).json({
          success: false,
          message: 'At least one field must be provided for update',
        });
        return;
      }

      const user = await authService.updateProfile(req.user._id.toString(), input);

      res.json({
        success: true,
        data: user,
        message: 'Profile updated successfully',
      });
    } catch (error: any) {
      logger.error('Update profile error:', error);
      const statusCode = error.message.includes('not found') || error.message.includes('empty') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to update profile',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };

  /**
   * Logout - invalidate the token by adding it to blacklist
   */
  logout = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      // Extract token from Authorization header
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        // Add token to blacklist
        await authService.blacklistToken(token, req.user._id.toString());
      }

      logger.info(`User logged out: ${req.user.email}`);

      res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error: any) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to logout',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };

  /**
   * Forgot password - send OTP to email
   */
  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const input: ForgotPasswordInput = {
        email: req.body.email,
      };

      if (!input.email) {
        res.status(400).json({
          success: false,
          message: 'Email is required',
        });
        return;
      }

      await authService.forgotPassword(input);

      // Always return success to prevent email enumeration
      res.json({
        success: true,
        message: 'If an account exists with this email, a password reset OTP has been sent.',
      });
    } catch (error: any) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process password reset request',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };

  /**
   * Verify OTP for password reset
   */
  verifyPasswordResetOTP = async (req: Request, res: Response): Promise<void> => {
    try {
      const input: VerifyOTPInput = {
        email: req.body.email,
        otp: req.body.otp,
      };

      if (!input.email || !input.otp) {
        res.status(400).json({
          success: false,
          message: 'Email and OTP are required',
        });
        return;
      }

      const isValid = await authService.verifyPasswordResetOTP(input);

      res.json({
        success: true,
        data: { isValid },
      });
    } catch (error: any) {
      logger.error('Verify OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to verify OTP',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };

  /**
   * Reset password with OTP
   */
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const input: ResetPasswordInput = {
        email: req.body.email,
        otp: req.body.otp,
        newPassword: req.body.newPassword,
      };

      if (!input.email || !input.otp || !input.newPassword) {
        res.status(400).json({
          success: false,
          message: 'Email, OTP, and new password are required',
        });
        return;
      }

      if (input.newPassword.length < 8) {
        res.status(400).json({
          success: false,
          message: 'Password must be at least 8 characters long',
        });
        return;
      }

      await authService.resetPassword(input);

      res.json({
        success: true,
        message: 'Password reset successfully',
      });
    } catch (error: any) {
      logger.error('Reset password error:', error);
      const statusCode = error.message.includes('Invalid') || error.message.includes('expired') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to reset password',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };

  /**
   * Verify email with OTP
   */
  verifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const input: VerifyEmailInput = {
        email: req.body.email,
        otp: req.body.otp,
      };

      if (!input.email || !input.otp) {
        res.status(400).json({
          success: false,
          message: 'Email and OTP are required',
        });
        return;
      }

      const user = await authService.verifyEmail(input);

      res.json({
        success: true,
        data: user,
        message: 'Email verified successfully',
      });
    } catch (error: any) {
      logger.error('Verify email error:', error);
      const statusCode = error.message.includes('Invalid') || error.message.includes('expired') || error.message.includes('already') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to verify email',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };

  /**
   * Resend email verification OTP
   */
  resendVerificationEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const input: ResendVerificationInput = {
        email: req.body.email,
      };

      if (!input.email) {
        res.status(400).json({
          success: false,
          message: 'Email is required',
        });
        return;
      }

      await authService.resendVerificationEmail(input);

      res.json({
        success: true,
        message: 'Verification email sent successfully',
      });
    } catch (error: any) {
      logger.error('Resend verification email error:', error);
      const statusCode = error.message.includes('already verified') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        message: error.message || 'Failed to resend verification email',
        error: NODE_ENV === 'development' ? error.message : undefined,
      });
    }
  };
}

export const authController = new AuthController();

