'use client';

import { SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-20 pt-32 md:pb-32 md:pt-40">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-purple-500/20 blur-[100px]" />
        <div className="absolute left-1/4 top-0 h-[300px] w-[300px] rounded-full bg-indigo-500/20 blur-[80px]" />
        <div className="absolute right-1/4 top-0 h-[300px] w-[300px] rounded-full bg-blue-500/20 blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-5xl"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 animate-pulse" />
            <span className="text-sm font-medium">AI-Powered Interview Practice</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-8 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-6xl font-bold tracking-tight text-transparent md:text-8xl"
          >
            Master Your Next <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Tech Interview
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mx-auto mb-10 max-w-2xl text-xl text-muted-foreground"
          >
            Practice with our advanced AI interviewer that adapts to your responses. Get real-time
            feedback on your communication, technical accuracy, and body language.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col justify-center gap-4 sm:flex-row"
          >
            <SignUpButton mode="modal">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-6 text-lg font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40"
                >
                  Start Practicing Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </SignUpButton>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="lg"
                variant="outline"
                className="group border-white/10 bg-white/5 px-8 py-6 text-lg backdrop-blur-sm hover:bg-white/10"
              >
                <PlayCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>

          {/* Footer Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-8 text-sm font-medium text-muted-foreground"
          >
            No credit card required <span className="mx-2 text-primary/40">•</span> Free forever
            <span className="mx-2 text-primary/40">•</span> Start in seconds
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
