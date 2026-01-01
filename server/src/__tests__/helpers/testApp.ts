import express from 'express';
import cors from 'cors';
import passport from 'passport';
import { blogRoutes } from '../../modules/blogs';
import { authRoutes, localStrategy, jwtStrategy } from '../../modules/auth';

/**
 * Create a test Express app without starting the server
 * This is used for integration tests
 */
export const createTestApp = () => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Initialize Passport
  app.use(passport.initialize());

  // Configure Passport strategies
  passport.use('local', localStrategy);
  passport.use('jwt', jwtStrategy);

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/blogs', blogRoutes);

  return app;
};

