'use client';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, FileText, TrendingUp, Sparkles, CheckCircle } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Mic className="h-6 w-6 text-primary" />,
      title: 'AI-Powered Interviews',
      description:
        'Practice with an intelligent AI interviewer that asks relevant questions, adapts to your responses, and provides realistic conversation.',
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: 'Resume Analysis',
      description:
        "Upload your resume and get AI-powered suggestions to improve it. We'll help you highlight your strengths and address gaps.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: 'Progress Tracking',
      description:
        'Track your improvement over time with detailed analytics. See your strengths grow and identify areas for improvement.',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: 'Instant Feedback',
      description:
        'Get detailed feedback on your answers, including grammar, content relevance, and communication style suggestions.',
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: 'Gamification',
      description:
        'Stay motivated with achievements, streaks, and leaderboards. Make interview practice fun and engaging.',
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Everything You Need to Succeed</h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Our comprehensive platform provides all the tools you need to prepare for your next job
          interview and land your dream role.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <Card key={index} className="border-2 transition-colors hover:border-primary/50">
            <CardHeader>
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                {feature.icon}
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
