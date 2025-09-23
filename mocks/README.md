# Mock Data for Testing

This directory contains mock data and services for testing the Ideas Page functionality without requiring a database connection.

## Files

### `product-ideas.json`

- **15 realistic product ideas** with complete data structure
- Matches the expected database schema from `product_ideas` table
- Includes all required fields for MVP functionality
- Diverse categories: Business (8), Technology (4), Lifestyle (3)
- Score distribution: High (80-100): 7, Medium (70-79): 5, Low (60-69): 3
- Mix of "new" and older ideas for testing the "New" badge functionality

### `mock-data-service.ts`

- **Complete mock API service** that simulates backend functionality
- Supports all filtering, sorting, and searching operations
- Simulates realistic API delays for testing loading states
- Includes idea generation simulation
- Provides statistics and category information

## Data Structure

The mock data follows the exact schema expected by the application:

### Database Format (snake_case)

```typescript
{
  id: string;
  name: string;
  elevator_pitch: string;
  target_audience: string;
  pain_point_solved: string;
  solution_approach: string;
  overall_score: number;
  pain_severity_score: number;
  market_size_score: number;
  competition_score: number;
  implementation_difficulty: number;
  category: string;
  tags: string[];
  created_at: string;
  source_subreddits: string[];
  source_urls: string[];
  generated_by: string;
  processing_metadata: object;
}
```

### API Format (camelCase)

```typescript
{
  id: string;
  name: string;
  elevatorPitch: string;
  targetAudience: string;
  painPointSolved: string;
  solutionApproach: string;
  scoring: {
    overall: number;
    painSeverity: number;
    marketSize: number;
    competition: number;
    implementationDifficulty: number;
  };
  category: string;
  tags: string[];
  createdAt: string;
  sourceSubreddits: string[];
  sourceLinks: string[];
  isNew?: boolean;
}
```

## Usage

### In Development

```typescript
import { mockDataService } from '@/mocks/mock-data-service';

// Fetch ideas with filters
const response = await mockDataService.fetchIdeas({
  category: 'Technology',
  minScore: 80,
  limit: 10,
  sortBy: 'score',
  searchQuery: 'api',
});

// Generate new ideas
const generationResponse = await mockDataService.generateIdeas();

// Get statistics
const stats = mockDataService.getStats();
```

### Testing Features

1. **Filtering**: Test category, score, and search filters
2. **Sorting**: Test newest, highest scored, and by category
3. **Pagination**: Test with different page sizes
4. **Loading States**: Realistic API delays simulate loading
5. **Error Handling**: Can simulate API failures
6. **Generation**: Test idea generation workflow
7. **"New" Badge**: Ideas created within 48 hours show "New" badge

## Sample Ideas Included

1. **TaskSync Pro** - AI task management (Business, Score: 87)
2. **CodeReview Buddy** - Automated code review (Technology, Score: 82)
3. **BudgetGuard** - Personal finance app (Lifestyle, Score: 79)
4. **MeetingMindMap** - AI meeting assistant (Business, Score: 84)
5. **SkillSwap Network** - Freelancer skill trading (Business, Score: 76)
6. **API Documentation Generator** - Developer tools (Technology, Score: 88)
7. **FocusFlow Timer** - Adaptive pomodoro (Lifestyle, Score: 73)
8. **ClientComm Hub** - Client communication (Business, Score: 81)
9. **Code Snippet Manager** - Developer productivity (Technology, Score: 77)
10. **Remote Team Pulse** - Team engagement (Business, Score: 85)
11. **Expense Splitter Pro** - Shared expenses (Lifestyle, Score: 74)
12. **Learning Path Builder** - Personalized learning (Technology, Score: 80)
13. **Startup Idea Validator** - Market validation (Business, Score: 83)
14. **Habit Stack Builder** - Habit formation (Lifestyle, Score: 71)
15. **Freelance Invoice Tracker** - Cash flow management (Business, Score: 86)

## Categories Available

- **Business**: 8 ideas (53.3%)
- **Technology**: 4 ideas (26.7%)
- **Lifestyle**: 3 ideas (20.0%)

## Score Distribution

- **80-100 (High)**: 7 ideas (46.7%)
- **70-79 (Medium)**: 5 ideas (33.3%)
- **60-69 (Low)**: 3 ideas (20.0%)

## Source Subreddits

- r/entrepreneur
- r/smallbusiness
- r/SaaS
- r/webdev
- r/productivity
- r/freelance
- r/startups
- r/personalfinance

This mock data provides comprehensive coverage for testing all aspects of the Ideas Page functionality.
