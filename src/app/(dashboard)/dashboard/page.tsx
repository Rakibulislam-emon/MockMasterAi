import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { Mic, FileText, History, Trophy, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getUserStats } from '@/actions/interview';

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

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Mic, current: true },
    { name: 'Practice', href: '/practice', icon: Mic, current: false },
    { name: 'Resumes', href: '/resumes', icon: FileText, current: false },
    { name: 'History', href: '/history', icon: History, current: false },
    { name: 'Achievements', href: '/achievements', icon: Trophy, current: false },
    { name: 'Settings', href: '/settings', icon: Settings, current: false },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-64 border-r bg-card hidden md:block">
        <div className="flex flex-col h-full p-4">
          <nav className="space-y-1 flex-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="border-t pt-4">
            <form action="/api/sign-out" method="POST">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/api/sign-out">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Link>
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
        <div className="flex justify-around py-2">
          {navigation.slice(0, 5).map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-8 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-muted-foreground">
              Ready to practice for your next interview?
            </p>
          </div>

          {/* Quick Start Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link href="/practice">
              <Card className="h-full border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Mic className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Start Interview</h3>
                  <p className="text-sm text-muted-foreground">
                    Begin a new mock interview session with AI
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/resumes">
              <Card className="h-full border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Upload Resume</h3>
                  <p className="text-sm text-muted-foreground">
                    Get AI-powered analysis of your resume
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/history">
              <Card className="h-full border-2 hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <History className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">View History</h3>
                  <p className="text-sm text-muted-foreground">
                    Review your past interview sessions
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{stats.totalInterviews}</div>
                <p className="text-sm text-muted-foreground">Interviews Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{stats.totalQuestions}</div>
                <p className="text-sm text-muted-foreground">Questions Answered</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">{stats.currentStreak}</div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold">
                  {stats.averageScore > 0 ? `${stats.averageScore}%` : '--'}
                </div>
                <p className="text-sm text-muted-foreground">Average Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Recent Activity</h3>
              <div className="text-center py-8 text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No interviews yet</p>
                <p className="text-sm">Start your first practice session!</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
