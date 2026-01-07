'use client';

import { motion } from 'framer-motion';
import { UserPlus, Upload, Mic2, TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create Account',
    desc: 'Sign up in seconds and customize your profile to match your career goals.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Upload,
    step: '02',
    title: 'Upload Resume',
    desc: 'Our AI analyzes your experience to ask tailored, relevant questions.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Mic2,
    step: '03',
    title: 'Start Practicing',
    desc: 'Engage in realistic voice conversations with our adaptive AI interviewer.',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: TrendingUp,
    step: '04',
    title: 'Get Better',
    desc: 'Receive instant detailed feedback and track your improvement over time.',
    color: 'from-green-500 to-emerald-500',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden py-24">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />

      <div className="container relative mx-auto px-4">
        <div className="mb-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-3xl font-bold md:text-5xl"
          >
            How It <span className="text-primary">Works</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            From sign-up to success, we've streamlined the journey to your dream job.
          </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="absolute left-0 top-1/2 hidden h-0.5 w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent lg:block" />

          <div className="grid gap-8 lg:grid-cols-4">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative"
              >
                <div className="group relative z-10 flex flex-col items-center text-center">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-background shadow-xl ring-1 ring-primary/10 transition-transform duration-300 group-hover:-translate-y-2 group-hover:ring-primary/30">
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.color} opacity-10 transition-opacity group-hover:opacity-20`}
                    />
                    <item.icon
                      className={`h-8 w-8 bg-gradient-to-br ${item.color} bg-clip-text text-transparent`}
                    />
                    <item.icon className="absolute h-8 w-8 text-foreground opacity-0 transition-opacity group-hover:opacity-100" />

                    {/* Step Number Badge */}
                    <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-background font-bold shadow-sm ring-1 ring-border">
                      <span className="text-xs text-muted-foreground">{item.step}</span>
                    </div>
                  </div>

                  <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
