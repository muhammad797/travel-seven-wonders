import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env file from the server root directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

/**
 * Zod schema for environment variables
 */
const envSchema = z.object({
  // Required: MongoDB connection URI
  MONGODB_URI: z
    .string({
      required_error: 'MONGODB_URI is required',
    })
    .min(1, 'MONGODB_URI cannot be empty')
    .refine(
      (uri: string) => uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'),
      {
        message: 'MONGODB_URI must start with mongodb:// or mongodb+srv://',
      }
    ),

  // Optional: Server port (default: 3001)
  PORT: z
    .string()
    .optional()
    .default('3001')
    .transform((val: string) => parseInt(val, 10))
    .pipe(z.number().int().min(1).max(65535)),

  // Optional: Node environment (default: development)
  NODE_ENV: z
    .enum(['development', 'production', 'test'], {
      errorMap: () => ({
        message: 'NODE_ENV must be one of: development, production, test',
      }),
    })
    .default('development'),

  // Optional: Log level (default: info)
  LOG_LEVEL: z
    .enum(['error', 'warn', 'info', 'verbose', 'debug', 'silly'], {
      errorMap: () => ({
        message:
          'LOG_LEVEL must be one of: error, warn, info, verbose, debug, silly',
      }),
    })
    .default('info'),

  // Optional: JWT Secret (default: development secret - MUST be changed in production)
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters long')
    .optional()
    .default('your-super-secret-jwt-key-change-in-production-min-32-chars'),

  // Optional: JWT Expiration (default: 7d)
  JWT_EXPIRES_IN: z
    .string()
    .optional()
    .default('7d'),

  // Optional: Duffel API Token
  DUFFEL_TOKEN: z
    .string()
    .min(1, 'DUFFEL_TOKEN is required'),
});

/**
 * Type inference from Zod schema
 */
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables
 */
const parseEnv = (): EnvConfig => {
  try {
    return envSchema.parse({
      MONGODB_URI: process.env.MONGODB_URI,
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      LOG_LEVEL: process.env.LOG_LEVEL,
      JWT_SECRET: process.env.JWT_SECRET,
      JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
      DUFFEL_TOKEN: process.env.DUFFEL_TOKEN,
    });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      console.error('\n❌ Environment Configuration Error:\n');

      // Format Zod errors in a user-friendly way
      error.errors.forEach((err: z.ZodIssue) => {
        const field = err.path.join('.');
        const message = err.message;
        console.error(`  - ${field}: ${message}`);
      });

      console.error('\nPlease check your .env file and ensure all required variables are set correctly.');
      console.error('See .env.example for reference.\n');
      process.exit(1);
    }
    throw error;
  }
};

// Parse and validate environment variables
const env = parseEnv();

// Export the validated config object
export { env };

// Export individual values for convenience
export const { MONGODB_URI, PORT, NODE_ENV, LOG_LEVEL, JWT_SECRET, JWT_EXPIRES_IN, DUFFEL_TOKEN } = env;
