import './globals.css';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/components/providers/query-provider';

const inter = Inter({ subsets: ['latin'] });

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title:
    'Reddit Product Idea Generator | Discover Profitable SaaS Ideas from Reddit',
  description:
    'Generate scored product ideas by analyzing Reddit discussions for problems and pain points. Perfect for beginner founders looking for their next SaaS opportunity.',
  keywords:
    'product ideas, SaaS ideas, Reddit analysis, startup ideas, business opportunities, problem validation',
  authors: [{ name: 'Reddit Product Idea Generator' }],
  creator: 'Reddit Product Idea Generator',
  publisher: 'Reddit Product Idea Generator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Reddit Product Idea Generator | Discover Profitable SaaS Ideas',
    description:
      'Generate scored product ideas by analyzing Reddit discussions for problems and pain points. Perfect for beginner founders.',
    url: defaultUrl,
    siteName: 'Reddit Product Idea Generator',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Reddit Product Idea Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reddit Product Idea Generator | Discover Profitable SaaS Ideas',
    description:
      'Generate scored product ideas by analyzing Reddit discussions for problems and pain points.',
    images: ['/twitter-image.png'],
    creator: '@redditideagen',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
