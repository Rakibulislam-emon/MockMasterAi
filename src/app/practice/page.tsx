'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mic, FileText, Clock, Users, Sparkles, ArrowRight } from 'lucide-react';
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

const sessionTypes = [
  {
    id: 'behavioral',
    title: 'Behavioral',
    icon: Users,
    desc: 'Practice soft skills and past experiences',
  },
  { id: 'technical', title: 'Technical', icon: FileText, desc: 'Test your technical knowledge' },
  { id: 'general', title: 'General', icon: Sparkles, desc: 'Mixed questions for any interview' },
  { id: 'mock', title: 'Full Mock', icon: Mic, desc: 'Complete interview simulation' },
];

const difficulties = [
  { id: 'easy', label: 'Easy - Good for beginners' },
  { id: 'medium', label: 'Medium - Standard difficulty' },
  { id: 'hard', label: 'Hard - Challenging questions' },
  { id: 'adaptive', label: 'Adaptive - Adjusts to your level' },
];

export default function PracticePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState({
    sessionType: 'behavioral',
    difficulty: 'medium',
    targetRole: 'software-engineer',
  });

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Mic className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">InterPrep AI</span>
          </div>
          <Button variant="ghost" onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold">Start Interview Practice</h1>
          <p className="text-muted-foreground">
            Configure your interview session and start practicing with AI
          </p>
        </div>

        {/* Session Type Selection */}
        <div className="mb-8">
          <Label className="mb-4 block text-lg font-semibold">Select Interview Type</Label>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sessionTypes.map(type => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all ${
                  config.sessionType === type.id
                    ? 'border-primary bg-primary/5'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setConfig({ ...config, sessionType: type.id })}
              >
                <CardHeader className="pb-2">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <type.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{type.title}</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">{type.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Configuration Options */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="difficulty">Difficulty Level</Label>
            <Select
              value={config.difficulty}
              onValueChange={value => setConfig({ ...config, difficulty: value })}
            >
              <SelectTrigger id="difficulty" className="mt-2">
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

          <div>
            <Label htmlFor="role">Target Role</Label>
            <Select
              value={config.targetRole}
              onValueChange={value => setConfig({ ...config, targetRole: value })}
            >
              <SelectTrigger id="role" className="mt-2">
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
        </div>

        {/* Tips */}
        <Card className="mb-8 bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Tips for Your Interview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Find a quiet place where you can speak freely</li>
              <li>• Use the microphone button to speak your answers aloud</li>
              <li>• Take your time to think before responding</li>
              <li>• The AI will adapt to your responses and skill level</li>
              <li>• You can end the interview at any time to see your feedback</li>
            </ul>
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            className="px-8 text-lg"
            onClick={handleStartInterview}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 animate-pulse" />
                Setting up...
              </>
            ) : (
              <>
                Start Interview
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}
