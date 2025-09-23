/**
 * Ideas API Service
 *
 * Pure API functions for TanStack Query to consume
 * Handles both mock data and real API calls
 */

import { config } from '@/lib/config';
import { mockDataService } from '@/mocks/mock-data-service';
import type { ProductIdea } from '@/components/idea-card';

// ============================================================================
// INTERFACES
// ============================================================================

export interface FetchIdeasParams {
  category?: string;
  minScore?: number;
  limit?: number;
  sortBy?: 'newest' | 'score' | 'category';
  searchQuery?: string;
}

export interface FetchIdeasResponse {
  success: boolean;
  ideas: ProductIdea[];
  total: number;
  filters: {
    category?: string;
    minScore: number;
    limit: number;
  };
  error?: string;
  message?: string;
}

export interface GenerateIdeasParams {
  maxPostsPerSubreddit?: number;
  maxCommentsPerPost?: number;
  minPostScore?: number;
  minCommentScore?: number;
}

export interface GenerateIdeasResponse {
  success: boolean;
  message: string;
  data: {
    ideasGenerated: number;
    subredditsProcessed: number;
    postsAnalyzed: number;
    processingTime: number;
    batchId: string;
    ideas: ProductIdea[];
  };
  errors?: string[];
}

export interface IdeasStats {
  total: number;
  categories: Record<string, number>;
  scoreRanges: Record<string, number>;
  newIdeas: number;
}

// ============================================================================
// API FUNCTIONS
// ============================================================================

/**
 * Fetch ideas with optional filtering
 */
export async function fetchIdeas(
  params: FetchIdeasParams = {},
): Promise<FetchIdeasResponse> {
  console.log('📡 fetchIdeas called - Config evaluation:', {
    NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
    NODE_ENV: process.env.NODE_ENV,
    useMockData: config.development.useMockData,
  });

  if (config.development.useMockData) {
    // Use mock data service
    console.log('🔧 Using mock data service for fetchIdeas');
    return await mockDataService.fetchIdeas({
      category: params.category,
      minScore: params.minScore,
      limit: params.limit,
      sortBy: params.sortBy,
      searchQuery: params.searchQuery,
    });
  } else {
    // Use real API
    console.log('🌐 Using real API for fetchIdeas');
    const queryParams = new URLSearchParams({
      limit: (params.limit || 20).toString(),
      minScore: (params.minScore || 0).toString(),
    });

    if (params.category && params.category !== 'All') {
      queryParams.append('category', params.category);
    }

    const response = await fetch(`/api/ideas/generate?${queryParams}`);
    const data: FetchIdeasResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch ideas');
    }

    return data;
  }
}

/**
 * Generate new ideas
 */
export async function generateIdeas(
  params: GenerateIdeasParams = {},
): Promise<GenerateIdeasResponse> {
  if (config.development.useMockData) {
    // Use mock data service
    console.log('🔧 Using mock data service for generateIdeas');
    return await mockDataService.generateIdeas(params);
  } else {
    // Use real API
    console.log('🌐 Using real API for generateIdeas');
    const response = await fetch('/api/ideas/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config: {
          maxPostsPerSubreddit: params.maxPostsPerSubreddit || 10,
          maxCommentsPerPost: params.maxCommentsPerPost || 5,
          minPostScore: params.minPostScore || 5,
          minCommentScore: params.minCommentScore || 3,
        },
      }),
    });

    const data: GenerateIdeasResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to generate ideas');
    }

    return data;
  }
}

/**
 * Get available categories
 */
export function getCategories(): string[] {
  if (config.development.useMockData) {
    return mockDataService.getCategories();
  } else {
    // Default categories from subreddit config
    return ['All', 'Business', 'Software', 'Technology', 'Lifestyle'];
  }
}

/**
 * Get ideas statistics
 */
export function getIdeasStats(): IdeasStats {
  if (config.development.useMockData) {
    return mockDataService.getStats();
  } else {
    // Return empty stats for real API (would need to implement)
    return {
      total: 0,
      categories: {},
      scoreRanges: {},
      newIdeas: 0,
    };
  }
}

/**
 * Reset mock data (development only)
 */
export function resetMockData(): void {
  if (config.development.useMockData) {
    mockDataService.reset();
  }
}
