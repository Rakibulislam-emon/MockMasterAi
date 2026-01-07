// Core domain types for InterPrep AI

// User types
export interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  preferredLanguage: 'en' | 'bn' | 'both';
  targetRole: string | null;
  targetIndustry: string | null;
  experienceLevel: ExperienceLevel | null;
  timezone: string;
  onboardingCompleted: boolean;
  createdAt: Date;
  lastLoginAt: Date;
}

export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';

// Session types
export type SessionType = 'behavioral' | 'technical' | 'general' | 'mock';
export type SessionStatus = 'in_progress' | 'completed' | 'aborted';
export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'adaptive';
export type LanguageMode = 'en' | 'bn' | 'mixed';

export interface Message {
  id: string;
  role: 'user' | 'ai' | 'system';
  content: string;
  audioUrl?: string;
  timestamp: Date;
  transcriptionConfidence?: number;
  durationMs?: number;
}

export interface InterviewSession {
  id: string;
  clerkId: string;
  sessionType: SessionType;
  status: SessionStatus;
  difficultyLevel: DifficultyLevel;
  languageMode: LanguageMode;
  targetRole: string | null;
  targetCompany: string | null;
  messages: Message[];
  feedback: Feedback | null;
  duration: number | null;
  questionsCompleted: number | null;
  startedAt: Date;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  overallScore: number;
  contentScore: number;
  languageScore: number;
  confidenceScore: number;
  strengths: string[];
  improvements: Improvement[];
  suggestedResources: Resource[];
}

export interface Improvement {
  category: string;
  description: string;
  suggestedResponse: string;
  explanation: string;
}

export interface Resource {
  type: 'article' | 'video' | 'practice';
  title: string;
  url: string;
}

// Resume types
export interface Resume {
  id: string;
  clerkId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  extractedText: string;
  parsedSections: ParsedSections;
  analysis: ResumeAnalysis | null;
  isDefault: boolean;
  createdAt: Date;
  analyzedAt: Date | null;
}

export interface ParsedSections {
  summary: string | null;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
  certifications: string[];
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  description: string;
}

export interface EducationItem {
  institution: string;
  degree: string;
  year: string;
}

export interface ResumeAnalysis {
  overallScore: number | null;
  atsScore: number | null;
  missingKeywords: string[];
  improvementSuggestions: ImprovementSuggestion[];
}

export interface ImprovementSuggestion {
  section: string;
  suggestion: string;
  importance: 'high' | 'medium' | 'low';
}

// Question types
export interface Question {
  id: string;
  category: string;
  subcategory: string | null;
  difficulty: number;
  questionEn: string;
  questionBn: string | null;
  modelAnswerEn: string | null;
  modelAnswerBn: string | null;
  evaluationCriteria: EvaluationCriterion[];
  tags: string[];
  usageCount: number;
  averageRating: number;
  createdBy: 'admin' | 'ai-generated';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EvaluationCriterion {
  criterion: string;
  description: string;
  keywords: string[];
  maxPoints: number;
}

// Progress types
export interface Progress {
  id: string;
  clerkId: string;
  date: Date;
  interviewsCompleted: number;
  totalQuestionsAnswered: number;
  averageScore: number | null;
  timeSpentMinutes: number;
  focusAreas: string[];
  achievements: Achievement[];
  streaks: StreakInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface Achievement {
  achievementId: string;
  earnedAt: Date;
}

export interface StreakInfo {
  current: number;
  longest: number;
  lastActivityDate: Date | null;
}

// Stats types
export interface UserStats {
  totalInterviews: number;
  totalQuestions: number;
  totalTime: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Form types
export interface SessionConfigForm {
  sessionType: SessionType;
  difficultyLevel: DifficultyLevel;
  languageMode: LanguageMode;
  targetRole: string;
  targetCompany?: string;
}

export interface UserPreferencesForm {
  preferredLanguage: 'en' | 'bn' | 'both';
  targetRole: string;
  experienceLevel?: ExperienceLevel | null;
  timezone: string;
}

// Voice types
export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  confidence: number;
  error: string | null;
  supported: boolean;
}

// Achievement types
export interface AchievementDefinition {
  id: string;
  name: string;
  description: string;
  icon: string;
  criteria: (stats: UserStats) => boolean;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: 'first_interview',
    name: 'First Steps',
    description: 'Complete your first interview',
    icon: '🎯',
    criteria: (stats) => stats.totalInterviews >= 1,
  },
  {
    id: 'five_interviews',
    name: 'Getting Started',
    description: 'Complete 5 interviews',
    icon: '📝',
    criteria: (stats) => stats.totalInterviews >= 5,
  },
  {
    id: 'twenty_interviews',
    name: 'Dedicated',
    description: 'Complete 20 interviews',
    icon: '💪',
    criteria: (stats) => stats.totalInterviews >= 20,
  },
  {
    id: 'streak_week',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    criteria: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'streak_month',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '⚡',
    criteria: (stats) => stats.currentStreak >= 30,
  },
  {
    id: 'high_score',
    name: 'Excellence',
    description: 'Score above 80 in an interview',
    icon: '⭐',
    criteria: (stats) => stats.averageScore >= 80,
  },
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    description: 'Score above 90 in an interview',
    icon: '🏆',
    criteria: (stats) => stats.averageScore >= 90,
  },
];

// Job role categories
export const JOB_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'Mobile Developer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'Product Manager',
  'UX Designer',
  'QA Engineer',
  'Security Engineer',
  'Cloud Engineer',
  'Other',
];

export const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'E-commerce',
  'Education',
  'Media & Entertainment',
  'Manufacturing',
  'Consulting',
  'Government',
  'Other',
];
