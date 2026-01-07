'use client';

import Link from 'next/link';
import {
  Mic,
  FileText,
  History,
  Trophy,
  Sparkles,
  Zap,
  ArrowRight,
  PlayCircle,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface DashboardStats {
  totalInterviews: number;
  totalQuestions: number;
  totalTime: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
}

interface DashboardClientProps {
  stats: DashboardStats;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function DashboardClient({ stats }: DashboardClientProps) {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      {/* Header */}
      <motion.div variants={item} className="flex flex-col gap-2">
        <h1 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent md:text-5xl">
          Welcome back!
        </h1>
        <p className="text-lg text-muted-foreground">
          Ready to master your next interview? Let's get practicing.
        </p>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/practice" className="group">
          <motion.div variants={item} whileHover={{ y: -5 }} className="h-full">
            <Card className="relative h-full overflow-hidden border-white/10 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 transition-all hover:bg-white/5 hover:shadow-lg hover:shadow-indigo-500/20">
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="rounded-lg bg-indigo-500/20 p-3 ring-1 ring-indigo-500/40 transition-all group-hover:scale-110 group-hover:bg-indigo-500/30">
                  <PlayCircle className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-foreground">Start Interview</h3>
                  <p className="text-sm text-muted-foreground">Begin a new AI mock session</p>
                </div>
                <div className="mt-auto flex items-center text-sm font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Start now <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Link>

        <Link href="/resumes" className="group">
          <motion.div variants={item} whileHover={{ y: -5 }} className="h-full">
            <Card className="relative h-full overflow-hidden border-white/10 bg-white/5 transition-all hover:bg-white/10 hover:shadow-lg">
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="rounded-lg bg-white/10 p-3 ring-1 ring-white/20 transition-all group-hover:scale-110 group-hover:bg-white/20">
                  <FileText className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-foreground">Analyze Resume</h3>
                  <p className="text-sm text-muted-foreground">Get AI feedback on your CV</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Link>

        <Link href="/history" className="group">
          <motion.div variants={item} whileHover={{ y: -5 }} className="h-full">
            <Card className="relative h-full overflow-hidden border-white/10 bg-white/5 transition-all hover:bg-white/10 hover:shadow-lg">
              <CardContent className="flex flex-col items-start gap-4 p-6">
                <div className="rounded-lg bg-white/10 p-3 ring-1 ring-white/20 transition-all group-hover:scale-110 group-hover:bg-white/20">
                  <History className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold text-foreground">View History</h3>
                  <p className="text-sm text-muted-foreground">Review past sessions</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </Link>
      </div>

      {/* Stats Grid */}
      <motion.div variants={item}>
        <h2 className="mb-6 text-xl font-semibold">Your Progress</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-white/10 bg-white/5 transition-all hover:bg-white/10">
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Interviews</p>
                <Mic className="h-4 w-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold">{stats.totalInterviews}</div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 transition-all hover:bg-white/10">
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Questions</p>
                <Sparkles className="h-4 w-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 transition-all hover:bg-white/10">
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Streak</p>
                <Zap className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold">{stats.currentStreak} Days</div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 transition-all hover:bg-white/10">
            <CardContent className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">Avg Score</p>
                <Trophy className="h-4 w-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold">
                {stats.averageScore > 0 ? `${stats.averageScore}%` : '--'}
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Recent Activity (Placeholder for now) */}
      <motion.div variants={item}>
        <Card className="border-white/10 bg-white/5">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
              <Link href="/history">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  View All
                </Button>
              </Link>
            </div>

            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
              <div className="mb-4 rounded-full bg-white/5 p-4 ring-1 ring-white/10">
                <History className="h-8 w-8 opacity-50" />
              </div>
              <p className="text-lg font-medium text-foreground">No interviews yet</p>
              <p className="mb-4 text-sm">
                Start your first practice session to see your progress!
              </p>
              <Link href="/practice">
                <Button
                  variant="outline"
                  className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20"
                >
                  Start Practice
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
