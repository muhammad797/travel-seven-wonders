import swaggerJsdoc from 'swagger-jsdoc';

const DEFAULT_PORT = 3001;

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Travel Wonders API',
    version: '1.0.0',
    description: 'API documentation for Travel Wonders application',
    contact: {
      name: 'API Support',
    },
  },
  servers: [
    {
      url: `http://localhost:${DEFAULT_PORT}`,
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'General',
      description: 'General API endpoints',
    },
    {
      name: 'Logs',
      description: 'Log viewing and management endpoints',
    },
    {
      name: 'Blogs',
      description: 'Blog post management endpoints',
    },
    {
      name: 'Auth',
      description: 'Authentication endpoints',
    },
  ],
  components: {
    schemas: {
      HealthResponse: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'ok',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-01T00:00:00.000Z',
          },
        },
      },
      WelcomeResponse: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            example: 'Welcome to Travel Wonders API',
          },
        },
      },
      BlogPost: {
        type: 'object',
        required: ['slug', 'title', 'excerpt', 'content', 'author', 'publishedAt', 'readTime', 'category', 'image'],
        properties: {
          _id: {
            type: 'string',
            description: 'MongoDB document ID',
            example: '507f1f77bcf86cd799439011',
          },
          slug: {
            type: 'string',
            description: 'Unique URL-friendly identifier',
            example: 'ultimate-guide-visiting-colosseum',
          },
          title: {
            type: 'string',
            description: 'Blog post title',
            example: 'The Ultimate Guide to Visiting the Colosseum',
          },
          excerpt: {
            type: 'string',
            description: 'Short description/excerpt',
            example: 'Everything you need to know before visiting Rome\'s most iconic monument',
          },
          content: {
            type: 'string',
            description: 'Full blog post content (markdown)',
            example: '# The Ultimate Guide...',
          },
          author: {
            type: 'object',
            required: ['name', 'avatar'],
            properties: {
              name: {
                type: 'string',
                example: 'Sofia Romano',
              },
              avatar: {
                type: 'string',
                format: 'uri',
                example: '/woman-traveler.png',
              },
            },
          },
          publishedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Publication date',
            example: '2024-12-15T00:00:00.000Z',
          },
          readTime: {
            type: 'integer',
            description: 'Estimated reading time in minutes',
            example: 8,
            minimum: 1,
          },
          category: {
            type: 'string',
            description: 'Blog post category',
            example: 'Travel Guide',
          },
          image: {
            type: 'string',
            format: 'uri',
            description: 'Featured image URL',
            example: '/colosseum-rome-sunset.jpg',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Array of tags',
            example: ['Colosseum', 'Rome', 'Italy', 'Travel Tips'],
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Creation timestamp',
            example: '2024-12-15T00:00:00.000Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Last update timestamp',
            example: '2024-12-15T00:00:00.000Z',
          },
        },
      },
      BlogPostInput: {
        type: 'object',
        required: ['slug', 'title', 'excerpt', 'content', 'author', 'publishedAt', 'readTime', 'category', 'image'],
        properties: {
          slug: {
            type: 'string',
            description: 'Unique URL-friendly identifier',
            example: 'ultimate-guide-visiting-colosseum',
          },
          title: {
            type: 'string',
            description: 'Blog post title',
            example: 'The Ultimate Guide to Visiting the Colosseum',
          },
          excerpt: {
            type: 'string',
            description: 'Short description/excerpt',
            example: 'Everything you need to know before visiting Rome\'s most iconic monument',
          },
          content: {
            type: 'string',
            description: 'Full blog post content (markdown)',
            example: '# The Ultimate Guide...',
          },
          author: {
            type: 'object',
            required: ['name', 'avatar'],
            properties: {
              name: {
                type: 'string',
                example: 'Sofia Romano',
              },
              avatar: {
                type: 'string',
                format: 'uri',
                example: '/woman-traveler.png',
              },
            },
          },
          publishedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Publication date',
            example: '2024-12-15T00:00:00.000Z',
          },
          readTime: {
            type: 'integer',
            description: 'Estimated reading time in minutes',
            example: 8,
            minimum: 1,
          },
          category: {
            type: 'string',
            description: 'Blog post category',
            example: 'Travel Guide',
          },
          image: {
            type: 'string',
            format: 'uri',
            description: 'Featured image URL',
            example: '/colosseum-rome-sunset.jpg',
          },
          tags: {
            type: 'array',
            items: {
              type: 'string',
            },
            description: 'Array of tags',
            example: ['Colosseum', 'Rome', 'Italy', 'Travel Tips'],
          },
        },
      },
      BlogPostResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            $ref: '#/components/schemas/BlogPost',
          },
        },
      },
      BlogPostsResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/BlogPost',
            },
          },
          pagination: {
            type: 'object',
            properties: {
              page: {
                type: 'integer',
                example: 1,
              },
              limit: {
                type: 'integer',
                example: 10,
              },
              total: {
                type: 'integer',
                example: 50,
              },
              pages: {
                type: 'integer',
                example: 5,
              },
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          message: {
            type: 'string',
            example: 'Error message',
          },
          error: {
            type: 'string',
            description: 'Detailed error (only in development)',
          },
        },
      },
      UserResponse: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
          },
          firstName: {
            type: 'string',
            example: 'John',
          },
          lastName: {
            type: 'string',
            example: 'Doe',
          },
          avatar: {
            type: 'string',
            format: 'uri',
            example: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          },
          rewardPoints: {
            type: 'integer',
            example: 1250,
            minimum: 0,
          },
          joinedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-01-15T00:00:00.000Z',
          },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
    },
  },
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/**/*.ts'], // Path to the API files
};

export const swaggerSpec = swaggerJsdoc(options);

