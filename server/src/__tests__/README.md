# Test Suite

This directory contains the test suite for the Travel Wonders API server.

## Test Structure

```
__tests__/
├── setup.ts              # Test setup and teardown
├── helpers/
│   ├── testApp.ts       # Test Express app factory
│   └── testHelpers.ts   # Test utility functions
└── README.md

modules/blogs/__tests__/
├── blog.service.test.ts  # Service layer unit tests
└── blog.api.test.ts      # API endpoint integration tests
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Setup

- Uses **Jest** as the testing framework
- Uses **MongoDB Memory Server** for in-memory database testing
- Uses **Supertest** for API endpoint testing
- Tests run against an isolated in-memory MongoDB instance
- Database is cleared between tests

## Test Coverage

The test suite covers:

### Service Layer (`blog.service.test.ts`)
- ✅ Get all blog posts with pagination
- ✅ Filter by category and tags
- ✅ Get blog post by slug
- ✅ Create blog post
- ✅ Update blog post
- ✅ Delete blog post
- ✅ Get categories and tags
- ✅ Error handling

### API Layer (`blog.api.test.ts`)
- ✅ GET /api/blogs - List all posts
- ✅ GET /api/blogs/:slug - Get single post
- ✅ POST /api/blogs - Create post
- ✅ PUT /api/blogs/:slug - Update post
- ✅ DELETE /api/blogs/:slug - Delete post
- ✅ GET /api/blogs/categories - Get categories
- ✅ GET /api/blogs/tags - Get tags
- ✅ Error responses (404, 400, 500)

## Writing New Tests

When adding new modules, follow the same structure:

1. Create `__tests__` directory in the module folder
2. Write service tests (`*.service.test.ts`)
3. Write API tests (`*.api.test.ts`)
4. Use test helpers from `__tests__/helpers/`

Example:
```typescript
import { createMockBlogPost } from '../../../__tests__/helpers/testHelpers';

describe('MyModule', () => {
  it('should do something', async () => {
    // Test implementation
  });
});
```

