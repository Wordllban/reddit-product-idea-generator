/**
 * Mock Data Service
 *
 * Provides mock data for testing the Ideas Page functionality
 * Simulates API responses with filtering, sorting, and pagination
 */

import mockIdeas from './product-ideas.json';
import type { ProductIdea } from '@/components/idea-card';

// ============================================================================
// INTERFACES
// ============================================================================

export interface MockApiResponse {
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

export interface MockGenerationResponse {
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

export interface MockFilters {
  category?: string;
  minScore?: number;
  limit?: number;
  sortBy?: 'newest' | 'score' | 'category';
  searchQuery?: string;
}

// ============================================================================
// MOCK DATA TRANSFORMATION
// ============================================================================

/**
 * Transform mock database format to API format
 */
function transformMockIdea(mockIdea: any): ProductIdea {
  return {
    id: mockIdea.id,
    name: mockIdea.name,
    elevatorPitch: mockIdea.elevator_pitch,
    targetAudience: mockIdea.target_audience,
    painPointSolved: mockIdea.pain_point_solved,
    solutionApproach: mockIdea.solution_approach,
    scoring: {
      overall: mockIdea.overall_score,
      painSeverity: mockIdea.pain_severity_score,
      marketSize: mockIdea.market_size_score,
      competition: mockIdea.competition_score,
      implementationDifficulty: mockIdea.implementation_difficulty,
    },
    category: mockIdea.category,
    tags: mockIdea.tags,
    createdAt: mockIdea.created_at,
    sourceSubreddits: mockIdea.source_subreddits,
    sourceUrls: mockIdea.source_urls,
    isNew: isNewIdea(mockIdea.created_at),
  };
}

/**
 * Check if idea is "new" (created within last 48 hours)
 */
function isNewIdea(createdAt: string): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return diffHours <= 48;
}

// ============================================================================
// MOCK DATA SERVICE
// ============================================================================

export class MockDataService {
  private static instance: MockDataService;
  private ideas: ProductIdea[];

  private constructor() {
    this.ideas = mockIdeas.ideas.map(transformMockIdea);
  }

  public static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService();
    }
    return MockDataService.instance;
  }

  /**
   * Simulate fetching ideas with filters
   */
  async fetchIdeas(filters: MockFilters = {}): Promise<MockApiResponse> {
    // Simulate API delay
    await this.delay(300 + Math.random() * 200);

    try {
      let filteredIdeas = [...this.ideas];

      // Apply search filter
      if (filters.searchQuery?.trim()) {
        const query = filters.searchQuery.toLowerCase();
        filteredIdeas = filteredIdeas.filter(
          (idea) =>
            idea.name.toLowerCase().includes(query) ||
            idea.elevatorPitch.toLowerCase().includes(query) ||
            idea.painPointSolved.toLowerCase().includes(query) ||
            idea.targetAudience.toLowerCase().includes(query) ||
            idea.tags.some((tag) => tag.toLowerCase().includes(query)),
        );
      }

      // Apply category filter
      if (filters.category && filters.category !== 'All') {
        filteredIdeas = filteredIdeas.filter(
          (idea) => idea.category === filters.category,
        );
      }

      // Apply minimum score filter
      if (filters.minScore && filters.minScore > 0) {
        filteredIdeas = filteredIdeas.filter(
          (idea) => idea.scoring.overall >= filters.minScore!,
        );
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          filteredIdeas.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
          break;
        case 'score':
          filteredIdeas.sort((a, b) => b.scoring.overall - a.scoring.overall);
          break;
        case 'category':
          filteredIdeas.sort((a, b) => a.category.localeCompare(b.category));
          break;
        default:
          // Default to newest
          filteredIdeas.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );
      }

      // Apply limit
      const limit = filters.limit || 20;
      const limitedIdeas = filteredIdeas.slice(0, limit);

      return {
        success: true,
        ideas: limitedIdeas,
        total: limitedIdeas.length,
        filters: {
          category: filters.category,
          minScore: filters.minScore || 0,
          limit,
        },
      };
    } catch (error) {
      return {
        success: false,
        ideas: [],
        total: 0,
        filters: {
          minScore: 0,
          limit: 20,
        },
        error: 'Failed to fetch ideas',
        message: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Simulate generating new ideas
   */
  async generateIdeas(config?: any): Promise<MockGenerationResponse> {
    // Simulate longer processing time for generation
    await this.delay(2000 + Math.random() * 1000);

    try {
      // Simulate generating 3-5 new ideas
      const newIdeasCount = Math.floor(Math.random() * 3) + 3;
      const batchId = `batch_${Date.now()}`;

      // Create some new mock ideas (in a real implementation, this would call the LLM)
      const newIdeas: ProductIdea[] = [];
      for (let i = 0; i < newIdeasCount; i++) {
        const newIdea: ProductIdea = {
          id: `generated_${Date.now()}_${i}`,
          name: `Generated Idea ${i + 1}`,
          elevatorPitch: `This is a freshly generated product idea addressing current market needs.`,
          targetAudience: `Target audience for generated idea ${i + 1}`,
          painPointSolved: `Solving pain point ${
            i + 1
          } identified from recent Reddit discussions`,
          solutionApproach: `Innovative solution approach for idea ${i + 1}`,
          scoring: {
            overall: Math.floor(Math.random() * 30) + 70, // 70-100 range
            painSeverity: Math.floor(Math.random() * 30) + 70,
            marketSize: Math.floor(Math.random() * 30) + 70,
            competition: Math.floor(Math.random() * 30) + 70,
            implementationDifficulty: Math.floor(Math.random() * 30) + 40,
          },
          category: ['Business', 'Technology', 'Lifestyle'][
            Math.floor(Math.random() * 3)
          ],
          tags: [`tag${i + 1}`, 'generated', 'new'],
          createdAt: new Date().toISOString(),
          sourceSubreddits: ['entrepreneur', 'startups'],
          sourceUrls: [`https://reddit.com/r/entrepreneur/generated_${i + 1}`],
          isNew: true,
        };
        newIdeas.push(newIdea);
      }

      // Add new ideas to the beginning of the list
      this.ideas = [...newIdeas, ...this.ideas];

      return {
        success: true,
        message: `Generated ${newIdeasCount} new product ideas from Reddit discussions`,
        data: {
          ideasGenerated: newIdeasCount,
          subredditsProcessed: 7,
          postsAnalyzed: Math.floor(Math.random() * 50) + 20,
          processingTime: 2500,
          batchId,
          ideas: newIdeas.slice(0, 10), // Return first 10 ideas
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to generate ideas',
        data: {
          ideasGenerated: 0,
          subredditsProcessed: 0,
          postsAnalyzed: 0,
          processingTime: 0,
          batchId: '',
          ideas: [],
        },
        errors: [error instanceof Error ? error.message : 'Unknown error'],
      };
    }
  }

  /**
   * Get all available categories
   */
  getCategories(): string[] {
    const categories = [...new Set(this.ideas.map((idea) => idea.category))];
    return ['All', ...categories.sort()];
  }

  /**
   * Get statistics about the mock data
   */
  getStats() {
    const total = this.ideas.length;
    const categories = this.getCategories().filter((cat) => cat !== 'All');
    const categoryStats = categories.reduce((acc, cat) => {
      acc[cat] = this.ideas.filter((idea) => idea.category === cat).length;
      return acc;
    }, {} as Record<string, number>);

    const scoreRanges = {
      '80-100': this.ideas.filter((idea) => idea.scoring.overall >= 80).length,
      '70-79': this.ideas.filter(
        (idea) => idea.scoring.overall >= 70 && idea.scoring.overall < 80,
      ).length,
      '60-69': this.ideas.filter(
        (idea) => idea.scoring.overall >= 60 && idea.scoring.overall < 70,
      ).length,
      'below-60': this.ideas.filter((idea) => idea.scoring.overall < 60).length,
    };

    const newIdeas = this.ideas.filter((idea) => idea.isNew).length;

    return {
      total,
      categories: categoryStats,
      scoreRanges,
      newIdeas,
    };
  }

  /**
   * Reset mock data to original state
   */
  reset(): void {
    this.ideas = mockIdeas.ideas.map(transformMockIdea);
  }

  /**
   * Simulate API delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const mockDataService = MockDataService.getInstance();
