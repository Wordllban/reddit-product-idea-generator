import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Brain, Twitter, Github, Mail, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

const footerSections = [
  {
    title: 'Product',
    links: [
      { href: '#features', label: 'Features' },
      { href: '#how-it-works', label: 'How It Works' },
      { href: '/ideas', label: 'Sample Ideas' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
      { href: '/careers', label: 'Careers' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/docs', label: 'Documentation' },
      { href: '/api', label: 'API Reference' },
      { href: '/guides', label: 'Founder Guides' },
      { href: '/changelog', label: 'Changelog' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms of Service' },
      { href: '/cookies', label: 'Cookie Policy' },
      { href: '/security', label: 'Security' },
    ],
  },
];

const socialLinks = [
  {
    href: 'https://twitter.com/redditideagen',
    icon: Twitter,
    label: 'Follow us on Twitter',
  },
  {
    href: 'https://github.com/Wordllban/reddit-product-idea-generator',
    icon: Github,
    label: 'Star us on GitHub',
  },
  {
    href: 'mailto:hello@redditideagenerator.com',
    icon: Mail,
    label: 'Send us an email',
  },
];

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t border-border/40">
      <div className="container mx-auto px-4">
        {/* Newsletter signup */}
        <div className="py-12 border-b border-border/40">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Stay Updated with New Ideas
            </h3>
            <p className="text-muted-foreground mb-6">
              Get weekly insights about trending problems and opportunities
              discovered from Reddit discussions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-md border border-border bg-background text-sm"
              />
              <Button>
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Main footer content */}
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Brand section */}
            <div className="lg:col-span-1">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-xl mb-4"
              >
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Brain className="w-6 h-6 text-primary" />
                </div>
                <span className="hidden sm:block">Reddit Idea Generator</span>
              </Link>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                Discover your next million-dollar SaaS idea by analyzing real
                problems and pain points from Reddit discussions using AI.
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.label + social.href}
                      variant="ghost"
                      size="sm"
                      asChild
                      className="w-9 h-9 p-0"
                    >
                      <Link
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        <Icon className="w-4 h-4" />
                      </Link>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Footer links */}
            <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerSections.map((section) => (
                <div key={section.title}>
                  <h4 className="font-semibold mb-4">{section.title}</h4>
                  <ul className="space-y-3">
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Bottom section */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2025 Reddit Idea Generator. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500" /> for founders
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
