/**
 * Ideas Query Hook using TanStack Query
 *
 * Provides a clean interface for fetching and managing ideas data
 * with built-in caching, loading states, and error handling
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { config } from '@/lib/config';
import {
  fetchIdeas,
  generateIdeas,
  getCategories,
  getIdeasStats,
  resetMockData,
  type FetchIdeasParams,
  type GenerateIdeasParams,
} from '@/lib/api/ideas-api';

// ============================================================================
// QUERY KEYS
// ============================================================================

export const ideasQueryKeys = {
  all: ['ideas'] as const,
  lists: () => [...ideasQueryKeys.all, 'list'] as const,
  list: (params: FetchIdeasParams) =>
    [...ideasQueryKeys.lists(), params] as const,
  categories: () => [...ideasQueryKeys.all, 'categories'] as const,
  stats: () => [...ideasQueryKeys.all, 'stats'] as const,
};

// ============================================================================
// HOOKS
// ============================================================================

/**
 * Hook for fetching ideas with filtering, sorting, and search
 */
export function useIdeasQuery(params: FetchIdeasParams = {}) {
  return useQuery({
    queryKey: ideasQueryKeys.list(params),
    queryFn: () => fetchIdeas(params),
    // Enable the query only if we have valid parameters
    enabled: true,
    // Stale time: 5 minutes for ideas data
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook for generating new ideas
 */
export function useGenerateIdeasMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: GenerateIdeasParams = {}) => generateIdeas(params),
    onMutate: () => {
      // Show loading toast
      toast.info('Starting idea generation...', {
        description:
          'This may take a few minutes to analyze Reddit discussions',
      });
    },
    onSuccess: (data) => {
      if (data.success) {
        // Show success toast
        toast.success(data.message, {
          description: `Processing time: ${Math.round(
            data.data.processingTime / 1000,
          )}s`,
        });

        // Invalidate and refetch ideas queries to get the new data
        queryClient.invalidateQueries({
          queryKey: ideasQueryKeys.lists(),
        });

        // Optionally update the cache with new ideas
        if (data.data.ideas && data.data.ideas.length > 0) {
          queryClient.setQueryData(ideasQueryKeys.list({}), (oldData: any) => {
            if (oldData) {
              return {
                ...oldData,
                ideas: [...data.data.ideas, ...oldData.ideas],
                total: oldData.total + data.data.ideas.length,
              };
            }
            return oldData;
          });
        }
      }
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to generate ideas';
      toast.error('Generation failed', {
        description: errorMessage,
      });
    },
  });
}

/**
 * Hook for getting available categories
 */
export function useCategoriesQuery() {
  return useQuery({
    queryKey: ideasQueryKeys.categories(),
    queryFn: getCategories,
    // Categories rarely change, cache for longer
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook for getting ideas statistics
 */
export function useIdeasStatsQuery() {
  return useQuery({
    queryKey: ideasQueryKeys.stats(),
    queryFn: getIdeasStats,
    // Stats update when ideas change, shorter cache
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook for resetting mock data (development only)
 */
export function useResetMockDataMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      resetMockData();
      return Promise.resolve();
    },
    onSuccess: () => {
      if (config.development.useMockData) {
        toast.success('Mock data reset to original state');

        // Invalidate all ideas queries to refetch fresh data
        queryClient.invalidateQueries({
          queryKey: ideasQueryKeys.all,
        });
      }
    },
  });
}

/**
 * Combined hook that provides all ideas-related functionality
 * This is the main hook that components should use
 */
export function useIdeas(params: FetchIdeasParams = {}) {
  const ideasQuery = useIdeasQuery(params);
  const generateMutation = useGenerateIdeasMutation();
  const categoriesQuery = useCategoriesQuery();
  const statsQuery = useIdeasStatsQuery();
  const resetMutation = useResetMockDataMutation();

  return {
    // Data
    ideas: ideasQuery.data?.ideas || [],
    total: ideasQuery.data?.total || 0,
    categories: categoriesQuery.data || [],
    stats: statsQuery.data,

    // Loading states
    isLoading: ideasQuery.isLoading,
    isGenerating: generateMutation.isPending,
    isCategoriesLoading: categoriesQuery.isLoading,
    isStatsLoading: statsQuery.isLoading,

    // Error states
    error: ideasQuery.error?.message || null,
    generateError: generateMutation.error?.message || null,

    // Actions
    generateIdeas: generateMutation.mutate,
    resetMockData: resetMutation.mutate,
    refetch: ideasQuery.refetch,

    // Query states
    isError: ideasQuery.isError,
    isSuccess: ideasQuery.isSuccess,
    isFetching: ideasQuery.isFetching,

    // Configuration
    usingMockData: config.development.useMockData,
  };
}
