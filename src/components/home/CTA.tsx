'use client';

import { SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function CTA() {
  return (
    <section className="container mx-auto px-4 py-24">
      <div className="rounded-2xl bg-primary p-12 text-center text-primary-foreground">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">Ready to Ace Your Interview?</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
          Join thousands of job seekers who have improved their interview skills with InterPrep AI.
          Start practicing for free today.
        </p>
        <SignUpButton mode="modal">
          <Button size="lg" variant="secondary" className="px-8 text-lg">
            Get Started Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </SignUpButton>
      </div>
    </section>
  );
}
