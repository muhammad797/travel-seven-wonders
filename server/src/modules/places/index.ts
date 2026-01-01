/**
 * Places Module
 * 
 * This module exports all places-related functionality:
 * - Service: Business logic layer
 * - Controller: HTTP request handlers
 * - Routes: Express router configuration
 * - Types: TypeScript interfaces and types
 */

export { placesService, PlacesService } from './places.service';
export { placesController, PlacesController } from './places.controller';
export { default as placesRoutes } from './places.routes';
export * from './places.types';

