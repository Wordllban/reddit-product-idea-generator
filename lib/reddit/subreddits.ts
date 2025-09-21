/**
 * Target Subreddits Configuration
 *
 * Curated list of subreddits for product idea discovery
 */

import type { SubredditConfig } from './types';

export const TARGET_SUBREDDITS: SubredditConfig[] = [
  {
    name: 'entrepreneur',
    category: 'Business',
    description: 'Startup problems and entrepreneurial challenges',
    priority: 5,
    enabled: true,
  },
  {
    name: 'smallbusiness',
    category: 'Business',
    description: 'Small business pain points and operational issues',
    priority: 4,
    enabled: true,
  },
  {
    name: 'SaaS',
    category: 'Software',
    description: 'Software as a Service needs and market gaps',
    priority: 5,
    enabled: true,
  },
  {
    name: 'webdev',
    category: 'Technology',
    description: 'Web development tools and workflow challenges',
    priority: 4,
    enabled: true,
  },
  {
    name: 'productivity',
    category: 'Lifestyle',
    description: 'Productivity tools and workflow optimization',
    priority: 4,
    enabled: true,
  },
  {
    name: 'freelance',
    category: 'Business',
    description: 'Freelancer challenges and business needs',
    priority: 3,
    enabled: true,
  },
  {
    name: 'startups',
    category: 'Business',
    description: 'Startup ecosystem and market opportunities',
    priority: 5,
    enabled: true,
  },
];

/**
 * Gets enabled subreddits sorted by priority
 */
export function getEnabledSubreddits(): SubredditConfig[] {
  return TARGET_SUBREDDITS.filter((sub) => sub.enabled).sort(
    (a, b) => b.priority - a.priority,
  );
}

/**
 * Gets subreddits by category
 */
export function getSubredditsByCategory(category: string): SubredditConfig[] {
  return TARGET_SUBREDDITS.filter(
    (sub) =>
      sub.category.toLowerCase() === category.toLowerCase() && sub.enabled,
  );
}

/**
 * Gets all unique categories
 */
export function getCategories(): string[] {
  return [...new Set(TARGET_SUBREDDITS.map((sub) => sub.category))];
}

/**
 * Validates if a subreddit is in our target list
 */
export function isTargetSubreddit(subredditName: string): boolean {
  return TARGET_SUBREDDITS.some(
    (sub) => sub.name.toLowerCase() === subredditName.toLowerCase(),
  );
}
