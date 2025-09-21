# Reddit API Integration

This module provides a complete Reddit API client for extracting product idea opportunities from targeted subreddits.

## Setup Instructions

### 1. Reddit API Credentials

1. Go to [Reddit App Preferences](https://www.reddit.com/prefs/apps)
2. Click "Create App" or "Create Another App"
3. Fill out the form:
   - **Name**: `reddit-product-idea-generator`
   - **App type**: Select "script" (for personal use)
   - **Description**: `Tool for generating product ideas from Reddit discussions`
   - **About URL**: (optional)
   - **Redirect URI**: `http://localhost:3000` (required but not used for script apps)
4. Click "Create app"
5. Note down:
   - **Client ID**: The string under the app name (e.g., `abc123def456`)
   - **Client Secret**: The "secret" field value

### 2. Environment Variables

Add these environment variables to your `.env.local` file:

```bash
# Reddit API Configuration
REDDIT_CLIENT_ID=your-client-id-here
REDDIT_CLIENT_SECRET=your-client-secret-here
REDDIT_USER_AGENT=reddit-product-idea-generator:v1.0.0 (by /u/yourusername)
```

**Important Notes:**

- Replace `yourusername` in the User-Agent with your actual Reddit username
- The User-Agent format is required by Reddit API guidelines
- Keep your client secret secure and never commit it to version control

### 3. Testing the Integration

Use the test utility to verify your setup:

```typescript
import { runAllTests } from '@/lib/reddit/test-client';

// Run all tests
await runAllTests();

// Or test individual components
import { testAuthentication, testFetchPosts } from '@/lib/reddit/test-client';

const isAuthenticated = await testAuthentication();
const posts = await testFetchPosts('entrepreneur', 5);
```

## Usage Examples

### Basic Usage

```typescript
import { redditClient } from '@/lib/reddit';

// Authenticate (happens automatically on first request)
await redditClient.authenticate();

// Fetch hot posts from r/entrepreneur
const posts = await redditClient.getSubredditPosts('entrepreneur', 'hot', 10);

// Fetch top posts from the last week
const topPosts = await redditClient.getSubredditPosts(
  'startups',
  'top',
  25,
  'week',
);

// Get post comments
const [postData, comments] = await redditClient.getPostComments(
  'entrepreneur',
  'post_id_here',
);

// Search for specific topics
const searchResults = await redditClient.searchPosts(
  'pain point OR frustration OR problem',
  'entrepreneur',
);
```

### Working with Target Subreddits

```typescript
import { getEnabledSubreddits, getSubredditsByCategory } from '@/lib/reddit';

// Get all enabled subreddits sorted by priority
const subreddits = getEnabledSubreddits();

// Get business-focused subreddits
const businessSubs = getSubredditsByCategory('Business');

// Fetch posts from all target subreddits
for (const config of subreddits) {
  const posts = await redditClient.getSubredditPosts(config.name, 'hot', 25);
  console.log(`${config.name}: ${posts.data.children.length} posts`);
}
```

## Rate Limiting

The client automatically handles Reddit's rate limiting (60 requests per minute):

- Enforces minimum 1-second intervals between requests
- Tracks rate limit headers from Reddit API
- Provides rate limit status via `getRateLimitStatus()`

```typescript
// Check current rate limit status
const status = redditClient.getRateLimitStatus();
console.log(`Remaining: ${status.remaining}, Reset: ${status.resetTime}`);
```

## Error Handling

The client includes comprehensive error handling:

- Authentication failures
- Rate limit exceeded
- Invalid subreddit names
- Network errors
- API response errors

```typescript
try {
  const posts = await redditClient.getSubredditPosts('invalidsubreddit');
} catch (error) {
  console.error('Failed to fetch posts:', error.message);
}
```

## Target Subreddits

The following subreddits are configured for product idea discovery:

| Subreddit       | Category   | Priority | Description                                       |
| --------------- | ---------- | -------- | ------------------------------------------------- |
| r/entrepreneur  | Business   | 5        | Startup problems and entrepreneurial challenges   |
| r/SaaS          | Software   | 5        | Software as a Service needs and market gaps       |
| r/startups      | Business   | 5        | Startup ecosystem and market opportunities        |
| r/smallbusiness | Business   | 4        | Small business pain points and operational issues |
| r/webdev        | Technology | 4        | Web development tools and workflow challenges     |
| r/productivity  | Lifestyle  | 4        | Productivity tools and workflow optimization      |
| r/freelance     | Business   | 3        | Freelancer challenges and business needs          |

## Next Steps

After setting up the Reddit API client, you can:

1. **Implement data extraction logic** (section 2.3.3 in scope.md)
2. **Add data processing and filtering** (section 2.3.4 in scope.md)
3. **Create database storage** (section 2.3.5 in scope.md)
4. **Build the service layer** (section 2.3.6 in scope.md)

## Troubleshooting

### Common Issues

1. **Authentication Error**: Verify your client ID and secret are correct
2. **Rate Limited**: Wait for the rate limit to reset (check `getRateLimitStatus()`)
3. **Invalid Subreddit**: Ensure subreddit names are spelled correctly (without r/ prefix)
4. **Network Errors**: Check your internet connection and Reddit's status

### Debug Mode

Enable detailed logging by setting the environment variable:

```bash
DEBUG=reddit-api
```

This will log all API requests and responses for debugging purposes.
