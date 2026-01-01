import mongoose, { Schema } from 'mongoose';
import { IBlogPost } from './blog.types';

const BlogPostSchema = new Schema<IBlogPost>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      avatar: {
        type: String,
        required: true,
        trim: true,
      },
    },
    publishedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    readTime: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Indexes for better query performance
BlogPostSchema.index({ category: 1, publishedAt: -1 });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ publishedAt: -1 });

export const BlogPost = mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

