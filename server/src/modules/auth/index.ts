/**
 * Auth Module
 * 
 * This module exports all authentication-related functionality:
 * - Model: User Mongoose model
 * - Service: Business logic layer
 * - Controller: HTTP request handlers
 * - Routes: Express router configuration
 * - Middleware: Authentication middleware
 * - Strategies: Passport strategies
 * - Types: TypeScript interfaces and types
 */

export { User } from './user.model';
export { authService, AuthService } from './auth.service';
export { authController, AuthController } from './auth.controller';
export { default as authRoutes } from './auth.routes';
export { authenticate, optionalAuthenticate } from './auth.middleware';
export { localStrategy, jwtStrategy } from './passport.strategies';
export * from './auth.types';

