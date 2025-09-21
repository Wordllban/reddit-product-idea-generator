/**
 * Environment Configuration
 *
 * Required environment variables for the Reddit Product Idea Generator
 */

export const config = {
  // Supabase Configuration
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },

  // Reddit API Configuration
  reddit: {
    clientId: process.env.REDDIT_CLIENT_ID!,
    clientSecret: process.env.REDDIT_CLIENT_SECRET!,
    userAgent: process.env.REDDIT_USER_AGENT || 'product-idea-generator:v1.0.0',
    // Reddit API base URL
    baseUrl: 'https://oauth.reddit.com',
    authUrl: 'https://www.reddit.com/api/v1/access_token',
  },

  // OpenAI Configuration (for future LLM integration)
  openai: {
    apiKey: process.env.OPENAI_API_KEY!,
  },
} as const;

/**
 * Validates that all required environment variables are present
 */
export function validateConfig() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'REDDIT_CLIENT_ID',
    'REDDIT_CLIENT_SECRET',
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`,
    );
  }
}
