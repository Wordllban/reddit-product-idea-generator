# Reddit Product Idea Generator - Project Scope & Todo List

## 🎯 Project Overview

Build a minimal viable SaaS that helps beginner founders generate product ideas by analyzing Reddit discussions for problems and pain points, then using LLM to generate scored product ideas.

**Time Constraint**: 8 hours maximum
**Priority**: Focus on core MVP functionality first

---

## 📋 Phase 1: Foundation & Setup (Priority: HIGH)

### 1.1 Project Initialization

- [x] Initialize Next.js project with TypeScript
- [x] Install essential dependencies (Supabase, UI libraries, etc.)
- [x] Setup Git repository and initial commit
- [x] Configure environment variables structure

### 1.2 Cursor AI Documentation Setup

- [x] Create `.cursor/` folder
- [x] Write `rules.md` (architecture, style, commit conventions)
- [x] Initialize `PROMPTS.md` for tracking AI interactions
- [ ] Document AI workflow approach

### 1.3 Database & Authentication Foundation

- [x] Setup Supabase project
- [ ] Configure authentication providers
- [ ] Design database schema:
  - `users` table (auth integration)
  - `ideas` table (generated product ideas)
  - `subreddits` table (tracked subreddits with categories)
  - `subscriptions` table (email preferences)
  - `reddit_posts` table (post metadata, content, engagement)
  - `reddit_comments` table (comment data, parent relationships)
  - `subreddit_tracking` table (monitoring stats, last_fetched)

---

## 📋 Phase 2: Core MVP Features (Priority: HIGH)

### 2.1 Landing Page

- [x] Create hero section with value proposition
- [x] Add feature highlights
- [x] Implement "Get Started" CTA
- [x] Basic responsive design

### 2.2 Authentication System

- [x] Implement Supabase Auth integration
- [x] Create login/register forms
- [x] Add logout functionality
- [x] Protected route middleware

### 2.3 Reddit Data Integration

#### 2.3.1 Reddit API Client Setup

- [x] Create Reddit API credentials (app registration)
- [x] Setup environment variables for Reddit API
  - `REDDIT_CLIENT_ID`
  - `REDDIT_CLIENT_SECRET`
  - `REDDIT_USER_AGENT`
- [x] Create `lib/reddit/client.ts` with Reddit API client
- [x] Implement OAuth2 authentication flow for Reddit API
- [x] Add rate limiting and error handling to Reddit client

#### 2.3.2 Subreddit Research & Targeting

- [x] Research and identify target subreddits for product idea discovery:
  - r/entrepreneur (startup problems)
  - r/smallbusiness (business pain points)
  - r/SaaS (software needs)
  - r/webdev (developer tools)
  - r/productivity (workflow issues)
  - r/freelance (freelancer challenges)
  - r/startups (market gaps)
- [x] Create subreddit configuration with categories
- [x] Implement subreddit validation and health checks

#### 2.3.3 Data Extraction Logic

- [x] Create post fetching functions:
  - Fetch hot posts from target subreddits
  - Fetch top posts (weekly/monthly)
  - Fetch rising posts for trending topics
- [x] Implement comment extraction:
  - Get top-level comments
  - Filter comments by engagement (upvotes)
  - Extract problem statements from comments
- [x] Create data models/interfaces:
  - `RedditPost` interface
  - `RedditComment` interface
  - `SubredditConfig` interface

#### 2.3.4 Data Storage & Caching

- [ ] Create database schema for Reddit data:
  - `reddit_posts` table with post metadata
  - `reddit_comments` table for comment data
  - `subreddit_tracking` table for monitoring
- [ ] Implement data persistence functions
- [ ] Add caching layer for API responses (Redis or in-memory) (optional/post MVP)
- [ ] Create data refresh and cleanup routines (optional/post MVP)

### 2.4 LLM Integration

- [ ] Setup OpenAI API integration
- [ ] Design prompts for idea generation
- [ ] Create structured response parsing
- [ ] Implement idea scoring algorithm
- [ ] Add error handling and rate limiting

#### 2.4.1 Data Processing & Filtering

- [ ] Implement content filtering logic:
  - Filter out promotional/spam content
  - Identify problem-focused discussions
  - Extract pain points and frustrations
  - Remove low-quality or off-topic content
- [ ] Create text processing utilities:
  - Clean markdown formatting
  - Extract key phrases and keywords
  - Sentiment analysis for problem identification
- [ ] Implement data validation and sanitization

---

## 📋 Phase 3: User Experience (Priority: HIGH)

### 3.1 Ideas Feed Interface

- [ ] Create idea card components
- [ ] Display idea details:
  - Name and elevator pitch
  - Target audience
  - Pain point solved
  - Source subreddit/link
  - Scoring (0-100)
  - "New" badge for recent ideas
- [ ] Implement infinite scroll or pagination
- [ ] Add loading states

### 3.2 Filtering & Search

- [ ] Category filters (devtools, health, education, etc.)
- [ ] Score-based filtering
- [ ] Search functionality
- [ ] Sort options (newest, highest scored, etc.)

---

## 📋 Phase 4: Email System (Priority: LOW)

### 4.1 Email Service Integration

- [ ] Choose and setup email provider (Resend/SendGrid)
- [ ] Create email templates
- [ ] Implement subscription management

### 4.2 Subscription Features

- [ ] Email subscription form
- [ ] Topic preference selection
- [ ] Unsubscribe functionality
- [ ] Email scheduling system

---

## 📋 Phase 5: Background Processing (Priority: LOW)

### 5.1 Data Collection Automation

- [ ] Create scheduled job for Reddit data collection
- [ ] Implement idea generation pipeline
- [ ] Add data persistence and caching
- [ ] Error handling and monitoring

### 5.2 Performance Optimization

- [ ] Database indexing
- [ ] API response caching
- [ ] Image optimization
- [ ] Bundle optimization

---

## 📋 Phase 6: Documentation & Deployment (Priority: HIGH)

### 6.1 Documentation

- [ ] Write comprehensive README.md
- [ ] Include local setup instructions
- [ ] Add API documentation
- [ ] Environment variables guide

### 6.2 Testing & Quality Assurance

- [ ] Test core user flows
- [ ] Validate LLM integration
- [ ] Check email functionality
- [ ] Mobile responsiveness testing

### 6.3 Cursor AI Documentation Completion

- [ ] Complete PROMPTS.md with 5-10 key prompts
- [ ] Export interaction history
- [ ] Document AI-assisted development process
- [ ] Include screenshots of key interactions

---

## 🎯 MVP Success Criteria

### Must-Have (8-hour constraint)

1. ✅ Working landing page with clear value proposition
2. ✅ User authentication (register/login/logout)
3. ✅ Basic Reddit data integration
4. ✅ LLM-generated product ideas with scoring
5. ✅ Simple ideas feed interface
6. ✅ Complete documentation and setup instructions

### Nice-to-Have (if time permits)

1. Email subscription system
2. Advanced filtering options
3. Background job processing
4. Mobile-optimized design
5. Advanced scoring algorithms

---

## 🛠️ Technical Architecture

### Frontend Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui or similar
- **State Management**: React hooks + Context API

### Backend Stack

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API routes
- **External APIs**:
  - Reddit API (OAuth2, rate-limited client)
  - OpenAI API (GPT-4/3.5-turbo)
- **Reddit Integration**:
  - Custom client with rate limiting
  - Data processing pipeline
  - Caching layer for API responses

### Third-Party Services

- **LLM**: OpenAI GPT-4 or GPT-3.5-turbo
- **Email**: Resend (recommended for simplicity)
- **Hosting**: Vercel (seamless Next.js deployment)

---

## 📊 Time Allocation Strategy

- **Phase 1 (Setup)**: 1.5 hours
- **Phase 2 (Core MVP)**: 4.5 hours
  - Reddit API Integration: 2 hours
  - LLM Integration: 1.5 hours
  - Ideas Feed Interface: 1 hour
- **Phase 3 (UX)**: 1 hour
- **Phase 6 (Documentation)**: 1 hour

**Total**: 8 hours

---

## 🚨 Risk Mitigation

### High-Risk Items

1. **Reddit API rate limits** - Implement proper caching and request throttling (60 requests/minute)
2. **Reddit API authentication** - OAuth2 flow complexity and token management
3. **Data quality from Reddit** - Filtering spam, irrelevant content, and low-quality posts
4. **LLM API costs** - Set usage limits and implement fallbacks
5. **Complex background processing** - Start with simple manual triggers

### Fallback Plans

1. If Reddit API is problematic, use mock data for demonstration
2. If LLM integration is complex, create simpler rule-based scoring
3. If email system is time-consuming, focus on core idea generation

---

## 📝 Notes

- Prioritize working functionality over perfect UI
- Document AI interactions throughout development
- Commit frequently with clear messages
- Keep scope flexible based on implementation speed
- Focus on demonstrable value for beginner founders
