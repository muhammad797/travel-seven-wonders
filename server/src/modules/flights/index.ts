/**
 * Flights Module
 * 
 * This module exports all flights-related functionality:
 * - Service: Business logic layer
 * - Controller: HTTP request handlers
 * - Routes: Express router configuration
 * - Types: TypeScript interfaces and types
 */

export { flightsService, FlightsService } from './flights.service';
export { flightsController, FlightsController } from './flights.controller';
export { default as flightsRoutes } from './flights.routes';
export * from './flights.types';

