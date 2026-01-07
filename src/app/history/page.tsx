import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { History, ChevronRight, Mic, FileText, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getInterviewHistory } from '@/actions/interview';

export default async function HistoryPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const result = await getInterviewHistory({ limit: 20 });
  const sessions = result.data || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <History className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">InterPrep AI</span>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost">Back to Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold">Interview History</h1>
          <p className="text-muted-foreground">
            Review your past interview sessions and track your progress
          </p>
        </div>

        {sessions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <History className="mx-auto mb-4 h-16 w-16 text-muted-foreground/50" />
              <h3 className="mb-2 text-xl font-semibold">No interviews yet</h3>
              <p className="mb-6 text-muted-foreground">
                Start your first practice session to see it here
              </p>
              <Link href="/practice">
                <Button>Start Practicing</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map(session => (
              <Card key={session.id} className="transition-colors hover:border-primary/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                          session.status === 'completed'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}
                      >
                        {session.sessionType === 'behavioral' ? (
                          <Mic className="h-6 w-6" />
                        ) : session.sessionType === 'technical' ? (
                          <FileText className="h-6 w-6" />
                        ) : (
                          <Trophy className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">
                          {session.sessionType.replace('_', ' ')} Interview
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {session.targetRole || 'General'} •{' '}
                          {new Date(session.startedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">
                          {session.feedback?.overallScore ?? '--'}
                        </p>
                        <p className="text-xs text-muted-foreground">Score</p>
                      </div>

                      <div className="hidden text-center sm:block">
                        <p className="text-2xl font-bold">
                          {session.duration
                            ? `${Math.floor(session.duration / 60)}:${(session.duration % 60).toString().padStart(2, '0')}`
                            : '--'}
                        </p>
                        <p className="text-xs text-muted-foreground">Duration</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            session.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : session.status === 'aborted'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {session.status}
                        </span>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
