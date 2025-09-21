'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import {
  TARGET_SUBREDDITS,
  getEnabledSubreddits,
} from '@/lib/reddit/subreddits';
import type { RedditPost } from '@/lib/reddit/types';

interface TestResult {
  subreddit: string;
  posts: number;
  success: boolean;
  error?: string;
  samplePosts?: RedditPost[];
}

interface AuthStatus {
  isAuthenticated: boolean;
  error?: string;
  testing: boolean;
}

export function RedditTestClient() {
  const [authStatus, setAuthStatus] = useState<AuthStatus>({
    isAuthenticated: false,
    testing: false,
  });
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [selectedSubreddit, setSelectedSubreddit] =
    useState<string>('entrepreneur');

  const testAuthentication = async () => {
    setAuthStatus({ isAuthenticated: false, testing: true });

    try {
      const response = await fetch('/api/reddit/test-auth', {
        method: 'POST',
      });

      const result = await response.json();

      if (result.success) {
        setAuthStatus({ isAuthenticated: true, testing: false });
      } else {
        setAuthStatus({
          isAuthenticated: false,
          testing: false,
          error: result.error || 'Authentication failed',
        });
      }
    } catch (error) {
      setAuthStatus({
        isAuthenticated: false,
        testing: false,
        error: 'Network error during authentication test',
      });
    }
  };

  const testSingleSubreddit = async (subreddit: string) => {
    try {
      const response = await fetch('/api/reddit/test-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subreddit, limit: 5 }),
      });

      const result = await response.json();

      if (result.success) {
        return {
          subreddit,
          posts: result.posts?.length || 0,
          success: true,
          samplePosts: result.posts || [],
        };
      } else {
        return {
          subreddit,
          posts: 0,
          success: false,
          error: result.error,
        };
      }
    } catch (error) {
      return {
        subreddit,
        posts: 0,
        success: false,
        error: 'Network error',
      };
    }
  };

  const testAllSubreddits = async () => {
    setIsTestingAll(true);
    setTestResults([]);

    const subreddits = getEnabledSubreddits();
    const results: TestResult[] = [];

    for (const config of subreddits) {
      const result = await testSingleSubreddit(config.name);
      results.push(result);
      setTestResults([...results]); // Update UI progressively

      // Small delay between requests to be respectful
      if (config !== subreddits[subreddits.length - 1]) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    setIsTestingAll(false);
  };

  const testSpecificSubreddit = async () => {
    const result = await testSingleSubreddit(selectedSubreddit);
    setTestResults([result]);
  };

  return (
    <div className="space-y-6">
      {/* Authentication Test */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {authStatus.isAuthenticated ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            Reddit API Authentication
          </CardTitle>
          <CardDescription>
            Test connection to Reddit API with your credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={testAuthentication}
              disabled={authStatus.testing}
              variant={authStatus.isAuthenticated ? 'secondary' : 'default'}
            >
              {authStatus.testing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test Authentication
            </Button>

            {authStatus.isAuthenticated && (
              <Badge variant="default" className="bg-green-100 text-green-800">
                ✅ Authenticated
              </Badge>
            )}

            {authStatus.error && (
              <Badge variant="destructive">❌ {authStatus.error}</Badge>
            )}
          </div>

          {authStatus.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-700">
              <p>
                <strong>Setup Instructions:</strong>
              </p>
              <ol className="list-decimal list-inside mt-2 space-y-1">
                <li>
                  Create a Reddit app at{' '}
                  <a
                    href="https://www.reddit.com/prefs/apps"
                    target="_blank"
                    className="underline"
                  >
                    reddit.com/prefs/apps
                  </a>
                </li>
                <li>
                  Add environment variables to your <code>.env.local</code>{' '}
                  file:
                </li>
                <li>
                  <code>REDDIT_CLIENT_ID=your-client-id</code>
                </li>
                <li>
                  <code>REDDIT_CLIENT_SECRET=your-client-secret</code>
                </li>
                <li>
                  <code>
                    REDDIT_USER_AGENT=reddit-product-idea-generator:v1.0.0 (by
                    /u/yourusername)
                  </code>
                </li>
              </ol>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Target Subreddits Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Target Subreddits Configuration</CardTitle>
          <CardDescription>
            Configured subreddits for product idea discovery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TARGET_SUBREDDITS.map((config) => (
              <div
                key={config.name}
                className="p-3 border rounded-md space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">r/{config.name}</span>
                  <Badge variant="outline">Priority {config.priority}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {config.description}
                </p>
                <Badge variant="secondary" className="text-xs">
                  {config.category}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Testing Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Reddit Data Testing</CardTitle>
          <CardDescription>
            Test data extraction from Reddit subreddits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={testAllSubreddits}
              disabled={isTestingAll || !authStatus.isAuthenticated}
            >
              {isTestingAll ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Test All Subreddits
            </Button>

            <div className="flex items-center gap-2">
              <select
                value={selectedSubreddit}
                onChange={(e) => setSelectedSubreddit(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                {TARGET_SUBREDDITS.map((config) => (
                  <option key={config.name} value={config.name}>
                    r/{config.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={testSpecificSubreddit}
                variant="outline"
                disabled={!authStatus.isAuthenticated}
              >
                Test Selected
              </Button>
            </div>
          </div>

          {!authStatus.isAuthenticated && (
            <p className="text-sm text-muted-foreground">
              Please authenticate first to test data extraction.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Results from Reddit API data extraction tests
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded-md p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">r/{result.subreddit}</span>
                      {result.success ? (
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          ✅ {result.posts} posts
                        </Badge>
                      ) : (
                        <Badge variant="destructive">❌ Failed</Badge>
                      )}
                    </div>
                    <a
                      href={`https://reddit.com/r/${result.subreddit}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>

                  {result.error && (
                    <p className="text-sm text-red-600">
                      Error: {result.error}
                    </p>
                  )}

                  {result.samplePosts && result.samplePosts.length > 0 && (
                    <div className="space-y-2">
                      <Separator />
                      <h4 className="font-medium text-sm">Sample Posts:</h4>
                      <div className="space-y-2">
                        {result.samplePosts
                          .slice(0, 3)
                          .map((post, postIndex) => (
                            <div
                              key={postIndex}
                              className="bg-gray-50 rounded-md p-3 text-sm"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium line-clamp-2">
                                    {post.title}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <span>👤 u/{post.author}</span>
                                    <span>⬆️ {post.score}</span>
                                    <span>💬 {post.num_comments}</span>
                                  </div>
                                </div>
                                <a
                                  href={`https://reddit.com${post.permalink}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700 flex-shrink-0"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                              {post.selftext && (
                                <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                                  {post.selftext}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
