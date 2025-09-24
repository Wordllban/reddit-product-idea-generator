# Reddit Product Idea Generator

<p align="center">
  Reddit Product Idea Generator - AI-powered product idea discovery from Reddit discussions
</p>

<p align="center">
  <strong>AI-powered SaaS that generates scored product ideas by analyzing Reddit discussions for problems and pain points</strong>
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#architecture"><strong>Architecture</strong></a> ·
  <a href="#setup"><strong>Setup</strong></a> ·
  <a href="#configuration"><strong>Configuration</strong></a> ·
  <a href="#deployment"><strong>Deployment</strong></a>
</p>

---

## 🎯 Project Overview

The Reddit Product Idea Generator is a minimal viable SaaS designed to help beginner founders discover product opportunities by:

1. **Analyzing Reddit discussions** across targeted subreddits (r/entrepreneur, r/smallbusiness, r/SaaS, etc.)
2. **Extracting problems and pain points** from posts and comments using AI
3. **Generating scored product ideas** with OpenAI's GPT-5-nano
4. **Presenting opportunities** in an easy-to-browse interface

Perfect for entrepreneurs looking for their next SaaS opportunity or validating market needs through real user discussions.

## ✨ Features

### Core Functionality

- **🔍 Reddit Data Mining**: Automated extraction from 7+ targeted subreddits
- **🤖 AI-Powered Analysis**: GPT-5-nano processes discussions to identify pain points
- **📊 Scored Ideas**: Each idea gets a 0-100 score based on market potential
- **🎯 Categorized Results**: Ideas organized by industry (DevTools, Health, Education, etc.)
- **🔄 Real-time Updates**: Fresh ideas generated from latest Reddit discussions

### User Experience

- **🚀 Modern UI**: Built with Next.js 15, Tailwind CSS, and Shadcn/ui
- **🔐 Secure Authentication**: Supabase Auth with protected routes
- **📱 Responsive Design**: Mobile-first approach with excellent UX
- **⚡ Fast Performance**: Optimized with React 19 and Turbopack
- **🌙 Dark/Light Mode**: Theme switching with next-themes

### Technical Features

- **📈 Rate Limiting**: Proper Reddit API throttling (60 requests/minute)
- **🗄️ Data Persistence**: PostgreSQL database via Supabase
- **🔄 Background Processing**: Automated idea generation pipeline
- **📊 Analytics Ready**: Structured for usage tracking and optimization

## 🏗️ Architecture

### Technology Stack

#### Frontend

- **Framework**: Next.js 15 with TypeScript and App Router
- **Styling**: Tailwind CSS 4.0 with CSS-in-JS
- **UI Components**: Shadcn/ui + Radix UI primitives
- **State Management**: React 19 hooks + TanStack Query
- **Theme**: next-themes for dark/light mode

#### Backend & Database

- **Database**: Supabase (PostgreSQL) with Row Level Security
- **Authentication**: Supabase Auth with cookie-based sessions
- **API Routes**: Next.js API routes with TypeScript
- **File Structure**: Modular architecture with clear separation

#### External Integrations

- **Reddit API**: OAuth2 authentication with rate limiting
- **OpenAI API**: GPT-5-nano for idea generation and scoring
- **Email Service**: Ready for Resend/SendGrid integration

#### Development Tools

- **Package Manager**: PNPM with workspace support
- **Linting**: ESLint 9 with Next.js config
- **Type Checking**: TypeScript 5 with strict mode
- **Build Tool**: Turbopack for faster development

### Project Structure

```
reddit-product-idea-generator/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── ideas/generate/       # Idea generation endpoint
│   │   ├── reddit/               # Reddit API endpoints
│   │   └── admin/                # Admin utilities
│   ├── auth/                     # Authentication pages
│   ├── ideas/                    # Main app interface
│   └── layout.tsx                # Root layout
├── components/                   # React components
│   ├── ui/                       # Shadcn/ui components
│   ├── landing/                  # Landing page sections
│   └── providers/                # Context providers
├── lib/                          # Core business logic
│   ├── api/                      # API client functions
│   ├── llm/                      # OpenAI integration
│   ├── processing/               # Data processing pipeline
│   ├── prompts/                  # LLM prompt templates
│   ├── reddit/                   # Reddit API client
│   └── supabase/                 # Database clients
├── hooks/                        # Custom React hooks
└── mocks/                        # Mock data for development
```

## 🚀 Setup

### Prerequisites

- **Node.js**: 18.17 or later
- **PNPM**: 8.0 or later (recommended) or npm/yarn
- **Supabase Account**: For database and authentication
- **Reddit App**: For API access
- **OpenAI Account**: For AI-powered idea generation

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/reddit-product-idea-generator.git
   cd reddit-product-idea-generator
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables** (see [Configuration](#configuration) section)

4. **Run the development server**

   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuration

### Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Reddit API Configuration
REDDIT_CLIENT_ID=your_reddit_app_client_id
REDDIT_CLIENT_SECRET=your_reddit_app_client_secret
REDDIT_USER_AGENT=your_app_name:v1.0.0

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Development Configuration (Optional)
NEXT_PUBLIC_USE_MOCK_DATA=false
NEXT_PUBLIC_MOCK_API_DELAY=500
```

### How to Get API Keys

#### 1. Supabase Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Navigate to **Settings** → **API**
3. Copy your **Project URL** and **anon/public key**
4. Set up authentication providers in **Authentication** → **Providers**

#### 2. Reddit API Setup

1. Go to [reddit.com/prefs/apps](https://www.reddit.com/prefs/apps)
2. Click **"Create App"** or **"Create Another App"**
3. Fill out the form:
   - **Name**: Your app name (e.g., "Product Idea Generator")
   - **App type**: Select **"web app"**
   - **Description**: Brief description of your app
   - **About URL**: Your website or GitHub repo
   - **Redirect URI**: `http://localhost:3000` (for development)
4. Copy the **Client ID** (under the app name) and **Client Secret**
5. Set `REDDIT_USER_AGENT` to follow format: `appname:version (by /u/yourusername)`

#### 3. OpenAI API Setup

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create an account and navigate to **API Keys**
3. Click **"Create new secret key"**
4. Copy the key (it won't be shown again)
5. Add billing information to use the API

### Database Schema

The app uses the following PostgreSQL tables via Supabase:

#### Core Tables

- **`product_ideas`**: Generated product ideas with comprehensive scoring

  - Primary fields: `name`, `elevator_pitch`, `target_audience`, `pain_point_solved`
  - Scoring: `overall_score`, `pain_severity_score`, `market_size_score`, `competition_score`
  - Metadata: `category`, `tags[]`, `source_subreddits[]`, `source_urls[]`
  - Processing: `generated_by`, `processing_metadata` (JSONB)

- **`subreddit_tracking`**: Monitored subreddits with analytics
  - Configuration: `name`, `category`, `description`, `is_enabled`
  - Analytics: `posts_fetched_total`, `ideas_generated_total`, `avg_post_score`
  - Scheduling: `last_fetched_at`, `fetch_frequency_hours`

#### Data Processing Tables

- **`reddit_posts_temp`**: Temporary Reddit post cache (7-day TTL)

  - Reddit data: `reddit_id`, `subreddit`, `title`, `content`, `author`
  - Engagement: `score`, `num_comments`, `upvote_ratio`, `created_utc`
  - Processing: `processed`, `content_hash`, `expires_at`

- **`reddit_comments_temp`**: Temporary comment cache (7-day TTL)

  - Comment data: `reddit_id`, `post_reddit_id`, `body`, `author`, `score`
  - Hierarchy: `parent_id`, `depth`
  - Processing: `processed`, `expires_at`

- **`content_fingerprints`**: Duplicate detection system
  - Deduplication: `content_hash`, `content_type`, `occurrence_count`
  - Tracking: `last_seen_at`, `created_at`

#### Analytics & Management

- **`processing_batches`**: Batch processing monitoring

  - Metrics: `posts_fetched`, `posts_processed`, `ideas_generated`
  - Status tracking: `status`, `started_at`, `completed_at`, `error_message`
  - Metadata: `batch_type`, `metadata` (JSONB)

- **`email_subscriptions`**: Email notification preferences
  - User data: `user_id` (FK to auth.users), `email`
  - Preferences: `categories[]`, `frequency`, `is_active`
  - Tracking: `last_sent_at`

#### Key Features

- **Row Level Security (RLS)**: Enabled on all tables for data protection
- **Automatic Timestamps**: `created_at` and `updated_at` on core tables
- **Data Retention**: Temporary tables auto-expire after 7 days
- **JSONB Support**: Flexible metadata storage for processing data
- **Array Fields**: Efficient storage for tags, categories, and source URLs

Schema migrations are handled automatically by Supabase with version control.

## 🧪 Development

### Available Scripts

```bash
# Development server with Turbopack
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Mock Data Mode

For development without API limits, set `NEXT_PUBLIC_USE_MOCK_DATA=true` in your `.env.local`. This uses pre-generated sample data instead of making real API calls.

### Testing Reddit Integration

Use the built-in API endpoints for testing:

- `/api/reddit/health-check` - Test Reddit API connectivity
- `/api/reddit/test-auth` - Verify Reddit authentication
- `/api/reddit/test-posts` - Fetch sample posts

## 📚 API Documentation

### Core Endpoints

- **`POST /api/ideas/generate`**: Generate new product ideas
- **`GET /api/reddit/validate-subreddit`**: Validate subreddit exists
- **`POST /api/admin/cleanup`**: Clean up old data (admin only)

### Response Formats

All API endpoints return JSON with consistent structure:

```typescript
// Success Response
{
  "success": true,
  "data": { /* response data */ }
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes: `git commit -m "feat: add your feature"`
4. Push to branch: `git push origin feat/your-feature`
5. Open a Pull Request

### Commit Conventions

We use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code formatting
- `refactor:` - Code restructuring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
