'use server';

import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import InterviewSession from '@/lib/models/InterviewSession';
import type { ApiResponse } from '@/types';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  target?: number;
}

/**
 * Get user achievements based on their interview stats
 */
export async function getUserAchievements(): Promise<ApiResponse<Achievement[]>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    // Get all completed sessions for the user
    const sessions = await InterviewSession.find(
      {
        clerkId: userId,
        status: 'completed',
      },
      'completedAt feedback.overallScore'
    ).sort({ completedAt: -1 });

    const totalInterviews = sessions.length;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const highestScore = sessions.reduce(
      (max: number, s: any) => Math.max(max, s.feedback?.overallScore || 0),
      0
    );

    // Calculate streak (simplified - just counts consecutive days)
    const currentStreak = calculateStreak(sessions);

    // Define achievements
    const achievements: Achievement[] = [
      {
        id: 'first-step',
        name: 'First Step',
        description: 'Complete your first interview',
        icon: 'star',
        unlocked: totalInterviews >= 1,
        unlockedAt:
          totalInterviews >= 1
            ? (sessions[sessions.length - 1]?.completedAt ?? undefined)
            : undefined,
        progress: Math.min(totalInterviews, 1),
        target: 1,
      },
      {
        id: 'getting-started',
        name: 'Getting Started',
        description: 'Complete 5 interviews',
        icon: 'play',
        unlocked: totalInterviews >= 5,
        progress: Math.min(totalInterviews, 5),
        target: 5,
      },
      {
        id: 'dedicated',
        name: 'Dedicated',
        description: 'Complete 10 interviews',
        icon: 'target',
        unlocked: totalInterviews >= 10,
        progress: Math.min(totalInterviews, 10),
        target: 10,
      },
      {
        id: 'expert',
        name: 'Expert',
        description: 'Complete 25 interviews',
        icon: 'rocket',
        unlocked: totalInterviews >= 25,
        progress: Math.min(totalInterviews, 25),
        target: 25,
      },
      {
        id: 'rising-star',
        name: 'Rising Star',
        description: 'Score 70 or higher on an interview',
        icon: 'trending-up',
        unlocked: highestScore >= 70,
        progress: Math.min(highestScore, 70),
        target: 70,
      },
      {
        id: 'ace-performer',
        name: 'Ace Performer',
        description: 'Score 90 or higher on an interview',
        icon: 'trophy',
        unlocked: highestScore >= 90,
        progress: Math.min(highestScore, 90),
        target: 90,
      },
      {
        id: 'consistent',
        name: 'Consistent',
        description: 'Maintain a 3-day practice streak',
        icon: 'flame',
        unlocked: currentStreak >= 3,
        progress: Math.min(currentStreak, 3),
        target: 3,
      },
      {
        id: 'on-fire',
        name: 'On Fire',
        description: 'Maintain a 7-day practice streak',
        icon: 'zap',
        unlocked: currentStreak >= 7,
        progress: Math.min(currentStreak, 7),
        target: 7,
      },
    ];

    return { success: true, data: achievements };
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return { success: false, error: 'Failed to fetch achievements' };
  }
}

// Helper to calculate practice streak
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calculateStreak(sessions: any[]): number {
  if (sessions.length === 0) return 0;

  const uniqueDays = new Set<string>();
  sessions.forEach(s => {
    if (s.completedAt) {
      uniqueDays.add(new Date(s.completedAt).toDateString());
    }
  });

  const sortedDays = Array.from(uniqueDays)
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  if (sortedDays.length === 0) return 0;

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastPractice = new Date(sortedDays[0]);
  lastPractice.setHours(0, 0, 0, 0);

  // Check if last practice was today or yesterday
  const daysSinceLastPractice = Math.floor(
    (today.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastPractice > 1) return 0;

  for (let i = 1; i < sortedDays.length; i++) {
    const current = new Date(sortedDays[i]);
    const previous = new Date(sortedDays[i - 1]);
    current.setHours(0, 0, 0, 0);
    previous.setHours(0, 0, 0, 0);

    const diff = Math.floor((previous.getTime() - current.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}
