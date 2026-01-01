import { blogService } from '../blog.service';
import { BlogPost } from '../blog.model';
import { createMockBlogPost, createMockBlogPosts } from '../../../__tests__/helpers/testHelpers';

describe('BlogService', () => {
  describe('getAllBlogPosts', () => {
    it('should return paginated blog posts', async () => {
      // Create test data
      const mockPosts = createMockBlogPosts(15);
      await BlogPost.insertMany(mockPosts);

      const result = await blogService.getAllBlogPosts({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(10);
      expect(result.pagination.total).toBe(15);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.pages).toBe(2);
    });

    it('should filter by category', async () => {
      const mockPosts = createMockBlogPosts(5);
      await BlogPost.insertMany(mockPosts);

      const result = await blogService.getAllBlogPosts({ category: 'Category A' });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((post) => {
        expect(post.category).toBe('Category A');
      });
    });

    it('should filter by tag', async () => {
      const mockPosts = createMockBlogPosts(5);
      await BlogPost.insertMany(mockPosts);

      const result = await blogService.getAllBlogPosts({ tag: 'tag1' });

      expect(result.data.length).toBeGreaterThan(0);
      result.data.forEach((post) => {
        expect(post.tags).toContain('tag1');
      });
    });

    it('should handle pagination correctly', async () => {
      const mockPosts = createMockBlogPosts(25);
      await BlogPost.insertMany(mockPosts);

      const page1 = await blogService.getAllBlogPosts({ page: 1, limit: 10 });
      const page2 = await blogService.getAllBlogPosts({ page: 2, limit: 10 });

      expect(page1.data).toHaveLength(10);
      expect(page2.data).toHaveLength(10);
      expect(page1.data[0].slug).not.toBe(page2.data[0].slug);
    });

    it('should cap limit at 100', async () => {
      const mockPosts = createMockBlogPosts(150);
      await BlogPost.insertMany(mockPosts);

      const result = await blogService.getAllBlogPosts({ limit: 200 });

      expect(result.pagination.limit).toBe(100);
      expect(result.data.length).toBe(100);
    });

    it('should sort by publishedAt descending', async () => {
      const posts = [
        createMockBlogPost({ slug: 'old-post', publishedAt: new Date('2024-01-01') }),
        createMockBlogPost({ slug: 'new-post', publishedAt: new Date('2024-12-31') }),
      ];
      await BlogPost.insertMany(posts);

      const result = await blogService.getAllBlogPosts();

      expect(result.data[0].slug).toBe('new-post');
      expect(result.data[1].slug).toBe('old-post');
    });
  });

  describe('getBlogPostBySlug', () => {
    it('should return a blog post by slug', async () => {
      const mockPost = createMockBlogPost({ slug: 'test-slug' });
      await BlogPost.create(mockPost);

      const result = await blogService.getBlogPostBySlug('test-slug');

      expect(result).not.toBeNull();
      expect(result?.slug).toBe('test-slug');
      expect(result?.title).toBe(mockPost.title);
    });

    it('should return null if blog post not found', async () => {
      const result = await blogService.getBlogPostBySlug('non-existent-slug');

      expect(result).toBeNull();
    });
  });

  describe('createBlogPost', () => {
    it('should create a new blog post', async () => {
      const mockPost = createMockBlogPost({ slug: 'new-post' });

      const result = await blogService.createBlogPost(mockPost);

      expect(result.slug).toBe('new-post');
      expect(result.title).toBe(mockPost.title);
      expect(result._id).toBeDefined();
    });

    it('should throw error if slug already exists', async () => {
      const mockPost = createMockBlogPost({ slug: 'duplicate-slug' });
      await BlogPost.create(mockPost);

      await expect(blogService.createBlogPost(mockPost)).rejects.toThrow(
        'A blog post with this slug already exists'
      );
    });

    it('should set default publishedAt if not provided', async () => {
      const mockPost = createMockBlogPost({ slug: 'auto-date-post' });
      delete mockPost.publishedAt;

      const result = await blogService.createBlogPost(mockPost);

      expect(result.publishedAt).toBeDefined();
      expect(result.publishedAt).toBeInstanceOf(Date);
    });

    it('should set default empty array for tags if not provided', async () => {
      const mockPost = createMockBlogPost({ slug: 'no-tags-post' });
      delete mockPost.tags;

      const result = await blogService.createBlogPost(mockPost);

      expect(result.tags).toEqual([]);
    });
  });

  describe('updateBlogPost', () => {
    it('should update a blog post', async () => {
      const mockPost = createMockBlogPost({ slug: 'update-test' });
      await BlogPost.create(mockPost);

      const updateData = { title: 'Updated Title' };
      const result = await blogService.updateBlogPost('update-test', updateData);

      expect(result).not.toBeNull();
      expect(result?.title).toBe('Updated Title');
      expect(result?.slug).toBe('update-test');
    });

    it('should return null if blog post not found', async () => {
      const result = await blogService.updateBlogPost('non-existent', { title: 'New Title' });

      expect(result).toBeNull();
    });

    it('should throw error if new slug conflicts with existing post', async () => {
      await BlogPost.create(createMockBlogPost({ slug: 'existing-slug' }));
      await BlogPost.create(createMockBlogPost({ slug: 'to-update' }));

      await expect(
        blogService.updateBlogPost('to-update', { slug: 'existing-slug' })
      ).rejects.toThrow('A blog post with this slug already exists');
    });

    it('should allow updating slug to a new unique value', async () => {
      await BlogPost.create(createMockBlogPost({ slug: 'original-slug' }));

      const result = await blogService.updateBlogPost('original-slug', { slug: 'new-slug' });

      expect(result).not.toBeNull();
      expect(result?.slug).toBe('new-slug');
    });
  });

  describe('deleteBlogPost', () => {
    it('should delete a blog post', async () => {
      const mockPost = createMockBlogPost({ slug: 'delete-test' });
      await BlogPost.create(mockPost);

      const result = await blogService.deleteBlogPost('delete-test');

      expect(result).toBe(true);

      const deleted = await BlogPost.findOne({ slug: 'delete-test' });
      expect(deleted).toBeNull();
    });

    it('should return false if blog post not found', async () => {
      const result = await blogService.deleteBlogPost('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('getCategories', () => {
    it('should return all unique categories', async () => {
      const mockPosts = createMockBlogPosts(10);
      await BlogPost.insertMany(mockPosts);

      const result = await blogService.getCategories();

      expect(result).toContain('Category A');
      expect(result).toContain('Category B');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toEqual([...new Set(result)]); // All unique
    });

    it('should return sorted categories', async () => {
      await BlogPost.create(createMockBlogPost({ slug: 'zebra-category', category: 'Zebra' }));
      await BlogPost.create(createMockBlogPost({ slug: 'apple-category', category: 'Apple' }));
      await BlogPost.create(createMockBlogPost({ slug: 'banana-category', category: 'Banana' }));

      const result = await blogService.getCategories();

      expect(result[0]).toBe('Apple');
      expect(result[1]).toBe('Banana');
      expect(result[result.length - 1]).toBe('Zebra');
    });
  });

  describe('getTags', () => {
    it('should return all unique tags', async () => {
      const mockPosts = createMockBlogPosts(10);
      await BlogPost.insertMany(mockPosts);

      const result = await blogService.getTags();

      expect(result).toContain('tag1');
      expect(result).toContain('tag2');
      expect(result).toContain('tag3');
      expect(result).toContain('tag4');
      expect(result.length).toBeGreaterThan(0);
      expect(result).toEqual([...new Set(result)]); // All unique
    });

    it('should return sorted tags', async () => {
      await BlogPost.create(createMockBlogPost({ slug: 'zebra-apple-tags', tags: ['zebra', 'apple'] }));
      await BlogPost.create(createMockBlogPost({ slug: 'banana-tags', tags: ['banana'] }));

      const result = await blogService.getTags();

      expect(result[0]).toBe('apple');
      expect(result[1]).toBe('banana');
      expect(result[result.length - 1]).toBe('zebra');
    });
  });
});

