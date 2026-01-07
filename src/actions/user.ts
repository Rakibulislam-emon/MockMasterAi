'use server';

import { auth, currentUser } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import InterviewSession from '@/lib/models/InterviewSession';
import type { UserPreferencesForm, ApiResponse, ExperienceLevel, LanguageMode } from '@/types';

/**
 * Get current user preferences - works without webhook
 * Returns default preferences if user doesn't exist in MongoDB yet
 */
export async function getUserPreferences(): Promise<ApiResponse<UserPreferencesForm>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const user = await User.findByClerkId(userId);

    // If user doesn't exist, return defaults (will be created on first update)
    if (!user) {
      return {
        success: true,
        data: {
          preferredLanguage: 'en',
          targetRole: '',
          experienceLevel: null,
          timezone: 'Asia/Dhaka',
        },
      };
    }

    return {
      success: true,
      data: {
        preferredLanguage: user.preferredLanguage,
        targetRole: user.targetRole || '',
        experienceLevel: user.experienceLevel,
        timezone: user.timezone,
      },
    };
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return { success: false, error: 'Failed to fetch preferences' };
  }
}

/**
 * Update user preferences - creates user if doesn't exist (no webhook needed)
 */
export async function updateUserPreferences(
  updates: Partial<UserPreferencesForm>
): Promise<ApiResponse<UserPreferencesForm>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get user info from Clerk
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || '';
    const name = `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || null;

    await connectDB();

    // Map form fields to model fields
    const modelUpdates: Record<string, unknown> = {};

    if (updates.preferredLanguage) {
      modelUpdates.preferredLanguage = updates.preferredLanguage;
    }
    if (updates.targetRole) {
      modelUpdates.targetRole = updates.targetRole;
    }
    if (updates.experienceLevel) {
      modelUpdates.experienceLevel = updates.experienceLevel;
    }
    if (updates.timezone) {
      modelUpdates.timezone = updates.timezone;
    }

    // Use findOneAndUpdate with upsert: true to create user if doesn't exist
    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          ...modelUpdates,
          email,
          name,
          lastLoginAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    revalidatePath('/settings');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        preferredLanguage: updatedUser.preferredLanguage,
        targetRole: updatedUser.targetRole || '',
        experienceLevel: updatedUser.experienceLevel,
        timezone: updatedUser.timezone,
      },
    };
  } catch (error) {
    console.error('Error updating preferences:', error);
    return { success: false, error: 'Failed to update preferences' };
  }
}

/**
 * Complete onboarding - creates user if doesn't exist
 */
export async function completeOnboarding(data: {
  targetRole: string;
  experienceLevel: ExperienceLevel;
  preferredLanguage: LanguageMode;
}): Promise<ApiResponse<null>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get user info from Clerk
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || '';
    const name = `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || null;

    await connectDB();

    // Upsert user - create if doesn't exist, update if exists
    await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          targetRole: data.targetRole,
          experienceLevel: data.experienceLevel,
          preferredLanguage: data.preferredLanguage,
          onboardingCompleted: true,
          email,
          name,
          lastLoginAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
          timezone: 'Asia/Dhaka',
        },
      },
      { upsert: true }
    );

    revalidatePath('/dashboard');
    revalidatePath('/onboarding');

    return { success: true, data: null };
  } catch (error) {
    console.error('Error completing onboarding:', error);
    return { success: false, error: 'Failed to complete onboarding' };
  }
}

/**
 * Get user profile information - uses Clerk data if MongoDB user doesn't exist
 */
export async function getUserProfile(): Promise<
  ApiResponse<{
    name: string | null;
    email: string;
    onboardingCompleted: boolean;
    createdAt: Date;
    lastLoginAt: Date;
  }>
> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    // Get user info from Clerk (always available)
    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || '';
    const name = `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || null;

    await connectDB();

    const user = await User.findByClerkId(userId);

    if (!user) {
      // Return Clerk data if MongoDB user doesn't exist
      return {
        success: true,
        data: {
          name,
          email,
          onboardingCompleted: false,
          createdAt: new Date(),
          lastLoginAt: new Date(),
        },
      };
    }

    return {
      success: true,
      data: {
        name: user.name,
        email: user.email,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
      },
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return { success: false, error: 'Failed to fetch profile' };
  }
}

/**
 * Get user statistics - works without webhook
 */
export async function getUserStats(): Promise<
  ApiResponse<{
    totalInterviews: number;
    totalQuestions: number;
    totalTime: number;
    currentStreak: number;
    longestStreak: number;
    averageScore: number;
  }>
> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    // Get stats from completed sessions
    const sessions = await InterviewSession.find(
      {
        clerkId: userId,
        status: 'completed',
      },
      'questionsCompleted duration feedback.overallScore'
    );

    const totalInterviews = sessions.length;
    const totalQuestions = sessions.reduce(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (sum: number, s: any) => sum + (s.questionsCompleted || 0),
      0
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalTime = sessions.reduce((sum: number, s: any) => sum + (s.duration || 0), 0);

    const averageScore =
      sessions.length > 0
        ? Math.round(
            sessions.reduce(
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (sum: number, s: any) => sum + (s.feedback?.overallScore || 0),
              0
            ) / sessions.length
          )
        : 0;

    return {
      success: true,
      data: {
        totalInterviews,
        totalQuestions,
        totalTime,
        currentStreak: 0, // Can be tracked separately if needed
        longestStreak: 0,
        averageScore,
      },
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return { success: false, error: 'Failed to fetch stats' };
  }
}

/**
 * Ensure user exists in database - call this before operations that need user data
 * This is optional - user will be created on first update anyway
 */
export async function ensureUserExists(): Promise<void> {
  try {
    const { userId } = await auth();

    if (!userId) return;

    const clerkUser = await currentUser();
    const email = clerkUser?.emailAddresses[0]?.emailAddress || '';
    const name = `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim() || null;

    await connectDB();

    await User.findOneAndUpdate(
      { clerkId: userId },
      {
        $set: {
          email,
          name,
          lastLoginAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
          preferredLanguage: 'en',
          timezone: 'Asia/Dhaka',
        },
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    // Don't throw - this is a best-effort operation
  }
}
