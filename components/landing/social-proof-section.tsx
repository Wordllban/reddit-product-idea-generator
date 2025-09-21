import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Founder, DevTools Startup',
    avatar: '/avatars/sarah.jpg',
    initials: 'SC',
    content:
      'Found my current SaaS idea through this platform. The Reddit analysis was spot-on and helped me identify a real pain point developers were facing. Now at $15k MRR!',
    rating: 5,
    badge: 'Success Story',
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Solo Entrepreneur',
    avatar: '/avatars/marcus.jpg',
    initials: 'MR',
    content:
      "As a first-time founder, I was overwhelmed by all the 'opportunities' out there. This tool helped me focus on problems people actually want solved. Game changer!",
    rating: 5,
    badge: 'First-Time Founder',
  },
  {
    name: 'Jennifer Kim',
    role: 'Product Manager → Founder',
    avatar: '/avatars/jennifer.jpg',
    initials: 'JK',
    content:
      'The AI scoring system is incredibly accurate. It saved me months of market research and helped me avoid building something nobody wanted.',
    rating: 5,
    badge: 'PM Background',
  },
  {
    name: 'Alex Thompson',
    role: 'Technical Co-founder',
    avatar: '/avatars/alex.jpg',
    initials: 'AT',
    content:
      'Love how it provides direct links to Reddit discussions. Being able to validate problems with real user comments before building is invaluable.',
    rating: 5,
    badge: 'Technical Founder',
  },
  {
    name: 'Priya Patel',
    role: 'Bootstrap Entrepreneur',
    avatar: '/avatars/priya.jpg',
    initials: 'PP',
    content:
      'Perfect for bootstrappers like me. No need for expensive market research - just real problems from real people. Found 3 viable ideas in my first week!',
    rating: 5,
    badge: 'Bootstrapper',
  },
  {
    name: 'David Wilson',
    role: 'Serial Entrepreneur',
    avatar: '/avatars/david.jpg',
    initials: 'DW',
    content:
      "I've built 4 companies and this is the most efficient way I've found to identify market gaps. The quality of ideas is consistently high.",
    rating: 5,
    badge: 'Serial Entrepreneur',
  },
];

const stats = [
  {
    value: '500+',
    label: 'Ideas Generated',
    sublabel: 'High-quality opportunities',
  },
  {
    value: '50k+',
    label: 'Reddit Posts Analyzed',
    sublabel: 'Real problems identified',
  },
  {
    value: '95%',
    label: 'Success Rate',
    sublabel: 'Ideas that find market fit',
  },
  {
    value: '24h',
    label: 'Average Discovery Time',
    sublabel: 'From problem to opportunity',
  },
];

export function SocialProofSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            Success Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by Successful Founders Worldwide
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of entrepreneurs who have discovered their next big
            opportunity through our AI-powered Reddit analysis platform.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center border-border/50">
              <CardContent className="p-6">
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">
                  {stat.sublabel}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="relative border-border/50 hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-6">
                {/* Quote icon */}
                <Quote className="w-8 h-8 text-primary/20 mb-4" />

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-primary text-primary"
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  &ldquo;{testimonial.content}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {testimonial.badge}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="text-center">
          <p className="text-muted-foreground mb-6">
            Join the community of successful founders who trust our platform
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-sm font-medium">Featured on Product Hunt</div>
            <div className="w-px h-4 bg-border" />
            <div className="text-sm font-medium">Indie Hackers Community</div>
            <div className="w-px h-4 bg-border" />
            <div className="text-sm font-medium">Startup School Alumni</div>
          </div>
        </div>
      </div>
    </section>
  );
}
