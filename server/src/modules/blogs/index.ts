/**
 * Blogs Module
 * 
 * This module exports all blog-related functionality:
 * - Model: BlogPost Mongoose model
 * - Service: Business logic layer
 * - Controller: HTTP request handlers
 * - Routes: Express router configuration
 * - Types: TypeScript interfaces and types
 */

export { BlogPost } from './blog.model';
export { blogService, BlogService } from './blog.service';
export { blogController, BlogController } from './blog.controller';
export { default as blogRoutes } from './blog.routes';
export * from './blog.types';

