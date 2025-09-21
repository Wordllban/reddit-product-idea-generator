# Reddit Product Idea Generator - Project Scope & Todo List

## 🎯 Project Overview

Build a minimal viable SaaS that helps beginner founders generate product ideas by analyzing Reddit discussions for problems and pain points, then using LLM to generate scored product ideas.

**Time Constraint**: 8 hours maximum
**Priority**: Focus on core MVP functionality first

---

## 📋 Phase 1: Foundation & Setup (Priority: HIGH)

### 1.1 Project Initialization

- [ ] Initialize Next.js project with TypeScript
- [ ] Install essential dependencies (Supabase, UI libraries, etc.)
- [ ] Setup Git repository and initial commit
- [ ] Configure environment variables structure

### 1.2 Cursor AI Documentation Setup

- [ ] Create `.cursor/` folder
- [ ] Write `rules.md` (architecture, style, commit conventions)
- [ ] Initialize `PROMPTS.md` for tracking AI interactions
- [ ] Document AI workflow approach

### 1.3 Database & Authentication Foundation

- [ ] Setup Supabase project
- [ ] Configure authentication providers
- [ ] Design database schema:
  - `users` table (auth integration)
  - `ideas` table (generated product ideas)
  - `subreddits` table (tracked subreddits)
  - `subscriptions` table (email preferences)
  - `reddit_posts` table (source data)

---

## 📋 Phase 2: Core MVP Features (Priority: HIGH)

### 2.1 Landing Page

- [ ] Create hero section with value proposition
- [ ] Add feature highlights
- [ ] Implement "Get Started" CTA
- [ ] Basic responsive design

### 2.2 Authentication System

- [ ] Implement Supabase Auth integration
- [ ] Create login/register forms
- [ ] Add logout functionality
- [ ] Protected route middleware

### 2.3 Reddit Data Integration

- [ ] Setup Reddit API client
- [ ] Identify target subreddits for problem discovery
- [ ] Create data extraction logic for posts/comments
- [ ] Implement data cleaning and filtering

### 2.4 LLM Integration

- [ ] Setup OpenAI API integration
- [ ] Design prompts for idea generation
- [ ] Create structured response parsing
- [ ] Implement idea scoring algorithm
- [ ] Add error handling and rate limiting

---

## 📋 Phase 3: User Experience (Priority: MEDIUM)

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

## 📋 Phase 4: Email System (Priority: MEDIUM)

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

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui or similar
- **State Management**: React hooks + Context API

### Backend Stack

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **API**: Next.js API routes
- **External APIs**: Reddit API, OpenAI API

### Third-Party Services

- **LLM**: OpenAI GPT-4 or GPT-3.5-turbo
- **Email**: Resend (recommended for simplicity)
- **Hosting**: Vercel (seamless Next.js deployment)

---

## 📊 Time Allocation Strategy

- **Phase 1 (Setup)**: 1.5 hours
- **Phase 2 (Core MVP)**: 4 hours
- **Phase 3 (UX)**: 1.5 hours
- **Phase 6 (Documentation)**: 1 hour

**Total**: 8 hours

---

## 🚨 Risk Mitigation

### High-Risk Items

1. **Reddit API rate limits** - Implement proper caching and request throttling
2. **LLM API costs** - Set usage limits and implement fallbacks
3. **Complex background processing** - Start with simple manual triggers

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
