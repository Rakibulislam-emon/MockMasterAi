'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { SignUpButton } from '@clerk/nextjs';
import { ArrowRight, Sparkles } from 'lucide-react';

export function PremiumCTA() {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-background">
        <div className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" />
      </div>

      <div className="container relative mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-4xl"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-indigo-400">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Limited Time Offer</span>
          </div>

          <h2 className="mb-8 bg-gradient-to-b from-white to-white/50 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-7xl">
            Ready to land your dream job?
          </h2>

          <p className="mx-auto mb-12 max-w-2xl text-xl text-muted-foreground">
            Join thousands of engineers who have already mastered their interview skills with our AI
            platform.
          </p>

          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="h-16 transform rounded-full bg-white px-10 text-lg text-black shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] transition-all duration-300 hover:scale-105 hover:bg-white/90 hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)]"
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignUpButton>

            <Button
              variant="ghost"
              size="lg"
              className="h-16 rounded-full px-10 text-lg text-white hover:bg-white/10"
            >
              View Pricing
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
