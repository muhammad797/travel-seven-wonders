// Import env config first to validate environment variables
import './config/env';

import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { logRequest } from './middleware/requestLogger';
import logger from './utils/logger';
import { connectDatabase } from './config/database';
import { blogRoutes } from './modules/blogs';
import { authRoutes, localStrategy, jwtStrategy } from './modules/auth';
import { placesRoutes } from './modules/places';
import { flightsRoutes } from './modules/flights';
import { staysRoutes } from './modules/stays';
import { PORT } from './config/env';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increase limit for base64 image uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logging with morgan (console output)
app.use(
  morgan('combined', {
    stream: {
      write: (message: string) => {
        logger.info(message.trim(), { type: 'http' });
      },
    },
  })
);

// Detailed request/response logging middleware
app.use(logRequest);

// Initialize Passport
app.use(passport.initialize());

// Configure Passport strategies
passport.use('local', localStrategy);
passport.use('jwt', jwtStrategy);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/flights', flightsRoutes);
app.use('/api/stays', staysRoutes);

// Routes
/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Welcome message
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WelcomeResponse'
 */
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to Travel Wonders API' });
});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [General]
 *     responses:
 *       200:
 *         description: Server health status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthResponse'
 */
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Start server
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
      logger.info(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`Logs are being stored in the logs/ directory`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;

