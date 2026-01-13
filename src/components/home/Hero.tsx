'use client';

import { SignUpButton } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, PlayCircle, Star } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function Hero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden pb-20 pt-32 md:pb-32 md:pt-40"
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 -z-10 bg-background">
        <div className="absolute left-1/2 top-0 h-[500px] w-[1000px] -translate-x-1/2 animate-pulse rounded-[100%] bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[800px] rounded-[100%] bg-purple-500/10 blur-[100px]" />
        <div className="absolute right-0 top-1/4 h-[300px] w-[600px] rounded-[100%] bg-blue-500/10 blur-[80px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md">
              <span className="flex items-center gap-1 text-xs font-medium text-yellow-400">
                <Star className="h-3 w-3 fill-yellow-400" />
                <Star className="h-3 w-3 fill-yellow-400" />
                <Star className="h-3 w-3 fill-yellow-400" />
                <Star className="h-3 w-3 fill-yellow-400" />
                <Star className="h-3 w-3 fill-yellow-400" />
              </span>
              <span className="text-sm text-muted-foreground">
                Join our growing community of developers
              </span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mx-auto mb-8 max-w-6xl text-6xl font-bold tracking-tighter md:text-8xl lg:text-9xl"
          >
            <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
              Crush Your
            </span>
            <br />
            <span className="relative bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Tech Interview
              <svg
                className="absolute -bottom-1 left-0 h-3 w-full text-indigo-500/50"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mb-12 max-w-2xl text-xl leading-relaxed text-muted-foreground md:text-2xl"
          >
            The world's most advanced AI interviewer. Real-time voice feedback, coding challenges,
            and behavioral analysis to help you get hired.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex flex-col items-center gap-6 sm:flex-row"
          >
            <SignUpButton mode="modal">
              <Button
                size="lg"
                className="h-14 rounded-full bg-white px-8 text-lg font-semibold text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-transform hover:scale-105 hover:bg-white/90"
              >
                Start Practice Free
              </Button>
            </SignUpButton>

            <Button
              variant="ghost"
              size="lg"
              className="group h-14 rounded-full px-8 text-lg text-white/70 hover:bg-white/10 hover:text-white"
            >
              <PlayCircle className="mr-2 h-6 w-6 transition-colors group-hover:text-indigo-400" />
              Live Demo
            </Button>
          </motion.div>

          {/* Floating UI Elements (Abstract) */}
          <motion.div
            style={{ y: y, opacity: opacity }}
            className="absolute -right-[10%] top-1/2 -z-10 hidden h-[400px] w-[300px] rotate-12 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-6 backdrop-blur-md md:block"
          >
            <div className="mb-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-indigo-500/20" />
              <div className="h-2 w-24 rounded-full bg-white/10" />
            </div>
            <div className="space-y-3">
              <div className="h-2 w-full rounded-full bg-white/5" />
              <div className="h-2 w-3/4 rounded-full bg-white/5" />
              <div className="h-2 w-1/2 rounded-full bg-white/5" />
            </div>
          </motion.div>

          <motion.div
            style={{ y: y, opacity: opacity }}
            className="absolute -left-[5%] bottom-0 -z-10 hidden h-[150px] w-[250px] -rotate-6 rounded-2xl border border-white/10 bg-gradient-to-bl from-purple-500/10 to-transparent p-6 backdrop-blur-md md:block"
          />
        </div>
      </div>
    </section>
  );
}
