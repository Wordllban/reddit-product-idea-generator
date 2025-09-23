import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { IdeaGeneratorClient } from '@/components/idea-generator-client';

export default async function IdeasPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect('/auth/login');
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-6xl mx-auto px-4">
      <div className="w-full">
        <h1 className="font-bold text-3xl mb-2">Product Ideas Generator</h1>
        <p className="text-muted-foreground">
          Discover product opportunities by analyzing Reddit discussions for
          problems and pain points
        </p>
      </div>

      <IdeaGeneratorClient />
    </div>
  );
}
