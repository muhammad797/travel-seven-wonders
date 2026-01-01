import { Document } from 'mongoose';

/**
 * Blog Post interface extending Mongoose Document
 */
export interface IBlogPost extends Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: Date;
  readTime: number; // in minutes
  category: string;
  image: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Blog Post creation input (without auto-generated fields)
 */
export interface CreateBlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt?: Date;
  readTime: number;
  category: string;
  image: string;
  tags?: string[];
}

/**
 * Blog Post update input (all fields optional except slug)
 */
export interface UpdateBlogPostInput {
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  author?: {
    name: string;
    avatar: string;
  };
  publishedAt?: Date;
  readTime?: number;
  category?: string;
  image?: string;
  tags?: string[];
}

/**
 * Blog Post query filters
 */
export interface BlogPostFilters {
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

/**
 * Paginated blog posts response
 */
export interface PaginatedBlogPosts {
  data: IBlogPost[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

