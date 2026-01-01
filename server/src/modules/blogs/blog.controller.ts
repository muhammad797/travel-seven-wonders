import { Request, Response } from 'express';
import { blogService } from './blog.service';
import { CreateBlogPostInput, UpdateBlogPostInput } from './blog.types';
import logger from '../../utils/logger';
import { NODE_ENV } from '../../config/env';

/**
 * Blog Controller - Handles HTTP requests and responses
 */
export class BlogController {
  /**
   * Get all blog posts with optional filtering
   */
  getAllBlogPosts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category, tag, limit, page } = req.query;

      const filters = {
        category: category as string | undefined,
        tag: tag as string | undefined,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      };

      const result = await blogService.getAllBlogPosts(filters);

      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (error) {
      logger.error('Error fetching blog posts:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch blog posts',
        error: NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };

  /**
   * Get a single blog post by slug
   */
  getBlogPostBySlug = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;

      const post = await blogService.getBlogPostBySlug(slug);

      if (!post) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found',
        });
        return;
      }

      res.json({
        success: true,
        data: post,
      });
    } catch (error) {
      logger.error('Error fetching blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch blog post',
        error: NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };

  /**
   * Create a new blog post
   */
  createBlogPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const postData: CreateBlogPostInput = req.body;

      const newPost = await blogService.createBlogPost(postData);

      res.status(201).json({
        success: true,
        data: newPost,
        message: 'Blog post created successfully',
      });
    } catch (error) {
      logger.error('Error creating blog post:', error);

      const errorMessage = (error as Error).message;

      if (errorMessage.includes('slug already exists')) {
        res.status(400).json({
          success: false,
          message: errorMessage,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to create blog post',
        error: NODE_ENV === 'development' ? errorMessage : undefined,
      });
    }
  };

  /**
   * Update a blog post by slug
   */
  updateBlogPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;
      const updateData: UpdateBlogPostInput = req.body;

      const updatedPost = await blogService.updateBlogPost(slug, updateData);

      if (!updatedPost) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found',
        });
        return;
      }

      res.json({
        success: true,
        data: updatedPost,
        message: 'Blog post updated successfully',
      });
    } catch (error) {
      logger.error('Error updating blog post:', error);

      const errorMessage = (error as Error).message;

      if (errorMessage.includes('slug already exists')) {
        res.status(400).json({
          success: false,
          message: errorMessage,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Failed to update blog post',
        error: NODE_ENV === 'development' ? errorMessage : undefined,
      });
    }
  };

  /**
   * Delete a blog post by slug
   */
  deleteBlogPost = async (req: Request, res: Response): Promise<void> => {
    try {
      const { slug } = req.params;

      const deleted = await blogService.deleteBlogPost(slug);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Blog post not found',
        });
        return;
      }

      res.json({
        success: true,
        message: 'Blog post deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting blog post:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete blog post',
        error: NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };

  /**
   * Get all unique categories
   */
  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const categories = await blogService.getCategories();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error) {
      logger.error('Error fetching categories:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };

  /**
   * Get all unique tags
   */
  getTags = async (req: Request, res: Response): Promise<void> => {
    try {
      const tags = await blogService.getTags();

      res.json({
        success: true,
        data: tags,
      });
    } catch (error) {
      logger.error('Error fetching tags:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tags',
        error: NODE_ENV === 'development' ? (error as Error).message : undefined,
      });
    }
  };
}

// Export a singleton instance
export const blogController = new BlogController();

