import mongoose, { Schema } from 'mongoose';

/**
 * Token Blacklist Schema
 * Stores invalidated JWT tokens until they expire
 */
const TokenBlacklistSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 }, // Auto-delete expired tokens
    },
  },
  {
    timestamps: true,
  }
);

export const TokenBlacklist = mongoose.model('TokenBlacklist', TokenBlacklistSchema);

