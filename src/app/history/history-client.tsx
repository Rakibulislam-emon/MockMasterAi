'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  History,
  Mic,
  FileText,
  Trophy,
  ChevronRight,
  Sparkles,
  Trash2,
  Calendar,
  Clock,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteAllInterviews } from '@/actions/interview';

interface InterviewSession {
  id: string;
  sessionType: string;
  status: string;
  targetRole: string | null;
  startedAt: Date;
  completedAt: Date | null;
  duration: number | null;
  feedback: { overallScore: number } | null;
}

interface HistoryClientProps {
  initialSessions: InterviewSession[];
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

export function HistoryClient({ initialSessions }: HistoryClientProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [sessions, setSessions] = useState(initialSessions);

  const handleDeleteAll = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAllInterviews();
      if (result.success) {
        setSessions([]);
        router.refresh();
      } else {
        console.error('Failed to delete history:', result.error);
      }
    } catch (error) {
      console.error('Error deleting history:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/60 p-4 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              <History className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
              InterPrep AI
            </span>
          </div>
          <Button
            variant="ghost"
            className="hover:bg-white/5"
            onClick={() => router.push('/dashboard')}
          >
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
          {/* Page Header */}
          <motion.div
            variants={item}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Interview History</h1>
              <p className="text-muted-foreground">Track your progress and review past sessions.</p>
            </div>

            {sessions.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All History
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="border-white/10 bg-black/90 text-foreground backdrop-blur-xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className="text-muted-foreground">
                      This action cannot be undone. This will permanently delete your entire
                      interview history and all associated feedback.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-white/10 bg-white/5 hover:bg-white/10 hover:text-foreground">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAll}
                      className="bg-red-600 hover:bg-red-700"
                      disabled={isDeleting}
                    >
                      {isDeleting ? 'Deleting...' : 'Delete Everything'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </motion.div>

          {/* History List */}
          <motion.div variants={item}>
            {sessions.length === 0 ? (
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-6 rounded-full bg-indigo-500/10 p-6 ring-1 ring-indigo-500/20">
                    <History className="h-12 w-12 text-indigo-400 opacity-50" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">No interviews yet</h3>
                  <p className="mb-8 max-w-sm text-muted-foreground">
                    Your interview journey begins with a single step. Start practicing to see your
                    personalized history here.
                  </p>
                  <Link href="/practice">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25"
                    >
                      Start First Interview
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence>
                  {sessions.map(session => (
                    <motion.div
                      key={session.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={`/history/${session.id}`} className="block">
                        <Card className="group border-white/10 bg-white/5 transition-all hover:border-indigo-500/30 hover:bg-white/10 hover:shadow-lg hover:shadow-indigo-500/10">
                          <CardContent className="p-6">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                              {/* Left Side: Icon & Info */}
                              <div className="flex items-start gap-4 sm:items-center">
                                <div
                                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br shadow-inner ${
                                    session.sessionType === 'technical'
                                      ? 'from-purple-500/20 to-pink-500/20'
                                      : session.sessionType === 'behavioral'
                                        ? 'from-blue-500/20 to-cyan-500/20'
                                        : 'from-amber-500/20 to-orange-500/20'
                                  }`}
                                >
                                  {session.sessionType === 'behavioral' ? (
                                    <Mic
                                      className={`h-6 w-6 ${session.sessionType === 'behavioral' ? 'text-blue-400' : ''}`}
                                    />
                                  ) : session.sessionType === 'technical' ? (
                                    <FileText
                                      className={`h-6 w-6 ${session.sessionType === 'technical' ? 'text-purple-400' : ''}`}
                                    />
                                  ) : (
                                    <Trophy
                                      className={`h-6 w-6 ${session.sessionType === 'general' ? 'text-amber-400' : 'text-green-400'}`}
                                    />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold capitalize text-foreground transition-colors group-hover:text-primary">
                                    {session.sessionType} Interview
                                  </h3>
                                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(session.startedAt).toLocaleDateString()}
                                    </span>
                                    <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />
                                    <span className="capitalize">
                                      {session.targetRole || 'General Role'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Side: Stats & Status */}
                              <div className="flex items-center justify-between gap-6 sm:justify-end">
                                <div className="text-center">
                                  <p
                                    className={`text-xl font-bold ${
                                      (session.feedback?.overallScore || 0) >= 70
                                        ? 'text-green-400'
                                        : (session.feedback?.overallScore || 0) >= 40
                                          ? 'text-yellow-400'
                                          : 'text-red-400'
                                    }`}
                                  >
                                    {session.feedback?.overallScore ?? '--'}
                                  </p>
                                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Score
                                  </p>
                                </div>

                                <div className="hidden text-center sm:block">
                                  <div className="flex items-center justify-center gap-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <p className="text-lg font-bold text-foreground">
                                      {session.duration
                                        ? `${Math.floor(session.duration / 60)}:${(session.duration % 60).toString().padStart(2, '0')}`
                                        : '--'}
                                    </p>
                                  </div>
                                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                    Duration
                                  </p>
                                </div>

                                <div
                                  className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
                                    session.status === 'completed'
                                      ? 'border-green-500/30 bg-green-500/10 text-green-400'
                                      : session.status === 'aborted'
                                        ? 'border-red-500/30 bg-red-500/10 text-red-400'
                                        : 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                                  }`}
                                >
                                  {session.status.replace('_', ' ')}
                                </div>
                                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
