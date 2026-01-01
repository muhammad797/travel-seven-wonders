# Travel Wonders API Server

Express.js API server for the Travel Wonders application.

## Getting Started

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

Server runs on `http://localhost:3001` by default.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Environment Variables

Create a `.env` file in the server root directory. The application will validate all environment variables on startup and provide clear error messages if any are missing or invalid.

### Required Variables

- `MONGODB_URI` - **Required** - MongoDB connection string
  - Local: `mongodb://localhost:27017/travel-wonders`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/travel-wonders`
  - Must start with `mongodb://` or `mongodb+srv://`

### Optional Variables (with defaults)

- `PORT` - Server port (default: `3001`, must be between 1-65535)
- `NODE_ENV` - Environment mode (default: `development`, must be: `development`, `production`, or `test`)
- `LOG_LEVEL` - Logging level (default: `info`, must be: `error`, `warn`, `info`, `verbose`, `debug`, or `silly`)
- `JWT_SECRET` - Secret key for JWT token signing (default: `your-super-secret-jwt-key-change-in-production`, **MUST be changed in production**, minimum 32 characters)
- `JWT_EXPIRES_IN` - JWT token expiration time (default: `7d`, examples: `1h`, `7d`, `30d`)

### Validation

The application validates all environment variables on startup:
- Missing required variables will cause the application to exit with a clear error message
- Invalid formats or values will be caught and reported before the server starts
- All validation errors are displayed in a user-friendly format

## API Documentation

Swagger documentation available at:
- `http://localhost:3001/api-docs`

## Database Setup

Make sure MongoDB is running. You can use a local MongoDB instance or a cloud service like MongoDB Atlas.

### Seed Blog Posts

To populate the database with sample blog posts:

```bash
npm run seed:blogs
```

## Endpoints

### General
- `GET /` - Welcome message
- `GET /health` - Health check

### Authentication
- `POST /api/auth/signup` - Sign up a new user
- `POST /api/auth/login` - Login user with email and password
- `GET /api/auth/me` - Get current user profile (requires authentication)
- `POST /api/auth/logout` - Logout user (requires authentication)

### Blogs
- `GET /api/blogs` - Get all blog posts (supports query params: category, tag, page, limit)
- `GET /api/blogs/:slug` - Get a single blog post by slug
- `POST /api/blogs` - Create a new blog post
- `PUT /api/blogs/:slug` - Update a blog post
- `DELETE /api/blogs/:slug` - Delete a blog post
- `GET /api/blogs/categories` - Get all unique categories
- `GET /api/blogs/tags` - Get all unique tags

## Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only
- `requests.log` - Request/response logs

