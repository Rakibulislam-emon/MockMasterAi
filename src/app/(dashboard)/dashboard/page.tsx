import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { getUserStats } from '@/actions/interview';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Fetch stats (works without webhook)
  const statsResult = await getUserStats();
  const stats = statsResult.data || {
    totalInterviews: 0,
    totalQuestions: 0,
    totalTime: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageScore: 0,
  };

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <DashboardClient stats={stats} />
    </div>
  );
}
