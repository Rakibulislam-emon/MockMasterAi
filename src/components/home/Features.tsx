'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, FileText, TrendingUp, Sparkles, CheckCircle, Brain, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Mic,
    title: 'AI-Powered Interviews',
    description:
      'Practice with an intelligent AI interviewer that adapts to your responses and simulates real conversation flows.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Brain,
    title: 'Smart Feedback',
    description:
      'Get detailed, actionable feedback on your answers, body language, and communication style instantly.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FileText,
    title: 'Resume Analysis',
    description:
      'Our AI analyzes your resume against job descriptions to help you tailor your experience effectively.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description:
      'Visualize your improvement over time with detailed analytics and skill mastery charts.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Target,
    title: 'Role-Specific Practice',
    description:
      'Target specific roles like Software Engineer, PM, or Data Scientist with curated question banks.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Zap,
    title: 'Gamification',
    description:
      'Stay motivated with streaks, achievements, and leaderboards to make preparation engaging.',
    color: 'from-yellow-400 to-amber-500',
  },
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

export function Features() {
  return (
    <section id="features" className="container mx-auto px-4 py-24">
      <div className="mb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-3xl font-bold md:text-5xl"
        >
          Everything You Need to <br />
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Succeed
          </span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mx-auto max-w-2xl text-lg text-muted-foreground"
        >
          Our comprehensive platform provides all the tools you need to prepare for your next job
          interview and land your dream role.
        </motion.p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature, index) => (
          <motion.div key={index} variants={item}>
            <Card className="group relative overflow-hidden border-white/10 bg-white/5 transition-colors hover:bg-white/10">
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 transition-opacity duration-500 group-hover:opacity-5`}
              />
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10 transition-all duration-300 group-hover:scale-110 group-hover:ring-white/20">
                  <feature.icon
                    className={`h-6 w-6 bg-gradient-to-br ${feature.color} bg-clip-text text-transparent`}
                  />
                  {/* Fallback icon color if gradient text fails */}
                  <feature.icon className="absolute h-6 w-6 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
