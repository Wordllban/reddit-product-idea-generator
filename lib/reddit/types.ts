/**
 * Reddit API Types and Interfaces
 */

export interface RedditAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  created_at: number; // timestamp when token was created
}

export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  subreddit: string;
  subreddit_name_prefixed: string;
  score: number;
  upvote_ratio: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  url: string;
  is_self: boolean;
  over_18: boolean;
  spoiler: boolean;
  stickied: boolean;
  locked: boolean;
}

export interface RedditComment {
  id: string;
  body: string;
  author: string;
  score: number;
  created_utc: number;
  parent_id: string;
  link_id: string;
  subreddit: string;
  permalink: string;
  depth: number;
  is_submitter: boolean;
  stickied: boolean;
}

export interface RedditListing<T> {
  kind: string;
  data: {
    after: string | null;
    before: string | null;
    dist: number;
    children: Array<{
      kind: string;
      data: T;
    }>;
  };
}

export interface SubredditConfig {
  name: string;
  category: string;
  description: string;
  priority: number; // 1-5, higher is more important
  enabled: boolean;
}

export interface RedditApiError {
  message: string;
  error: number;
}

export type PostSortType = 'hot' | 'new' | 'top' | 'rising';
export type PostTimeRange = 'hour' | 'day' | 'week' | 'month' | 'year' | 'all';
