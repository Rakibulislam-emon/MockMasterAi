'use client';

import { useTranslations } from 'next-intl';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, FileText, TrendingUp, Users, Sparkles, CheckCircle } from 'lucide-react';

export function Features() {
  const t = useTranslations('Home.features');

  const features = [
    {
      icon: <Mic className="h-6 w-6 text-primary" />,
      title: t('aiInterview'),
      description: t('aiInterviewDesc'),
    },
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      title: t('resumeAnalysis'),
      description: t('resumeAnalysisDesc'),
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-primary" />,
      title: t('progressTracking'),
      description: t('progressTrackingDesc'),
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: t('bilingualSupport'),
      description: t('bilingualSupportDesc'),
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: t('instantFeedback'),
      description: t('instantFeedbackDesc'),
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: t('gamification'),
      description: t('gamificationDesc'),
    },
  ];

  return (
    <section id="features" className="container mx-auto px-4 py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">{t('title')}</h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{t('subtitle')}</p>
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
