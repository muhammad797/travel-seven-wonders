/**
 * Blogs API Module
 * 
 * This module provides functions to interact with the blogs API endpoints.
 */

import { API_CONFIG, type ApiResponse, type PaginatedResponse } from './config';

/**
 * Blog Post type matching the API response
 */
export interface BlogPost {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: string | Date;
  readTime: number;
  category: string;
  image: string;
  tags: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

/**
 * Blog Post filters for querying
 */
export interface BlogPostFilters {
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch all blog posts with optional filters
 */
export async function getBlogPosts(filters: BlogPostFilters = {}): Promise<PaginatedResponse<BlogPost>> {
  const params = new URLSearchParams();
  
  if (filters.category) params.append('category', filters.category);
  if (filters.tag) params.append('tag', filters.tag);
  if (filters.page) params.append('page', filters.page.toString());
  if (filters.limit) params.append('limit', filters.limit.toString());

  const url = `${API_CONFIG.baseUrl}/api/blogs${params.toString() ? `?${params.toString()}` : ''}`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      // Provide more detailed error information
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`[Blogs API] Failed to fetch blog posts:`, {
        status: response.status,
        statusText: response.statusText,
        url,
        error: errorText,
      });
      throw new Error(`Failed to fetch blog posts: ${response.status} ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`[Blogs API] Network error fetching from:`, url);
      throw new Error(`Unable to connect to API server at ${API_CONFIG.baseUrl}. Make sure the server is running.`);
    }
    throw error;
  }
}

/**
 * Fetch a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const url = `${API_CONFIG.baseUrl}/api/blogs/${slug}`;
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`[Blogs API] Failed to fetch blog post:`, {
        status: response.status,
        statusText: response.statusText,
        url,
        slug,
        error: errorText,
      });
      throw new Error(`Failed to fetch blog post: ${response.status} ${response.statusText}`);
    }

    const result: ApiResponse<BlogPost> = await response.json();
    return result.data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.error(`[Blogs API] Network error fetching from:`, url);
      throw new Error(`Unable to connect to API server at ${API_CONFIG.baseUrl}. Make sure the server is running.`);
    }
    throw error;
  }
}

/**
 * Fetch all unique categories
 */
export async function getCategories(): Promise<string[]> {
  const url = `${API_CONFIG.baseUrl}/api/blogs/categories`;
  
  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Revalidate every hour (categories don't change often)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  const result: ApiResponse<string[]> = await response.json();
  return result.data;
}

/**
 * Fetch all unique tags
 */
export async function getTags(): Promise<string[]> {
  const url = `${API_CONFIG.baseUrl}/api/blogs/tags`;
  
  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Revalidate every hour (tags don't change often)
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch tags: ${response.statusText}`);
  }

  const result: ApiResponse<string[]> = await response.json();
  return result.data;
}

/**
 * Helper function to normalize blog post data
 * Converts API response format to match frontend expectations
 */
export function normalizeBlogPost(post: BlogPost): BlogPost {
  return {
    ...post,
    id: post._id || post.id || '',
    publishedAt: typeof post.publishedAt === 'string' 
      ? post.publishedAt 
      : post.publishedAt instanceof Date 
        ? post.publishedAt.toISOString()
        : new Date().toISOString(),
  };
}

