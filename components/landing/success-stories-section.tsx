import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ExternalLink,
  TrendingUp,
  Users,
  DollarSign,
  Star,
} from 'lucide-react';
import Link from 'next/link';

const successStories = [
  {
    id: 1,
    productName: 'TaskSync',
    description:
      'A project management tool for remote teams that solves coordination issues found in r/remotework.',
    founder: 'Sarah Chen',
    founderImage: '/api/placeholder/40/40', // Placeholder for now
    metrics: {
      revenue: '$15K MRR',
      users: '2,500+',
      rating: 4.8,
    },
    originalProblem:
      'Remote teams struggling with async communication and task visibility',
    subreddit: 'r/remotework',
    productUrl: 'https://tasksync.app',
    foundedDate: '2024',
    tags: ['Productivity', 'Remote Work', 'SaaS'],
  },
  {
    id: 2,
    productName: 'BudgetBuddy',
    description:
      'Personal finance app addressing budgeting pain points discovered in r/personalfinance.',
    founder: 'Mike Rodriguez',
    founderImage: '/api/placeholder/40/40', // Placeholder for now
    metrics: {
      revenue: '$8K MRR',
      users: '1,200+',
      rating: 4.6,
    },
    originalProblem:
      'Young adults unable to track expenses and stick to budgets',
    subreddit: 'r/personalfinance',
    productUrl: 'https://budgetbuddy.io',
    foundedDate: '2024',
    tags: ['Finance', 'Mobile App', 'Personal'],
  },
  {
    id: 3,
    productName: 'StudyFlow',
    description:
      'Study scheduling platform born from learning struggles discussed in r/studytips.',
    founder: 'Alex Kim',
    founderImage: '/api/placeholder/40/40', // Placeholder for now
    metrics: {
      revenue: '$12K MRR',
      users: '5,000+',
      rating: 4.9,
    },
    originalProblem:
      'Students struggling to maintain consistent study schedules',
    subreddit: 'r/studytips',
    productUrl: 'https://studyflow.co',
    foundedDate: '2023',
    tags: ['Education', 'Productivity', 'Students'],
  },
];

export function SuccessStoriesSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4">
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Real Products Built from Reddit Ideas
          </h2>
          <p className="text-lg text-muted-foreground">
            These founders discovered problems on Reddit and turned them into
            successful products. Your next million-dollar idea could be just one
            discussion away.
          </p>
        </div>

        {/* Success stories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {successStories.map((story) => (
            <Card
              key={story.id}
              className="group hover:shadow-lg transition-all duration-300 border-border/50"
            >
              <CardContent className="p-6">
                {/* Product header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {story.productName}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Founded by {story.founder} • {story.foundedDate}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Link
                      href={story.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {story.description}
                </p>

                {/* Original problem */}
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Original Problem from {story.subreddit}:
                  </p>
                  <p className="text-sm italic">
                    &quot;{story.originalProblem}&quot;
                  </p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-medium">
                        {story.metrics.revenue}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-3 h-3 text-blue-500" />
                      <span className="text-xs font-medium">
                        {story.metrics.users}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Users</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span className="text-xs font-medium">
                        {story.metrics.rating}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {story.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="text-xs px-2 py-0.5"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 border border-primary/20">
          <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">
            Your Success Story Could Be Next
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join hundreds of founders who have discovered their winning product
            ideas by analyzing real problems from Reddit communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" asChild>
              <Link href="/ideas">Start Generating Ideas</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="#how-it-works">Learn How It Works</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
