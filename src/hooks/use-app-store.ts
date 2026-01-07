import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  SessionType,
  DifficultyLevel,
  LanguageMode,
  ExperienceLevel,
} from '@/types';

interface UserPreferences {
  preferredLanguage: LanguageMode;
  targetRole: string;
  experienceLevel: ExperienceLevel | null;
  targetIndustry: string;
  showTranscripts: boolean;
  autoPlayAudio: boolean;
  speechRate: number;
  speechPitch: number;
}

interface InterviewSessionState {
  currentSessionId: string | null;
  messages: Array<{
    role: 'user' | 'ai' | 'system';
    content: string;
    timestamp: Date;
  }>;
  isProcessing: boolean;
  sessionConfig: {
    sessionType: SessionType;
    difficultyLevel: DifficultyLevel;
    languageMode: LanguageMode;
    targetRole: string;
    targetCompany?: string;
  } | null;
}

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'bn';
}

interface AppState {
  // User preferences
  preferences: UserPreferences;
  
  // Interview session state
  interviewSession: InterviewSessionState;
  
  // UI state
  ui: UIState;
  
  // Actions for preferences
  setPreferences: (preferences: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  
  // Actions for interview session
  setInterviewSession: (session: Partial<InterviewSessionState>) => void;
  addMessage: (message: InterviewSessionState['messages'][0]) => void;
  clearSession: () => void;
  setProcessing: (processing: boolean) => void;
  
  // Actions for UI
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: UIState['theme']) => void;
  setLanguage: (language: UIState['language']) => void;
}

const defaultPreferences: UserPreferences = {
  preferredLanguage: 'en',
  targetRole: '',
  experienceLevel: null,
  targetIndustry: '',
  showTranscripts: true,
  autoPlayAudio: true,
  speechRate: 1,
  speechPitch: 1,
};

const defaultInterviewSession: InterviewSessionState = {
  currentSessionId: null,
  messages: [],
  isProcessing: false,
  sessionConfig: null,
};

const defaultUI: UIState = {
  sidebarOpen: true,
  theme: 'dark',
  language: 'en',
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      preferences: defaultPreferences,
      interviewSession: defaultInterviewSession,
      ui: defaultUI,

      // Preference actions
      setPreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),
      resetPreferences: () =>
        set({ preferences: defaultPreferences }),

      // Interview session actions
      setInterviewSession: (updates) =>
        set((state) => ({
          interviewSession: { ...state.interviewSession, ...updates },
        })),
      addMessage: (message) =>
        set((state) => ({
          interviewSession: {
            ...state.interviewSession,
            messages: [...state.interviewSession.messages, message],
          },
        })),
      clearSession: () =>
        set({ interviewSession: defaultInterviewSession }),
      setProcessing: (processing) =>
        set((state) => ({
          interviewSession: { ...state.interviewSession, isProcessing: processing },
        })),

      // UI actions
      setSidebarOpen: (open) =>
        set((state) => ({ ui: { ...state.ui, sidebarOpen: open } })),
      setTheme: (theme) =>
        set((state) => ({ ui: { ...state.ui, theme } })),
      setLanguage: (language) =>
        set((state) => ({ ui: { ...state.ui, language } })),
    }),
    {
      name: 'interprep-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        preferences: state.preferences,
        ui: state.ui,
      }),
    }
  )
);

export default useAppStore;
