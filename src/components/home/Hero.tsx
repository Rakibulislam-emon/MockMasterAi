'use client';

import { useTranslations } from 'next-intl';
import { SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export function Hero() {
  const t = useTranslations('Hero');

  return (
    <section className="container mx-auto px-4 py-24 text-center">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">{t('badge')}</span>
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
          {t('titlePart1')}
          <span className="text-primary">{t('titlePart2')}</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">{t('description')}</p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <SignUpButton mode="modal">
            <Button size="lg" className="px-8 text-lg">
              {t('ctaStart')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </SignUpButton>
          <Button size="lg" variant="outline" className="px-8 text-lg">
            {t('ctaDemo')}
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{t('subtext')}</p>
      </div>
    </section>
  );
}
