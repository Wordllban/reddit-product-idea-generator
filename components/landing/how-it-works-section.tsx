import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Search,
  Brain,
  Target,
  Rocket,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: Search,
    title: 'Reddit Analysis',
    description:
      'Our AI scans popular subreddits to identify real problems and pain points that people are actively discussing.',
    details: [
      'Monitors 500+ relevant subreddits',
      'Identifies complaint patterns',
      'Extracts problem statements',
    ],
    progress: 25,
  },
  {
    step: 2,
    icon: Brain,
    title: 'AI Processing',
    description:
      'Advanced language models analyze the context, sentiment, and commercial viability of each discovered problem.',
    details: [
      'Natural language understanding',
      'Market demand assessment',
      'Competition analysis',
    ],
    progress: 50,
  },
  {
    step: 3,
    icon: Target,
    title: 'Idea Generation',
    description:
      'Transform validated problems into actionable product ideas with detailed implementation guidance and scoring.',
    details: [
      'Solution brainstorming',
      'Feasibility scoring (0-100)',
      'Target audience profiling',
    ],
    progress: 75,
  },
  {
    step: 4,
    icon: Rocket,
    title: 'Launch Ready',
    description:
      'Get comprehensive insights including market size, competition level, and step-by-step implementation roadmap.',
    details: [
      'Go-to-market strategy',
      'MVP recommendations',
      'Revenue potential estimates',
    ],
    progress: 100,
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            From Reddit Problems to Product Ideas in 4 Simple Steps
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our automated process transforms real-world problems into scored,
            actionable product opportunities that you can build and monetize.
          </p>
        </div>

        {/* Process visualization */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-20 left-0 right-0 h-0.5 bg-muted hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-primary/30 rounded-full" />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Step card */}
                    <Card className="border-2 border-border/50 hover:border-primary/30 transition-all duration-300 bg-card/50 backdrop-blur-sm">
                      <CardContent className="p-6 text-center">
                        {/* Step number and icon */}
                        <div className="relative mb-4">
                          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2 relative z-10">
                            <Icon className="w-8 h-8 text-primary" />
                          </div>
                          <Badge
                            variant="default"
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0 flex items-center justify-center text-xs font-bold"
                          >
                            {step.step}
                          </Badge>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-4">
                          <Progress value={step.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {step.progress}% Complete
                          </p>
                        </div>

                        {/* Content */}
                        <h3 className="text-lg font-semibold mb-2">
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {step.description}
                        </p>

                        {/* Details */}
                        <div className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <div
                              key={detailIndex}
                              className="flex items-center justify-start text-xs text-muted-foreground"
                            >
                              <CheckCircle className="w-3 h-3 text-primary mr-2 flex-shrink-0" />
                              <span>{detail}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Arrow between steps (desktop) */}
                    {index < steps.length - 1 && (
                      <div className="hidden lg:block absolute top-20 -right-4 z-20">
                        <div className="w-8 h-8 bg-background rounded-full border-2 border-primary flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto text-center">
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">24/7</div>
            <div className="text-sm text-muted-foreground">
              Continuous Analysis
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">500+</div>
            <div className="text-sm text-muted-foreground">
              Subreddits Monitored
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-3xl font-bold text-primary">95%</div>
            <div className="text-sm text-muted-foreground">Accuracy Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
