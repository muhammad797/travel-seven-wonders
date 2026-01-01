import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { ExtractJwt } from 'passport-jwt';
import { IUser } from './auth.types';
import { authService } from './auth.service';

/**
 * Extend Express Request to include user
 */
declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Extract token from Authorization header
  const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);

  if (token) {
    // Check if token is blacklisted
    const isBlacklisted = await authService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      res.status(401).json({
        success: false,
        message: 'Token has been revoked. Please login again.',
      });
      return;
    }
  }

  passport.authenticate('jwt', { session: false }, (err: Error | null, user: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized - Invalid or missing token',
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

/**
 * Optional authentication - doesn't fail if no token, but adds user if valid token exists
 */
export const optionalAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate('jwt', { session: false }, (err: Error | null, user: any) => {
    if (err) {
      return next(err);
    }
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

