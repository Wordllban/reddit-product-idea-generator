/**
 * Idea Card Component
 *
 * Displays individual product ideas with all required MVP fields
 * Includes scoring visualization, source tracking, and "New" badge
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ExternalLink, Users, Target, Lightbulb, Calendar } from 'lucide-react';

// ============================================================================
// INTERFACES
// ============================================================================

export interface ProductIdea {
  id?: string;
  name: string;
  elevatorPitch: string;
  targetAudience: string;
  painPointSolved: string;
  solutionApproach?: string;
  scoring: {
    overall: number; // 0-100
    painSeverity: number;
    marketSize: number;
    competition: number;
    implementationDifficulty: number;
  };
  category: string;
  tags: string[];
  createdAt: string | Date;
  sourceSubreddits: string[];
  sourceUrls?: string[];
  isNew?: boolean;
}

interface IdeaCardProps {
  idea: ProductIdea;
  className?: string;
  onViewSource?: (url: string) => void;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

function getScoreBadgeVariant(
  score: number,
): 'default' | 'secondary' | 'destructive' {
  if (score >= 80) return 'default';
  if (score >= 60) return 'secondary';
  return 'destructive';
}

function isNewIdea(createdAt: string | Date): boolean {
  const created = new Date(createdAt);
  const now = new Date();
  const diffHours = (now.getTime() - created.getTime()) / (1000 * 60 * 60);
  return diffHours <= 48; // New if created within last 48 hours
}

function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// ============================================================================
// COMPONENT
// ============================================================================

export function IdeaCard({
  idea,
  className = '',
  onViewSource,
}: IdeaCardProps) {
  const isNew = idea.isNew ?? isNewIdea(idea.createdAt);

  return (
    <Card
      className={`h-full transition-all duration-200 hover:shadow-lg ${className}`}
      role="article"
      aria-labelledby={`idea-title-${
        idea.id || idea.name.replace(/\s+/g, '-').toLowerCase()
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle
              id={`idea-title-${
                idea.id || idea.name.replace(/\s+/g, '-').toLowerCase()
              }`}
              className="text-lg font-semibold leading-tight mb-2"
            >
              {idea.name}
              {isNew && (
                <Badge
                  variant="default"
                  className="ml-2 bg-blue-600 text-white"
                  aria-label="New idea"
                >
                  New
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formatDate(idea.createdAt)}
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge
              variant={getScoreBadgeVariant(idea.scoring.overall)}
              className="font-mono"
            >
              {idea.scoring.overall}/100
            </Badge>
            <Badge variant="outline" className="text-xs">
              {idea.category}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Elevator Pitch */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-4 h-4 text-yellow-600" />
            <span className="font-medium text-sm">Elevator Pitch</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {idea.elevatorPitch}
          </p>
        </div>

        {/* Target Audience */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-sm">Target Audience</span>
          </div>
          <p className="text-sm text-muted-foreground">{idea.targetAudience}</p>
        </div>

        {/* Pain Point Solved */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-red-600" />
            <span className="font-medium text-sm">Pain Point Solved</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {idea.painPointSolved}
          </p>
        </div>

        {/* Detailed Scoring */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm">Detailed Scoring</h4>

          <div className="space-y-2">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Pain Severity</span>
                <span className={getScoreColor(idea.scoring.painSeverity)}>
                  {idea.scoring.painSeverity}%
                </span>
              </div>
              <Progress value={idea.scoring.painSeverity} className="h-1.5" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Market Size</span>
                <span className={getScoreColor(idea.scoring.marketSize)}>
                  {idea.scoring.marketSize}%
                </span>
              </div>
              <Progress value={idea.scoring.marketSize} className="h-1.5" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Low Competition</span>
                <span className={getScoreColor(idea.scoring.competition)}>
                  {idea.scoring.competition}%
                </span>
              </div>
              <Progress value={idea.scoring.competition} className="h-1.5" />
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Implementation Ease</span>
                <span
                  className={getScoreColor(
                    100 - idea.scoring.implementationDifficulty,
                  )}
                >
                  {100 - idea.scoring.implementationDifficulty}%
                </span>
              </div>
              <Progress
                value={100 - idea.scoring.implementationDifficulty}
                className="h-1.5"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        {idea.tags && idea.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {idea.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Source Information */}
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                Source Communities
              </p>
              <div className="flex flex-wrap gap-1">
                {idea.sourceSubreddits.map((subreddit, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs font-mono"
                  >
                    r/{subreddit}
                  </Badge>
                ))}
              </div>
            </div>

            {idea.sourceUrls && idea.sourceUrls.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => onViewSource?.(idea.sourceUrls![0])}
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                View Source
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default IdeaCard;
