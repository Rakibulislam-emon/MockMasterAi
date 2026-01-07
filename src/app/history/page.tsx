import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getInterviewHistory } from '@/actions/interview';
import { HistoryClient } from './history-client';

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const result = await getInterviewHistory({ limit: 50 });
  const sessions = result.data || [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      <HistoryClient initialSessions={sessions} />
    </div>
  );
}
