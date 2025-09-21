/**
 * Reddit API Integration - Main Export
 */

export { RedditApiClient, redditClient } from './client';
export {
  TARGET_SUBREDDITS,
  getEnabledSubreddits,
  getSubredditsByCategory,
  getCategories,
  isTargetSubreddit,
} from './subreddits';
export type {
  RedditAuthToken,
  RedditPost,
  RedditComment,
  RedditListing,
  SubredditConfig,
  RedditApiError,
  PostSortType,
  PostTimeRange,
} from './types';
