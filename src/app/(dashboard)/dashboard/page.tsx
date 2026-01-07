import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import {
  Mic,
  FileText,
  History,
  Trophy,
  Settings,
  LogOut,
  Sparkles,
  ArrowRight,
  Zap,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Mic, current: true },
    { name: 'Practice', href: '/practice', icon: Play, current: false },
    { name: 'Resumes', href: '/resumes', icon: FileText, current: false },
    { name: 'History', href: '/history', icon: History, current: false },
    { name: 'Achievements', href: '/achievements', icon: Trophy, current: false },
    { name: 'Settings', href: '/settings', icon: Settings, current: false },
  ];

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      {/* Sidebar */}
      <aside className="fixed bottom-0 left-0 top-16 hidden w-64 border-r border-white/10 bg-background/60 backdrop-blur-xl md:block">
        <div className="flex h-full flex-col p-4">
          <nav className="flex-1 space-y-2">
            {navigation.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  item.current
                    ? 'bg-primary/10 text-primary shadow-sm hover:bg-primary/20'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                <item.icon
                  className={`h-5 w-5 transition-colors ${item.current ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}`}
                />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="border-t border-white/10 pt-4">
            <form action="/api/sign-out" method="POST">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:bg-white/5 hover:text-foreground"
                asChild
              >
                <Link href="/api/sign-out">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Link>
              </Button>
            </form>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-background/80 backdrop-blur-xl md:hidden">
        <div className="flex justify-around py-3">
          {navigation.slice(0, 5).map(item => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-lg px-2 py-1 transition-colors ${
                item.current ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-24 pt-8 md:ml-64 md:p-8">
        <div className="mx-auto max-w-6xl">
          <DashboardClient stats={stats} />
        </div>
      </main>
    </div>
  );
}
