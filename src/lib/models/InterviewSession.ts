import mongoose, { Schema, Document, Model } from 'mongoose';

// Message interface
export interface IMessage {
  role: 'user' | 'ai' | 'system';
  content: string;
  audioUrl?: string;
  timestamp: Date;
  transcriptionConfidence?: number;
  durationMs?: number;
}

// Improvement suggestion interface
export interface IImprovement {
  category: string;
  description: string;
  suggestedResponse: string;
  explanation: string;
}

// Suggested resource interface
export interface IResource {
  type: 'article' | 'video' | 'practice';
  title: string;
  url: string;
}

// Feedback interface
export interface IFeedback {
  overallScore: number;
  contentScore: number;
  languageScore: number;
  confidenceScore: number;
  strengths: string[];
  improvements: IImprovement[];
  suggestedResources: IResource[];
}

// Interview session document interface
export interface IInterviewSession extends Document {
  clerkId: string;
  sessionType: 'behavioral' | 'technical' | 'general' | 'mock';
  status: 'in_progress' | 'completed' | 'aborted';
  difficultyLevel: 'easy' | 'medium' | 'hard' | 'adaptive';
  languageMode: 'en' | 'bn' | 'mixed';
  targetRole: string | null;
  targetCompany: string | null;
  messages: IMessage[];
  feedback: IFeedback | null;
  duration: number | null;
  questionsCompleted: number | null;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// Static methods interface
// Using any return type to avoid conflicts with Mongoose's Query types
// Static methods interface
interface IInterviewSessionModel extends Model<IInterviewSession> {
  createSession(data: Partial<IInterviewSession>): Promise<IInterviewSession>;
  findByClerkId(
    clerkId: string,
    options?: { limit?: number; skip?: number; status?: string }
  ): Promise<IInterviewSession[]>;
  findSessionById(sessionId: string): Promise<IInterviewSession | null>;
  addMessage(sessionId: string, message: IMessage): Promise<IInterviewSession | null>;
  completeSession(
    sessionId: string,
    feedback: IFeedback,
    duration?: number
  ): Promise<IInterviewSession | null>;
  getUserStats(clerkId: string): Promise<{
    totalSessions: number;
    completedSessions: number;
    averageScore: number;
    totalQuestions: number;
    totalTime: number;
  }>;
}

// Message schema definition
const MessageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'ai', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    audioUrl: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    transcriptionConfidence: {
      type: Number,
      min: 0,
      max: 1,
    },
    durationMs: Number,
  },
  { _id: false }
);

// Improvement schema definition
const ImprovementSchema = new Schema<IImprovement>(
  {
    category: String,
    description: String,
    suggestedResponse: String,
    explanation: String,
  },
  { _id: false }
);

// Resource schema definition
const ResourceSchema = new Schema<IResource>(
  {
    type: {
      type: String,
      enum: ['article', 'video', 'practice'],
    },
    title: String,
    url: String,
  },
  { _id: false }
);

// Feedback schema definition
const FeedbackSchema = new Schema<IFeedback>(
  {
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    contentScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    languageScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    confidenceScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    strengths: [String],
    improvements: [ImprovementSchema],
    suggestedResources: [ResourceSchema],
  },
  { _id: false }
);

// Interview session schema definition
const InterviewSessionSchema = new Schema<IInterviewSession>(
  {
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    sessionType: {
      type: String,
      enum: ['behavioral', 'technical', 'general', 'mock'],
      required: true,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'aborted'],
      default: 'in_progress',
    },
    difficultyLevel: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'adaptive'],
      default: 'adaptive',
    },
    languageMode: {
      type: String,
      enum: ['en', 'bn', 'mixed'],
      default: 'en',
    },
    targetRole: String,
    targetCompany: String,
    messages: [MessageSchema],
    feedback: FeedbackSchema,
    duration: {
      type: Number,
      default: null,
    },
    questionsCompleted: {
      type: Number,
      default: null,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: Date,
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

// Indexes for efficient queries
InterviewSessionSchema.index({ clerkId: 1, createdAt: -1 });
InterviewSessionSchema.index({ clerkId: 1, status: 1 });
InterviewSessionSchema.index({ sessionType: 1 });

// Pre-save middleware
InterviewSessionSchema.pre('save', function (next) {
  this.updatedAt = new Date();

  // Calculate duration if completed
  if (this.status === 'completed' && !this.duration && this.startedAt) {
    this.duration = Math.floor((this.completedAt!.getTime() - this.startedAt.getTime()) / 1000);
  }

  next();
});

// Static methods for common operations
InterviewSessionSchema.statics.createSession = async function (
  data: Partial<IInterviewSession>
): Promise<IInterviewSession> {
  const session = new this({
    ...data,
    messages: data.messages || [],
    startedAt: new Date(),
  });
  return session.save();
};

InterviewSessionSchema.statics.findByClerkId = async function (
  clerkId: string,
  options: { limit?: number; skip?: number; status?: string } = {}
): Promise<IInterviewSession[]> {
  const query: Record<string, unknown> = { clerkId };

  if (options.status) {
    query.status = options.status;
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 20);
};

InterviewSessionSchema.statics.findSessionById = async function (
  sessionId: string
): Promise<IInterviewSession | null> {
  return this.findOne({ _id: sessionId });
};

InterviewSessionSchema.statics.addMessage = async function (
  sessionId: string,
  message: IMessage
): Promise<IInterviewSession | null> {
  return this.findByIdAndUpdate(sessionId, { $push: { messages: message } }, { new: true });
};

InterviewSessionSchema.statics.completeSession = async function (
  sessionId: string,
  feedback: IFeedback,
  duration?: number
): Promise<IInterviewSession | null> {
  const update: Partial<IInterviewSession> = {
    feedback,
    status: 'completed',
    completedAt: new Date(),
  };

  if (duration !== undefined) {
    update.duration = duration;
  }

  return this.findByIdAndUpdate(
    sessionId,
    {
      $set: update,
    },
    { new: true }
  );
};

InterviewSessionSchema.statics.getUserStats = async function (clerkId: string): Promise<{
  totalSessions: number;
  completedSessions: number;
  averageScore: number;
  totalQuestions: number;
  totalTime: number;
}> {
  const sessions = await this.find({ clerkId, status: 'completed' });

  const totalSessions = sessions.length;
  const averageScore =
    sessions.length > 0
      ? Math.round(
          sessions.reduce(
            (sum: number, s: IInterviewSession) => sum + (s.feedback?.overallScore || 0),
            0
          ) / sessions.length
        )
      : 0;
  const totalQuestions = sessions.reduce(
    (sum: number, s: IInterviewSession) => sum + (s.questionsCompleted || 0),
    0
  );
  const totalTime = sessions.reduce(
    (sum: number, s: IInterviewSession) => sum + (s.duration || 0),
    0
  );

  return {
    totalSessions,
    completedSessions: totalSessions,
    averageScore,
    totalQuestions,
    totalTime,
  };
};

const _InterviewSession =
  mongoose.models.InterviewSession ||
  mongoose.model<IInterviewSession, IInterviewSessionModel>(
    'InterviewSession',
    InterviewSessionSchema
  );

const InterviewSession = _InterviewSession as unknown as IInterviewSessionModel;

export default InterviewSession;
