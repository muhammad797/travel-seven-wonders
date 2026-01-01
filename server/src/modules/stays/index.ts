/**
 * Stays Module
 * 
 * This module exports all stays/accommodations-related functionality:
 * - Service: Business logic layer
 * - Controller: HTTP request handlers
 * - Routes: Express router configuration
 * - Types: TypeScript interfaces and types
 */

export { staysService, StaysService } from './stays.service';
export { staysController, StaysController } from './stays.controller';
export { default as staysRoutes } from './stays.routes';
export * from './stays.types';

