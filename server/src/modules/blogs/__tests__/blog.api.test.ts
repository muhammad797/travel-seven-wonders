import request from 'supertest';
import { createTestApp } from '../../../__tests__/helpers/testApp';
import { BlogPost } from '../blog.model';
import { createMockBlogPost, createMockBlogPosts } from '../../../__tests__/helpers/testHelpers';

describe('Blog API Endpoints', () => {
  const app = createTestApp();

  describe('GET /api/blogs', () => {
    it('should return all blog posts', async () => {
      const mockPosts = createMockBlogPosts(5);
      await BlogPost.insertMany(mockPosts);

      const response = await request(app).get('/api/blogs').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(5);
      expect(response.body.pagination).toBeDefined();
    });

    it('should support pagination', async () => {
      const mockPosts = createMockBlogPosts(15);
      await BlogPost.insertMany(mockPosts);

      const response = await request(app)
        .get('/api/blogs?page=1&limit=10')
        .expect(200);

      expect(response.body.data).toHaveLength(10);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(10);
      expect(response.body.pagination.total).toBe(15);
    });

    it('should filter by category', async () => {
      const mockPosts = createMockBlogPosts(5);
      await BlogPost.insertMany(mockPosts);

      const response = await request(app)
        .get('/api/blogs?category=Category A')
        .expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((post: any) => {
        expect(post.category).toBe('Category A');
      });
    });

    it('should filter by tag', async () => {
      const mockPosts = createMockBlogPosts(5);
      await BlogPost.insertMany(mockPosts);

      const response = await request(app).get('/api/blogs?tag=tag1').expect(200);

      expect(response.body.success).toBe(true);
      response.body.data.forEach((post: any) => {
        expect(post.tags).toContain('tag1');
      });
    });

    it('should return empty array when no posts exist', async () => {
      const response = await request(app).get('/api/blogs').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
      expect(response.body.pagination.total).toBe(0);
    });
  });

  describe('GET /api/blogs/:slug', () => {
    it('should return a blog post by slug', async () => {
      const mockPost = createMockBlogPost({ slug: 'test-slug' });
      await BlogPost.create(mockPost);

      const response = await request(app).get('/api/blogs/test-slug').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('test-slug');
      expect(response.body.data.title).toBe(mockPost.title);
    });

    it('should return 404 if blog post not found', async () => {
      const response = await request(app).get('/api/blogs/non-existent').expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Blog post not found');
    });
  });

  describe('POST /api/blogs', () => {
    it('should create a new blog post', async () => {
      const mockPost = createMockBlogPost({ slug: 'new-post' });

      const response = await request(app)
        .post('/api/blogs')
        .send(mockPost)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.slug).toBe('new-post');
      expect(response.body.message).toBe('Blog post created successfully');
    });

    it('should return 400 if slug already exists', async () => {
      const mockPost = createMockBlogPost({ slug: 'duplicate-slug' });
      await BlogPost.create(mockPost);

      const response = await request(app)
        .post('/api/blogs')
        .send(mockPost)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('slug already exists');
    });

    it('should validate required fields', async () => {
      const invalidPost = {
        title: 'Missing required fields',
        // Missing slug, excerpt, content, etc.
      };

      const response = await request(app)
        .post('/api/blogs')
        .send(invalidPost)
        .expect(500);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/blogs/:slug', () => {
    it('should update a blog post', async () => {
      const mockPost = createMockBlogPost({ slug: 'update-test' });
      await BlogPost.create(mockPost);

      const updateData = { title: 'Updated Title' };
      const response = await request(app)
        .put('/api/blogs/update-test')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.message).toBe('Blog post updated successfully');
    });

    it('should return 404 if blog post not found', async () => {
      const response = await request(app)
        .put('/api/blogs/non-existent')
        .send({ title: 'New Title' })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Blog post not found');
    });

    it('should return 400 if new slug conflicts', async () => {
      await BlogPost.create(createMockBlogPost({ slug: 'existing-slug' }));
      await BlogPost.create(createMockBlogPost({ slug: 'to-update' }));

      const response = await request(app)
        .put('/api/blogs/to-update')
        .send({ slug: 'existing-slug' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('slug already exists');
    });
  });

  describe('DELETE /api/blogs/:slug', () => {
    it('should delete a blog post', async () => {
      const mockPost = createMockBlogPost({ slug: 'delete-test' });
      await BlogPost.create(mockPost);

      const response = await request(app)
        .delete('/api/blogs/delete-test')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Blog post deleted successfully');

      // Verify it's deleted
      const deleted = await BlogPost.findOne({ slug: 'delete-test' });
      expect(deleted).toBeNull();
    });

    it('should return 404 if blog post not found', async () => {
      const response = await request(app)
        .delete('/api/blogs/non-existent')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Blog post not found');
    });
  });

  describe('GET /api/blogs/categories', () => {
    it('should return all unique categories', async () => {
      const mockPosts = createMockBlogPosts(5);
      await BlogPost.insertMany(mockPosts);

      const response = await request(app)
        .get('/api/blogs/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toContain('Category A');
      expect(response.body.data).toContain('Category B');
    });

    it('should return empty array when no posts exist', async () => {
      const response = await request(app)
        .get('/api/blogs/categories')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /api/blogs/tags', () => {
    it('should return all unique tags', async () => {
      const mockPosts = createMockBlogPosts(5);
      await BlogPost.insertMany(mockPosts);

      const response = await request(app).get('/api/blogs/tags').expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should return empty array when no posts exist', async () => {
      const response = await request(app).get('/api/blogs/tags').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });
});

