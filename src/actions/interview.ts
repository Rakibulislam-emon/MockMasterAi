'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import InterviewSession, {
  type IFeedback,
  type IInterviewSession,
} from '@/lib/models/InterviewSession';
import type { SessionConfigForm, ApiResponse } from '@/types';
import { aiGateway } from '@/lib/ai';

interface CreateSessionResult {
  success: boolean;
  sessionId?: string;
  error?: string;
  initialQuestion?: string;
}

/**
 * Create a new interview session
 */
export async function createInterviewSession(
  config: SessionConfigForm
): Promise<CreateSessionResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    // Get user information for personalization
    await User.findByClerkId(userId);

    const session = await InterviewSession.createSession({
      clerkId: userId,
      sessionType: config.sessionType,
      difficultyLevel: config.difficultyLevel,
      languageMode: config.languageMode,
      targetRole: config.targetRole,
      targetCompany: config.targetCompany,
      status: 'in_progress',
      messages: [
        {
          role: 'system',
          content: `Interview session started. Role: ${config.targetRole}. Type: ${config.sessionType}. Difficulty: ${config.difficultyLevel}`,
          timestamp: new Date(),
        },
      ],
    });

    // Generate initial question (simplified - in production, use AI)
    const initialQuestion = generateInitialQuestion(config.sessionType, config.targetRole);

    // Add initial question to session
    await InterviewSession.addMessage(session._id.toString(), {
      role: 'ai',
      content: initialQuestion,
      timestamp: new Date(),
    });

    revalidatePath('/dashboard');
    revalidatePath('/history');

    return {
      success: true,
      sessionId: session._id.toString(),
      initialQuestion,
    };
  } catch (error) {
    console.error('Error creating interview session:', error);
    return { success: false, error: 'Failed to create session' };
  }
}

/**
 * Get a specific interview session
 */
export async function getInterviewSession(
  sessionId: string
): Promise<ApiResponse<IInterviewSession>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    if (session.clerkId !== userId) {
      return { success: false, error: 'Unauthorized access' };
    }

    return { success: true, data: JSON.parse(JSON.stringify(session)) };
  } catch (error) {
    console.error('Error fetching session:', error);
    return { success: false, error: 'Failed to fetch session' };
  }
}

/**
 * Send a message in an active interview session
 */
export async function sendInterviewMessage(
  sessionId: string,
  message: string
): Promise<ApiResponse<{ response: string; isComplete: boolean }>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    // Verify session belongs to user
    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    if (session.clerkId !== userId) {
      return { success: false, error: 'Unauthorized access' };
    }

    if (session.status !== 'in_progress') {
      return { success: false, error: 'Session is not active' };
    }

    // Add user message
    await InterviewSession.addMessage(sessionId, {
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // In production, this would call the AI gateway
    // For now, we'll generate a simple response
    const aiResponse = await generateAIResponse(session.messages, message, session.languageMode);

    // Add AI response
    await InterviewSession.addMessage(sessionId, {
      role: 'ai',
      content: aiResponse,
      timestamp: new Date(),
    });

    return {
      success: true,
      data: {
        response: aiResponse,
        isComplete: false, // In production, determine based on session criteria
      },
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return { success: false, error: 'Failed to send message' };
  }
}

/**
 * Complete an interview session and generate feedback
 */
export async function completeInterviewSession(
  sessionId: string
): Promise<ApiResponse<{ feedback: IFeedback }>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    if (session.clerkId !== userId) {
      return { success: false, error: 'Unauthorized access' };
    }

    // Calculate session duration
    const completedAt = new Date();
    const duration = Math.floor((completedAt.getTime() - session.startedAt.getTime()) / 1000);

    // Generate feedback (simplified - in production, use AI)
    const feedback = await generateFeedback(session.messages, session.targetRole);

    await InterviewSession.completeSession(sessionId, feedback, duration);

    revalidatePath('/dashboard');
    revalidatePath('/history');

    return { success: true, data: { feedback } };
  } catch (error) {
    console.error('Error completing session:', error);
    return { success: false, error: 'Failed to complete session' };
  }
}

/**
 * Abort an interview session
 */
export async function abortInterviewSession(sessionId: string): Promise<ApiResponse<null>> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    if (session.clerkId !== userId) {
      return { success: false, error: 'Unauthorized access' };
    }

    await InterviewSession.findByIdAndUpdate(sessionId, {
      $set: { status: 'aborted', completedAt: new Date() },
    });

    revalidatePath('/dashboard');
    revalidatePath('/history');

    return { success: true, data: null };
  } catch (error) {
    console.error('Error aborting session:', error);
    return { success: false, error: 'Failed to abort session' };
  }
}

/**
 * Get user's interview history
 */
export async function getInterviewHistory(options: {
  limit?: number;
  skip?: number;
  status?: string;
}): Promise<
  ApiResponse<
    Array<{
      id: string;
      sessionType: string;
      status: string;
      targetRole: string | null;
      startedAt: Date;
      completedAt: Date | null;
      duration: number | null;
      feedback: IFeedback | null;
    }>
  >
> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();

    const sessions = await InterviewSession.findByClerkId(userId, {
      limit: options.limit || 20,
      skip: options.skip || 0,
      status: options.status,
    });

    const formattedSessions = sessions.map(s => ({
      id: s._id.toString(),
      sessionType: s.sessionType,
      status: s.status,
      targetRole: s.targetRole,
      startedAt: s.startedAt,
      completedAt: s.completedAt,
      duration: s.duration,
      feedback: s.feedback,
    }));

    return { success: true, data: formattedSessions };
  } catch (error) {
    console.error('Error fetching history:', error);
    return { success: false, error: 'Failed to fetch history' };
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
    const sessions = await InterviewSession.find({
      clerkId: userId,
      status: 'completed',
    });

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

// Helper functions (simplified implementations)

function generateInitialQuestion(sessionType: string, targetRole: string): string {
  // Clean up the target role for display
  const displayRole = targetRole.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const introductions: Record<string, string[]> = {
    behavioral: [
      `Hello! Thank you for joining me today. I'm excited to learn more about you and your experiences. This will be a behavioral interview where we'll discuss how you've handled various situations in the past. Let's start with something to help me understand your background - tell me about a challenging project you worked on.`,
      `Hi there! Welcome to your interview. I'm here to understand more about how you approach problems and work with others. Let's begin - can you describe a situation where you had to work with a difficult team member?`,
      `Hello and welcome! Thank you for taking the time to speak with me today. In this session, we'll explore your past experiences and how you've navigated different challenges. To start, tell me about a time you failed and what you learned from it.`,
    ],
    technical: [
      `Hello! Welcome to your technical interview for the ${displayRole} position. I'll be asking you some questions to understand your technical knowledge and problem-solving abilities. Let's start by having you explain the key principles and technologies you're most experienced with in this field.`,
      `Hi, great to meet you! Today we'll dive into the technical aspects of the ${displayRole} role. I'd like to start by understanding your technical background - can you describe your experience with the core technologies relevant to this position?`,
      `Hello and welcome! I'm looking forward to our technical discussion today. As we explore your qualifications for the ${displayRole} role, let's begin - how do you stay updated with the latest developments in your field?`,
    ],
    general: [
      `Hello! Thank you for coming in today. This is a general interview where I'd like to get to know you better and understand what drives you professionally. Let's start with a common but important question - why are you interested in this position?`,
      `Hi there! Welcome to your interview. I'm excited to learn more about you and your career aspirations. To begin, tell me about yourself - what are your main strengths and areas where you're still growing?`,
      `Hello and welcome! Thanks for joining me today. We'll have a friendly conversation about your goals and fit for this role. Where do you see yourself in five years?`,
    ],
    mock: [
      `Hello! Welcome to your mock interview for the ${displayRole} position. I'll be conducting this session just like a real interview, so feel free to treat it as the real thing. Let's start with a classic opener - please give me a brief introduction about yourself and your background.`,
      `Hi there! Thank you for joining this mock interview session. I'm your interviewer today, and I'll be simulating a realistic interview experience for the ${displayRole} role. Let's begin - can you walk me through your resume and highlight your most relevant experiences?`,
    ],
  };

  const typeIntros = introductions[sessionType] || introductions.general;
  return typeIntros[Math.floor(Math.random() * typeIntros.length)];
}

async function generateAIResponse(
  messages: Array<{ role: string; content: string }>,
  userMessage: string,
  languageMode: string
): Promise<string> {
  try {
    const prompt = `
      You are an expert ${languageMode === 'bn' ? 'Bengali' : 'English'} speaking interviewer.
      Previous messages: ${JSON.stringify(messages.slice(-5))}
      User's latest response: "${userMessage}"
      
      Respond in ${languageMode === 'bn' ? 'Bengali' : 'English'}.
      Acknowledge their answer briefly and ask the next relevant interview question.
      Keep it professional and conversational.
    `;

    return await aiGateway.generateContent(prompt, { preferFast: true });
  } catch (error) {
    console.error('AI Response generation failed:', error);
    return 'Thank you for that answer. Can you tell me more about your experience in this field?';
  }
}

async function generateFeedback(
  messages: Array<{ role: string; content: string }>,
  targetRole: string | null
): Promise<IFeedback> {
  try {
    // Filter out system messages and count actual exchanges
    const userMessages = messages.filter(m => m.role === 'user');
    const messageCount = userMessages.length;

    const prompt = `
      You are a strict, professional interview evaluator. Analyze this interview session for a ${targetRole || 'general'} role.
      
      IMPORTANT SCORING GUIDELINES - BE STRICT:
      - 90-100: Exceptional - Only for candidates who gave detailed, specific examples with clear context, actions, and results (STAR method). Answers must be comprehensive and demonstrate deep expertise.
      - 70-89: Good - Candidate gave solid answers with some specific examples. Showed competence but may have lacked depth in some areas.
      - 50-69: Average - Candidate gave acceptable answers but were too brief, generic, or lacked specific examples. Needs improvement.
      - 30-49: Below Average - Answers were vague, irrelevant, too short, or showed lack of preparation. Did not properly address questions.
      - 0-29: Poor - Candidate gave one-word answers, off-topic responses, or inappropriate replies. Did not engage properly with the interview.
      
      EVALUATION CRITERIA:
      1. Content Quality (contentScore): Did they provide specific examples? Were answers relevant to the question? Did they use the STAR method where appropriate?
      2. Communication Style (confidenceScore): Were answers well-structured? Did they speak professionally? Was there clarity in expression?
      3. Language Proficiency (languageScore): Grammar, vocabulary, articulation. Were sentences complete and professional?
      
      Red flags that should SIGNIFICANTLY lower scores:
      - One-word or very short answers (e.g., "yes", "no", "okay", "good")
      - Generic answers without specific examples
      - Not answering the actual question asked
      - Unprofessional language or tone
      - Lack of detail or context
      
      Interview Messages: ${JSON.stringify(messages)}
      Number of user responses: ${messageCount}
      
      If the user gave very few responses or very short answers, scores should be LOW (under 40).
      
      Provide HONEST, STRICT feedback in JSON format:
      {
        "overallScore": number (0-100, be strict!),
        "contentScore": number (0-100),
        "languageScore": number (0-100),
        "confidenceScore": number (0-100),
        "strengths": ["list up to 3 genuine strengths, or fewer if none evident"],
        "improvements": [
          {
            "category": "category name",
            "description": "specific issue observed",
            "suggestedResponse": "example of a better response",
            "explanation": "why this would be better"
          }
        ],
        "suggestedResources": [
          {
            "type": "article|video",
            "title": "resource title",
            "url": "resource url"
          }
        ]
      }
      
      Be honest and constructive. Do not inflate scores to make the candidate feel good - they need accurate feedback to improve.
    `;

    const result = await aiGateway.generateContent(prompt, { preferFast: false });

    // Try to extract JSON from the response - handle various formats
    let cleanedResult = result.trim();

    // Remove markdown code fences if present
    cleanedResult = cleanedResult.replace(/```json\s*/gi, '').replace(/```\s*/g, '');

    // Try to find JSON object in the response
    const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedResult = jsonMatch[0];
    }

    const parsed = JSON.parse(cleanedResult);
    return parsed;
  } catch (error) {
    console.error('Feedback generation failed:', error);
    return {
      overallScore: 30,
      contentScore: 30,
      languageScore: 30,
      confidenceScore: 30,
      strengths: ['Attempted the interview'],
      improvements: [
        {
          category: 'Response Quality',
          description: 'Focus on providing detailed, specific answers with examples',
          suggestedResponse: 'Use the STAR method: Situation, Task, Action, Result',
          explanation: 'Interviewers want to see concrete evidence of your skills and experience',
        },
      ],
      suggestedResources: [],
    };
  }
}
