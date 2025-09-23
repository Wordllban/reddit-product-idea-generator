import { Navigation } from '@/components/landing/navigation';
import { HeroSection } from '@/components/landing/hero-section';
import { SuccessStoriesSection } from '@/components/landing/success-stories-section';
import { FeaturesSection } from '@/components/landing/features-section';
import { HowItWorksSection } from '@/components/landing/how-it-works-section';
import { SocialProofSection } from '@/components/landing/social-proof-section';
import { CTASection } from '@/components/landing/cta-section';
import { Footer } from '@/components/landing/footer';

// Structured data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Reddit Product Idea Generator',
  description:
    'Generate scored product ideas by analyzing Reddit discussions for problems and pain points. Perfect for beginner founders looking for their next SaaS opportunity.',
  url: 'https://redditideagenerator.com',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '127',
  },
  author: {
    '@type': 'Organization',
    name: 'Reddit Idea Generator Team',
  },
};

export default function Home() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Navigation */}
      <Navigation />

      {/* Main Content */}
      <main className="min-h-screen">
        {/* Hero Section */}
        <HeroSection />

        {/* Success Stories Section */}
        <SuccessStoriesSection />

        {/* Features Section */}
        <section id="features">
          <FeaturesSection />
        </section>

        {/* How It Works Section */}
        <section id="how-it-works">
          <HowItWorksSection />
        </section>

        {/* Social Proof Section */}
        <section id="testimonials">
          <SocialProofSection />
        </section>

        {/* Final CTA Section */}
        <CTASection />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
