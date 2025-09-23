import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  CheckCircle,
  Sparkles,
  Clock,
  Shield,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

const features = [
  'Unlimited idea generation',
  'AI-powered scoring system',
  'Direct Reddit source links',
  'Market size estimation',
  'Competition analysis',
  'Implementation roadmaps',
];

const benefits = [
  {
    icon: Clock,
    title: 'Save 100+ Hours',
    description: 'Skip months of manual research',
  },
  {
    icon: Shield,
    title: 'Validated Problems',
    description: 'Real people, real pain points',
  },
  {
    icon: Zap,
    title: 'Quick Implementation',
    description: 'From idea to MVP faster',
  },
];

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Main CTA Card */}
        <Card className="max-w-4xl mx-auto border-2 border-primary/20 bg-card/80 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-8 lg:p-12 text-center">
            {/* Badge */}
            <Badge variant="default" className="mb-6 px-4 py-2">
              <Sparkles className="w-4 h-4 mr-2" />
              Limited Time: Free Access
            </Badge>

            {/* Headline */}
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Ready to Discover Your Next{' '}
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Big Opportunity?
              </span>
            </h2>

            {/* Subheadline */}
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of successful founders who have found their
              profitable SaaS ideas through our AI-powered Reddit analysis
              platform.
            </p>

            {/* Benefits grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center p-4"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Features checklist */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8 max-w-2xl mx-auto text-left">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button
                asChild
                size="lg"
                className="px-8 py-6 text-lg font-semibold min-w-[200px]"
              >
                <Link href="/auth/sign-up">
                  Start Discovering Ideas
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg min-w-[200px]"
                asChild
              >
                <Link href="/ideas">View Sample Ideas</Link>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Setup in under 60 seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Urgency indicator */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            🔥 <strong>500+ founders</strong> have already found their next
            opportunity this month
          </p>
        </div>
      </div>
    </section>
  );
}
