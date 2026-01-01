import { BlogPost } from './blog.model';
import {
  IBlogPost,
  CreateBlogPostInput,
  UpdateBlogPostInput,
  BlogPostFilters,
  PaginatedBlogPosts,
} from './blog.types';
import logger from '../../utils/logger';

/**
 * Blog Service - Contains all business logic for blog operations
 */
export class BlogService {
  /**
   * Get all blog posts with optional filtering and pagination
   */
  async getAllBlogPosts(filters: BlogPostFilters = {}): Promise<PaginatedBlogPosts> {
    const { category, tag, page = 1, limit = 10 } = filters;

    const query: any = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Pagination
    const pageNumber = Math.max(1, page);
    const limitNumber = Math.max(1, Math.min(100, limit)); // Cap at 100
    const skip = (pageNumber - 1) * limitNumber;

    try {
      const [posts, total] = await Promise.all([
        BlogPost.find(query)
          .sort({ publishedAt: -1 })
          .skip(skip)
          .limit(limitNumber)
          .lean(),
        BlogPost.countDocuments(query),
      ]);

      return {
        data: posts as IBlogPost[],
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          pages: Math.ceil(total / limitNumber),
        },
      };
    } catch (error) {
      logger.error('Error fetching blog posts:', error);
      throw error;
    }
  }

  /**
   * Get a single blog post by slug
   */
  async getBlogPostBySlug(slug: string): Promise<IBlogPost | null> {
    try {
      const post = await BlogPost.findOne({ slug }).lean();
      return post as IBlogPost | null;
    } catch (error) {
      logger.error('Error fetching blog post:', error);
      throw error;
    }
  }

  /**
   * Create a new blog post
   */
  async createBlogPost(postData: CreateBlogPostInput): Promise<IBlogPost> {
    try {
      // Check if slug already exists
      const existingPost = await BlogPost.findOne({ slug: postData.slug });
      if (existingPost) {
        throw new Error('A blog post with this slug already exists');
      }

      const newPost = new BlogPost({
        ...postData,
        publishedAt: postData.publishedAt || new Date(),
        tags: postData.tags || [],
      });

      const savedPost = await newPost.save();
      return savedPost.toObject() as IBlogPost;
    } catch (error) {
      logger.error('Error creating blog post:', error);
      if ((error as any).code === 11000) {
        throw new Error('A blog post with this slug already exists');
      }
      throw error;
    }
  }

  /**
   * Update a blog post by slug
   */
  async updateBlogPost(
    slug: string,
    updateData: UpdateBlogPostInput
  ): Promise<IBlogPost | null> {
    try {
      // Don't allow updating the slug if it conflicts with another post
      if (updateData.slug && updateData.slug !== slug) {
        const existingPost = await BlogPost.findOne({ slug: updateData.slug });
        if (existingPost) {
          throw new Error('A blog post with this slug already exists');
        }
      }

      const updatedPost = await BlogPost.findOneAndUpdate(
        { slug },
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      ).lean();

      return updatedPost as IBlogPost | null;
    } catch (error) {
      logger.error('Error updating blog post:', error);
      if ((error as any).code === 11000) {
        throw new Error('A blog post with this slug already exists');
      }
      throw error;
    }
  }

  /**
   * Delete a blog post by slug
   */
  async deleteBlogPost(slug: string): Promise<boolean> {
    try {
      const result = await BlogPost.findOneAndDelete({ slug });
      return !!result;
    } catch (error) {
      logger.error('Error deleting blog post:', error);
      throw error;
    }
  }

  /**
   * Get all unique categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const categories = await BlogPost.distinct('category');
      return categories.sort();
    } catch (error) {
      logger.error('Error fetching categories:', error);
      throw error;
    }
  }

  /**
   * Get all unique tags
   */
  async getTags(): Promise<string[]> {
    try {
      const tags = await BlogPost.distinct('tags');
      return tags.sort();
    } catch (error) {
      logger.error('Error fetching tags:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const blogService = new BlogService();

