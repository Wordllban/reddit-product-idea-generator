import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 pt-16 pb-20">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4 text-center">
        {/* Badge */}
        <Badge variant="secondary" className="mb-6 px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          AI-Powered Idea Discovery
        </Badge>

        {/* Main headline */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Discover Your Next{' '}
          <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Million-Dollar
          </span>{' '}
          SaaS Idea
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Generate scored product ideas by analyzing Reddit discussions for real
          problems and pain points. Perfect for beginner founders looking for
          their next profitable opportunity.
        </p>

        {/* Key benefits */}
        <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span>AI-Scored Ideas (0-100)</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Real Reddit Problems</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4 text-primary" />
            <span>Validated Pain Points</span>
          </div>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold">
            <Link href="/auth/sign-up">
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-8 py-6 text-lg"
            asChild
          >
            <Link href="/ideas">View Sample Ideas</Link>
          </Button>
        </div>

        {/* Social proof */}
        <div className="text-sm text-muted-foreground">
          <p className="mb-2">Trusted by ambitious founders worldwide</p>
          <div className="flex justify-center items-center gap-8 opacity-60">
            <div className="text-2xl font-bold">500+</div>
            <div className="w-px h-6 bg-border" />
            <div className="text-2xl font-bold">50k+</div>
            <div className="w-px h-6 bg-border" />
            <div className="text-2xl font-bold">95%</div>
          </div>
          <div className="flex justify-center items-center gap-8 text-xs mt-1">
            <span>Ideas Generated</span>
            <span>Reddit Posts Analyzed</span>
            <span>Success Rate</span>
          </div>
        </div>
      </div>
    </section>
  );
}
