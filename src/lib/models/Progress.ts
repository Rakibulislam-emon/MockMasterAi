import mongoose, { Schema, Document, Model } from 'mongoose';

// Daily progress document interface
export interface IProgress extends Document {
  clerkId: string;
  date: Date;
  interviewsCompleted: number;
  totalQuestionsAnswered: number;
  averageScore: number | null;
  timeSpentMinutes: number;
  focusAreas: string[];
  achievements: {
    achievementId: string;
    earnedAt: Date;
  }[];
  streaks: {
    current: number;
    longest: number;
    lastActivityDate: Date | null;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Progress schema definition
const ProgressSchema = new Schema<IProgress>(
  {
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    interviewsCompleted: {
      type: Number,
      default: 0,
    },
    totalQuestionsAnswered: {
      type: Number,
      default: 0,
    },
    averageScore: {
      type: Number,
      default: null,
    },
    timeSpentMinutes: {
      type: Number,
      default: 0,
    },
    focusAreas: [String],
    achievements: [
      {
        achievementId: String,
        earnedAt: Date,
      },
    ],
    streaks: {
      current: {
        type: Number,
        default: 0,
      },
      longest: {
        type: Number,
        default: 0,
      },
      lastActivityDate: {
        type: Date,
        default: null,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
ProgressSchema.index({ clerkId: 1, date: -1 });

// Static methods
ProgressSchema.statics.getTodayProgress = async function (
  clerkId: string
): Promise<IProgress | null> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return this.findOne({
    clerkId,
    date: { $gte: today, $lt: tomorrow },
  });
};

ProgressSchema.statics.getDateRangeProgress = async function (
  clerkId: string,
  startDate: Date,
  endDate: Date
): Promise<IProgress[]> {
  return this.find({
    clerkId,
    date: { $gte: startDate, $lte: endDate },
  }).sort({ date: 1 });
};

ProgressSchema.statics.updateTodayProgress = async function (
  clerkId: string,
  updates: Partial<IProgress>
): Promise<IProgress> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const progress = await this.findOneAndUpdate(
    { clerkId, date: today },
    { $set: updates },
    { upsert: true, new: true }
  );

  return progress;
};

ProgressSchema.statics.updateStreak = async function (clerkId: string): Promise<IProgress> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Get yesterday's progress to check if streak continues
  const yesterdayProgress = await this.findOne({
    clerkId,
    date: yesterday,
  });

  // Get today's progress
  let todayProgress = await this.findOne({ clerkId, date: today });

  if (!todayProgress) {
    todayProgress = new this({
      clerkId,
      date: today,
      interviewsCompleted: 0,
      totalQuestionsAnswered: 0,
      timeSpentMinutes: 0,
      focusAreas: [],
      achievements: [],
      streaks: {
        current: 0,
        longest: 0,
        lastActivityDate: null,
      },
    });
  }

  // Check if user was active yesterday
  if (yesterdayProgress && yesterdayProgress.interviewsCompleted > 0) {
    // Continue streak
    todayProgress.streaks.current = yesterdayProgress.streaks.current + 1;
  } else if (
    yesterdayProgress &&
    yesterdayProgress.interviewsCompleted === 0 &&
    yesterdayProgress.streaks.current > 0
  ) {
    // Streak was broken yesterday, but user is active today
    todayProgress.streaks.current = 1;
  } else {
    // Start new streak or continue if already active today
    if (todayProgress.interviewsCompleted > 0 && todayProgress.streaks.current === 0) {
      todayProgress.streaks.current = 1;
    }
  }

  // Update longest streak if needed
  if (todayProgress.streaks.current > todayProgress.streaks.longest) {
    todayProgress.streaks.longest = todayProgress.streaks.current;
  }

  todayProgress.streaks.lastActivityDate = today;

  return todayProgress.save();
};

ProgressSchema.statics.getUserStats = async function (clerkId: string): Promise<{
  totalInterviews: number;
  totalQuestions: number;
  totalTime: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
}> {
  const allProgress = await this.find({ clerkId });

  const totalInterviews = allProgress.reduce(
    (sum: number, p: IProgress) => sum + p.interviewsCompleted,
    0
  );
  const totalQuestions = allProgress.reduce(
    (sum: number, p: IProgress) => sum + p.totalQuestionsAnswered,
    0
  );
  const totalTime = allProgress.reduce((sum: number, p: IProgress) => sum + p.timeSpentMinutes, 0);

  // Calculate longest streak
  let longestStreak = 0;
  let currentStreak = 0;
  let totalScore = 0;
  let scoreCount = 0;

  for (const progress of allProgress) {
    if (progress.streaks.current > currentStreak) {
      currentStreak = progress.streaks.current;
    }
    if (progress.streaks.longest > longestStreak) {
      longestStreak = progress.streaks.longest;
    }
    if (progress.averageScore !== null) {
      totalScore += progress.averageScore;
      scoreCount++;
    }
  }

  return {
    totalInterviews,
    totalQuestions,
    totalTime,
    currentStreak,
    longestStreak,
    averageScore: scoreCount > 0 ? Math.round(totalScore / scoreCount) : 0,
  };
};

// Static methods interface
interface IProgressModel extends Model<IProgress> {
  getTodayProgress(clerkId: string): Promise<IProgress | null>;
  getDateRangeProgress(clerkId: string, startDate: Date, endDate: Date): Promise<IProgress[]>;
  updateTodayProgress(clerkId: string, updates: Partial<IProgress>): Promise<IProgress>;
  updateStreak(clerkId: string): Promise<IProgress>;
  getUserStats(clerkId: string): Promise<{
    totalInterviews: number;
    totalQuestions: number;
    totalTime: number;
    currentStreak: number;
    longestStreak: number;
    averageScore: number;
  }>;
}

const Progress = (mongoose.models.Progress ||
  mongoose.model<IProgress, IProgressModel>(
    'Progress',
    ProgressSchema
  )) as unknown as IProgressModel;

export default Progress;
