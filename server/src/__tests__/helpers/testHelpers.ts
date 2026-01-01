import { CreateBlogPostInput } from '../../modules/blogs/blog.types';

/**
 * Create a mock blog post data for testing
 */
export const createMockBlogPost = (overrides?: Partial<CreateBlogPostInput>): CreateBlogPostInput => {
  return {
    slug: 'test-blog-post',
    title: 'Test Blog Post',
    excerpt: 'This is a test blog post excerpt',
    content: '# Test Blog Post\n\nThis is the content of the test blog post.',
    author: {
      name: 'Test Author',
      avatar: '/test-avatar.jpg',
    },
    publishedAt: new Date('2024-01-01'),
    readTime: 5,
    category: 'Test Category',
    image: '/test-image.jpg',
    tags: ['test', 'blog'],
    ...overrides,
  };
};

/**
 * Create multiple mock blog posts
 */
export const createMockBlogPosts = (count: number): CreateBlogPostInput[] => {
  return Array.from({ length: count }, (_, i) =>
    createMockBlogPost({
      slug: `test-blog-post-${i + 1}`,
      title: `Test Blog Post ${i + 1}`,
      category: i % 2 === 0 ? 'Category A' : 'Category B',
      tags: i % 2 === 0 ? ['tag1', 'tag2'] : ['tag3', 'tag4'],
    })
  );
};

