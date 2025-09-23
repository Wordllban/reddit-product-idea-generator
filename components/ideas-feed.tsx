/**
 * Ideas Feed Component
 *
 * Main interface for browsing, filtering, and searching product ideas
 * Includes all MVP requirements: filtering, search, sorting, and pagination
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import IdeaCard from '@/components/idea-card';
import {
  Search,
  Filter,
  RefreshCw,
  Sparkles,
  AlertCircle,
  SlidersHorizontal,
  TrendingUp,
  Clock,
  Star,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useIdeas } from '@/hooks/use-ideas-query';

// ============================================================================
// INTERFACES
// ============================================================================

interface IdeasFeedProps {
  className?: string;
}

interface FilterState {
  category: string;
  minScore: number;
  sortBy: 'newest' | 'score' | 'category';
  searchQuery: string;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

// Interfaces moved to useIdeasApi hook

// ============================================================================
// CONSTANTS
// ============================================================================

// Categories will be loaded dynamically from the API hook
const MIN_SCORE_OPTIONS = [0, 20, 40, 60, 80];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First', icon: Clock },
  { value: 'score', label: 'Highest Scored', icon: Star },
  { value: 'category', label: 'By Category', icon: TrendingUp },
];

// ============================================================================
// COMPONENT
// ============================================================================

export function IdeasFeed({ className = '' }: IdeasFeedProps) {
  // State Management
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    minScore: 0,
    sortBy: 'newest',
    searchQuery: '',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
  });

  // TanStack Query Hook
  const {
    ideas,
    categories,
    isLoading,
    isGenerating,
    error,
    generateIdeas,
    usingMockData,
  } = useIdeas({
    category: filters.category,
    minScore: filters.minScore,
    limit: 50, // Fetch more for client-side filtering
    // Note: sortBy and searchQuery will be handled client-side for now
  });

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleGenerateIdeas = () => {
    generateIdeas({
      maxPostsPerSubreddit: 10,
      maxCommentsPerPost: 5,
      minPostScore: 5,
      minCommentScore: 3,
    });
  };

  // ============================================================================
  // CLIENT-SIDE FILTERING AND SORTING
  // ============================================================================

  const filteredAndSortedIdeas = useMemo(() => {
    let result = [...ideas];

    // Apply search filter (client-side)
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(
        (idea) =>
          idea.name.toLowerCase().includes(query) ||
          idea.elevatorPitch.toLowerCase().includes(query) ||
          idea.painPointSolved.toLowerCase().includes(query) ||
          idea.targetAudience.toLowerCase().includes(query) ||
          idea.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Category and minScore filtering is handled server-side via TanStack Query
    // Apply sorting (client-side)
    switch (filters.sortBy) {
      case 'newest':
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        break;
      case 'score':
        result.sort((a, b) => b.scoring.overall - a.scoring.overall);
        break;
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category));
        break;
    }

    return result;
  }, [ideas, filters.searchQuery, filters.sortBy]);

  // Pagination logic
  const paginatedIdeas = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    return filteredAndSortedIdeas.slice(startIndex, endIndex);
  }, [filteredAndSortedIdeas, pagination.currentPage, pagination.itemsPerPage]);

  const totalPages = Math.ceil(
    filteredAndSortedIdeas.length / pagination.itemsPerPage,
  );

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    // Update pagination when filtered results change
    setPagination((prev) => ({
      ...prev,
      totalItems: filteredAndSortedIdeas.length,
      currentPage: 1, // Reset to first page when filters change
    }));
  }, [
    filteredAndSortedIdeas.length,
    filters.category,
    filters.minScore,
    filters.searchQuery,
    filters.sortBy,
  ]);

  const handleFilterChange = (
    key: keyof FilterState,
    value: string | number,
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: 'All',
      minScore: 0,
      sortBy: 'newest',
      searchQuery: '',
    });
  };

  const handleViewSource = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderLoadingState = () => (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="h-96">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="space-y-2">
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-2 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderEmptyState = () => (
    <Card className="text-center py-12">
      <CardContent>
        <Sparkles className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No Ideas Found</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {filteredAndSortedIdeas.length === 0 && ideas.length > 0
            ? 'No ideas match your current filters. Try adjusting your search criteria.'
            : 'Generate your first batch of product ideas from Reddit discussions.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={handleGenerateIdeas} disabled={isGenerating}>
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate Ideas'}
          </Button>
          {filteredAndSortedIdeas.length === 0 && ideas.length > 0 && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderErrorState = () => (
    <Card className="text-center py-12 border-red-200">
      <CardContent>
        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h3 className="text-xl font-semibold mb-2">Error Loading Ideas</h3>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          {error || 'Something went wrong while loading ideas.'}
        </p>
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </Button>
      </CardContent>
    </Card>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div
      className={`space-y-6 ${className}`}
      role="main"
      aria-labelledby="ideas-heading"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold" id="ideas-heading">
            Product Ideas
            {usingMockData && (
              <Badge variant="outline" className="ml-2 text-xs">
                Mock Data
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">
            {filteredAndSortedIdeas.length > 0
              ? `Showing ${
                  (pagination.currentPage - 1) * pagination.itemsPerPage + 1
                }-${Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  filteredAndSortedIdeas.length,
                )} of ${filteredAndSortedIdeas.length} ideas`
              : 'Discover product opportunities from Reddit discussions'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button onClick={handleGenerateIdeas} disabled={isGenerating}>
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate New'}
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Search */}
              <div>
                <Label htmlFor="search">Search Ideas</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search by name, pitch, or pain point..."
                    value={filters.searchQuery}
                    onChange={(e) =>
                      handleFilterChange('searchQuery', e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    handleFilterChange('category', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Minimum Score Filter */}
              <div>
                <Label htmlFor="minScore">Minimum Score</Label>
                <Select
                  value={filters.minScore.toString()}
                  onValueChange={(value) =>
                    handleFilterChange('minScore', parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select min score" />
                  </SelectTrigger>
                  <SelectContent>
                    {MIN_SCORE_OPTIONS.map((score) => (
                      <SelectItem key={score} value={score.toString()}>
                        {score}+ points
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div>
                <Label htmlFor="sortBy">Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) =>
                    handleFilterChange('sortBy', value as FilterState['sortBy'])
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => {
                      const Icon = option.icon;
                      return (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4" />
                            {option.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(filters.searchQuery ||
              filters.category !== 'All' ||
              filters.minScore > 0) && (
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">
                  Active filters:
                </span>
                {filters.searchQuery && (
                  <Badge variant="secondary">
                    Search: &quot;{filters.searchQuery}&quot;
                  </Badge>
                )}
                {filters.category !== 'All' && (
                  <Badge variant="secondary">
                    Category: {filters.category}
                  </Badge>
                )}
                {filters.minScore > 0 && (
                  <Badge variant="secondary">
                    Min Score: {filters.minScore}+
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Content Section */}
      {error ? (
        renderErrorState()
      ) : isLoading ? (
        renderLoadingState()
      ) : filteredAndSortedIdeas.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2">
            {paginatedIdeas.map((idea, index) => (
              <IdeaCard
                key={idea.id || index}
                idea={idea}
                onViewSource={handleViewSource}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {pagination.currentPage} of {totalPages}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else {
                            const start = Math.max(
                              1,
                              pagination.currentPage - 2,
                            );
                            const end = Math.min(totalPages, start + 4);
                            pageNum = start + i;
                            if (pageNum > end) return null;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                pagination.currentPage === pageNum
                                  ? 'default'
                                  : 'outline'
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="w-8 h-8 p-0"
                              aria-label={`Go to page ${pageNum}`}
                              aria-current={
                                pagination.currentPage === pageNum
                                  ? 'page'
                                  : undefined
                              }
                            >
                              {pageNum}
                            </Button>
                          );
                        },
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={pagination.currentPage === totalPages}
                      aria-label="Next page"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

export default IdeasFeed;
