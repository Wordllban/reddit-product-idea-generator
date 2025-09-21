import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { RedditTestClient } from '@/components/reddit-test-client';

export default async function IdeasPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="w-full">
        <h1 className="font-bold text-3xl mb-2">Product Ideas Generator</h1>
        <p className="text-muted-foreground">
          Testing Reddit API integration for extracting product ideas from
          targeted subreddits
        </p>
      </div>

      <RedditTestClient />
    </div>
  );
}
