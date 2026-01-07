'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, FileText, Clock, Users, Sparkles, ArrowRight, Play, Zap, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createInterviewSession } from '@/actions/interview';
import { getUserPreferences } from '@/actions/user';
import { motion } from 'framer-motion';

const sessionTypes = [
  {
    id: 'behavioral',
    title: 'Behavioral',
    icon: Users,
    desc: 'Practice soft skills and past experiences',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'technical',
    title: 'Technical',
    icon: FileText,
    desc: 'Test your technical knowledge',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'general',
    title: 'General',
    icon: Sparkles,
    desc: 'Mixed questions for any interview',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'mock',
    title: 'Full Mock',
    icon: Mic,
    desc: 'Complete interview simulation',
    color: 'from-green-500 to-emerald-500',
  },
];

const difficulties = [
  { id: 'easy', label: 'Easy - Good for beginners' },
  { id: 'medium', label: 'Medium - Standard difficulty' },
  { id: 'hard', label: 'Hard - Challenging questions' },
  { id: 'adaptive', label: 'Adaptive - Adjusts to your level' },
];

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

export default function PracticePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    sessionType: 'behavioral',
    difficulty: 'medium',
    targetRole: 'software-engineer',
  });

  // Load user preferences from settings
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const result = await getUserPreferences();
        if (result.success && result.data?.targetRole) {
          setConfig(prev => ({
            ...prev,
            targetRole: result.data!.targetRole || prev.targetRole,
          }));
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    };
    loadPreferences();
  }, []);

  const handleStartInterview = async () => {
    setIsLoading(true);

    try {
      const result = await createInterviewSession({
        sessionType: config.sessionType as 'behavioral' | 'technical' | 'general' | 'mock',
        difficultyLevel: config.difficulty as 'easy' | 'medium' | 'hard' | 'adaptive',
        languageMode: 'en',
        targetRole: config.targetRole,
        targetCompany: '',
      });

      if (result.success && result.sessionId) {
        router.push(`/practice/${result.sessionId}`);
      } else {
        console.error('Failed to create session:', result.error);
      }
    } catch (error) {
      console.error('Error starting interview:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Gradient */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />

      {/* Header */}
      <header className="border-b border-white/10 bg-background/60 p-4 backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
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
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-12">
          {/* Page Header */}
          <motion.div variants={item} className="text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              Start Interview <span className="text-primary">Practice</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Configure your ideal interview session and get instant feedback from AI.
            </p>
          </motion.div>

          {/* Session Type Selection */}
          <motion.div variants={item} className="space-y-4">
            <Label className="text-lg font-semibold">Select Interview Type</Label>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {sessionTypes.map(type => (
                <motion.div key={type.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Card
                    className={`relative cursor-pointer overflow-hidden border-2 transition-all ${
                      config.sessionType === type.id
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                        : 'border-white/5 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10'
                    }`}
                    onClick={() => setConfig({ ...config, sessionType: type.id })}
                  >
                    <CardHeader className="pb-2">
                      <div
                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${type.color} shadow-lg`}
                      >
                        <type.icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-base">{type.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-muted-foreground">{type.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Configuration Options */}
          <motion.div variants={item} className="grid gap-8 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="difficulty" className="text-base">
                Difficulty Level
              </Label>
              <Select
                value={config.difficulty}
                onValueChange={value => setConfig({ ...config, difficulty: value })}
              >
                <SelectTrigger
                  id="difficulty"
                  className="h-12 border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map(diff => (
                    <SelectItem key={diff.id} value={diff.id}>
                      {diff.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-base">
                Target Role
              </Label>
              <Select
                value={config.targetRole}
                onValueChange={value => setConfig({ ...config, targetRole: value })}
              >
                <SelectTrigger
                  id="role"
                  className="h-12 border-white/10 bg-white/5 backdrop-blur-sm"
                >
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="software-engineer">Software Engineer</SelectItem>
                  <SelectItem value="frontend-developer">Frontend Developer</SelectItem>
                  <SelectItem value="backend-developer">Backend Developer</SelectItem>
                  <SelectItem value="full-stack-developer">Full Stack Developer</SelectItem>
                  <SelectItem value="data-scientist">Data Scientist</SelectItem>
                  <SelectItem value="product-manager">Product Manager</SelectItem>
                  <SelectItem value="ux-designer">UX Designer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          {/* Tips */}
          <motion.div variants={item}>
            <Card className="border-white/10 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Brain className="h-5 w-5 text-indigo-400" />
                  Tips for Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Find a quiet environment
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Speak clearly into the microphone
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Take a moment to structure your thoughts
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    You can replay AI questions if needed
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Start Button */}
          <motion.div variants={item} className="flex justify-center pt-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                className="h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-10 text-lg font-bold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/50"
                onClick={handleStartInterview}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Zap className="mr-2 h-5 w-5 animate-pulse" />
                    Configuring Environment...
                  </>
                ) : (
                  <>
                    Start Interview Session
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
