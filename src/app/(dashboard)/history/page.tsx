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
    <div className="container mx-auto px-4 py-8">
      <HistoryClient initialSessions={sessions} />
    </div>
  );
}
