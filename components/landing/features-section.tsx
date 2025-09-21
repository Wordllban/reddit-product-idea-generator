import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Target,
  Zap,
  TrendingUp,
  Users,
  MessageSquare,
  Search,
  BarChart3,
  Filter,
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description:
      'Advanced LLM technology analyzes Reddit discussions to identify genuine problems and pain points that people are actively discussing.',
    badge: 'Core Feature',
  },
  {
    icon: Target,
    title: 'Scored Opportunities',
    description:
      'Every idea comes with a 0-100 score based on market demand, competition level, and implementation feasibility.',
    badge: 'Smart Scoring',
  },
  {
    icon: TrendingUp,
    title: 'Real-Time Insights',
    description:
      "Fresh data from active Reddit communities ensures you're always discovering the latest problems that need solving.",
    badge: 'Live Data',
  },
  {
    icon: Users,
    title: 'Target Audience Intel',
    description:
      "Get detailed information about who's experiencing these problems and what solutions they're currently seeking.",
    badge: 'Audience Research',
  },
  {
    icon: MessageSquare,
    title: 'Source Validation',
    description:
      'Direct links to original Reddit discussions so you can validate the problem and understand the context fully.',
    badge: 'Transparency',
  },
  {
    icon: Search,
    title: 'Smart Filtering',
    description:
      'Filter by categories, score ranges, and problem types to find ideas that match your skills and interests.',
    badge: 'Customization',
  },
  {
    icon: BarChart3,
    title: 'Market Metrics',
    description:
      'Understand market size, competition level, and potential revenue opportunities for each validated idea.',
    badge: 'Analytics',
  },
  {
    icon: Zap,
    title: 'Quick Implementation',
    description:
      'Get actionable insights and implementation suggestions to help you move from idea to MVP faster.',
    badge: 'Actionable',
  },
  {
    icon: Filter,
    title: 'Quality Curation',
    description:
      'Our AI filters out low-quality suggestions and focuses only on problems with real commercial potential.',
    badge: 'Quality First',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Why Choose Us
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything You Need to Find Your Next Big Idea
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform combines the power of AI with real Reddit discussions
            to surface genuine problems that people are willing to pay to solve.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="relative group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-semibold">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Ready to discover problems worth solving?
          </p>
          <div className="flex justify-center">
            <Badge variant="outline" className="px-4 py-2">
              <Zap className="w-4 h-4 mr-2" />
              Start discovering ideas in under 60 seconds
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
}
