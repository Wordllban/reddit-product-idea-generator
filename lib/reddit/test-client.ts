/**
 * Reddit API Client Test Utility
 *
 * Simple test functions to verify Reddit API integration
 */

import { redditClient, getEnabledSubreddits } from './index';
import type { RedditPost } from './types';

/**
 * Tests Reddit API authentication
 */
export async function testAuthentication(): Promise<boolean> {
  try {
    await redditClient.authenticate();
    return redditClient.isAuthenticated();
  } catch (error) {
    console.error('Authentication test failed:', error);
    return false;
  }
}

/**
 * Tests fetching posts from a subreddit
 */
export async function testFetchPosts(
  subreddit: string = 'entrepreneur',
  limit: number = 5,
): Promise<RedditPost[]> {
  try {
    const response = await redditClient.getSubredditPosts(
      subreddit,
      'hot',
      limit,
    );
    const posts = response.data.children.map((child) => child.data);

    console.log(
      `Successfully fetched ${posts.length} posts from r/${subreddit}`,
    );
    return posts;
  } catch (error) {
    console.error(`Failed to fetch posts from r/${subreddit}:`, error);
    return [];
  }
}

/**
 * Tests fetching posts from all target subreddits
 */
export async function testAllSubreddits(): Promise<
  { subreddit: string; posts: number; success: boolean }[]
> {
  const subreddits = getEnabledSubreddits();
  const results = [];

  for (const config of subreddits) {
    try {
      const posts = await testFetchPosts(config.name, 3);
      results.push({
        subreddit: config.name,
        posts: posts.length,
        success: posts.length > 0,
      });

      // Small delay between requests to be respectful
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      results.push({
        subreddit: config.name,
        posts: 0,
        success: false,
      });
    }
  }

  return results;
}

/**
 * Tests rate limiting functionality
 */
export async function testRateLimit(): Promise<void> {
  console.log('Testing rate limiting...');
  const startTime = Date.now();

  // Make 3 quick requests
  for (let i = 0; i < 3; i++) {
    await testFetchPosts('entrepreneur', 1);
    const elapsed = Date.now() - startTime;
    console.log(`Request ${i + 1} completed after ${elapsed}ms`);
  }

  const totalTime = Date.now() - startTime;
  console.log(`Total time for 3 requests: ${totalTime}ms`);

  const rateLimitStatus = redditClient.getRateLimitStatus();
  console.log('Rate limit status:', rateLimitStatus);
}

/**
 * Tests subreddit validation functionality
 */
export async function testSubredditValidation(
  subreddit: string = 'entrepreneur',
): Promise<void> {
  try {
    console.log(`Testing validation for r/${subreddit}...`);
    const validation = await redditClient.validateSubreddit(subreddit);

    console.log(`   Exists: ${validation.exists}`);
    console.log(`   Accessible: ${validation.accessible}`);
    console.log(`   Subscribers: ${validation.subscribers.toLocaleString()}`);
    console.log(`   Private: ${validation.isPrivate}`);
    if (validation.error) {
      console.log(`   Error: ${validation.error}`);
    }
  } catch (error) {
    console.error(`Validation test failed for r/${subreddit}:`, error);
  }
}

/**
 * Tests subreddit health check functionality
 */
export async function testSubredditHealthCheck(
  subreddit: string = 'entrepreneur',
): Promise<void> {
  try {
    console.log(`Performing health check for r/${subreddit}...`);
    const healthCheck = await redditClient.performSubredditHealthCheck(
      subreddit,
    );

    console.log(
      `   Overall Health: ${
        healthCheck.healthy ? '✅ Healthy' : '❌ Unhealthy'
      }`,
    );
    console.log(`   Recent Posts: ${healthCheck.recentActivity.postCount}`);
    console.log(
      `   Average Score: ${healthCheck.recentActivity.averageScore.toFixed(1)}`,
    );
    console.log(
      `   Subscribers: ${healthCheck.validation.subscribers.toLocaleString()}`,
    );

    if (healthCheck.recommendations.length > 0) {
      console.log('   Recommendations:');
      healthCheck.recommendations.forEach((rec) => {
        console.log(`     - ${rec}`);
      });
    }
  } catch (error) {
    console.error(`Health check failed for r/${subreddit}:`, error);
  }
}

/**
 * Tests validation and health for all target subreddits
 */
export async function testAllSubredditHealth(): Promise<void> {
  const subreddits = getEnabledSubreddits();
  console.log(`Testing health for ${subreddits.length} target subreddits...\n`);

  for (const config of subreddits) {
    await testSubredditHealthCheck(config.name);
    console.log(); // Empty line between subreddits

    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}

/**
 * Runs all tests
 */
export async function runAllTests(): Promise<void> {
  console.log('🧪 Running Reddit API Client Tests...\n');

  // Test 1: Authentication
  console.log('1. Testing authentication...');
  const authSuccess = await testAuthentication();
  console.log(
    `   ${authSuccess ? '✅' : '❌'} Authentication: ${
      authSuccess ? 'SUCCESS' : 'FAILED'
    }\n`,
  );

  if (!authSuccess) {
    console.log('❌ Authentication failed. Cannot proceed with other tests.');
    return;
  }

  // Test 2: Single subreddit
  console.log('2. Testing single subreddit fetch...');
  const posts = await testFetchPosts('entrepreneur', 3);
  console.log(
    `   ${posts.length > 0 ? '✅' : '❌'} Fetched ${posts.length} posts\n`,
  );

  // Test 3: All target subreddits
  console.log('3. Testing all target subreddits...');
  const results = await testAllSubreddits();
  results.forEach((result) => {
    console.log(
      `   ${result.success ? '✅' : '❌'} r/${result.subreddit}: ${
        result.posts
      } posts`,
    );
  });
  console.log();

  // Test 4: Subreddit validation
  console.log('4. Testing subreddit validation...');
  await testSubredditValidation('entrepreneur');
  console.log();

  // Test 5: Rate limiting
  console.log('5. Testing rate limiting...');
  await testRateLimit();

  console.log('\n🎉 All tests completed!');
}
