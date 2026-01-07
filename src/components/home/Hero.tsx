'use client';

import { SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight } from 'lucide-react';

export function Hero() {
  return (
    <section className="container mx-auto px-4 py-24 text-center">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">AI-Powered Interview Practice</span>
        </div>

        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
          Ace Your Next
          <span className="text-primary"> Interview</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground">
          Practice with realistic AI-powered mock interviews, get instant feedback on your answers,
          and boost your confidence before the real thing.
        </p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <SignUpButton mode="modal">
            <Button size="lg" className="px-8 text-lg">
              Start Practicing Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </SignUpButton>
          <Button size="lg" variant="outline" className="px-8 text-lg">
            Watch Demo
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          No credit card required • Free forever • Start in seconds
        </p>
      </div>
    </section>
  );
}
