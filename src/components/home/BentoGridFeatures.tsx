'use client';

import { motion } from 'framer-motion';
import { Bot, BrainCircuit, LineChart, Video, Mic, Zap, Globe, Code } from 'lucide-react';

const features = [
  {
    title: 'AI Analysis',
    description: 'Get instant, detailed feedback on your answers with advanced NLP models.',
    icon: BrainCircuit,
    className: 'md:col-span-2 lg:col-span-2',
    gradient: 'from-violet-500/20 to-purple-500/20',
  },
  {
    title: 'Real-time Mock Interviews',
    description: 'Simulate real interview pressure with our responsive voice-enabled AI.',
    icon: Mic,
    className: 'md:col-span-1 lg:col-span-1',
    gradient: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    title: 'Technical Assessment',
    description: 'Live coding environment with support for 20+ languages.',
    icon: Code,
    className: 'md:col-span-1 lg:col-span-1',
    gradient: 'from-emerald-500/20 to-green-500/20',
  },
  {
    title: 'Performance Tracking',
    description: 'Visualize your progress with comprehensive analytics and insights.',
    icon: LineChart,
    className: 'md:col-span-2 lg:col-span-2',
    gradient: 'from-orange-500/20 to-red-500/20',
  },
];

export function BentoGridFeatures() {
  return (
    <section className="relative overflow-hidden bg-background py-24">
      {/* Background blobs */}
      <div className="absolute left-0 top-1/4 -z-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-0 -z-10 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-3xl font-bold text-transparent md:text-5xl"
          >
            Everything you need to <br /> ace the interview
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-muted-foreground"
          >
            Our platform combines cutting-edge AI with proven interview strategies to give you the
            competitive edge.
          </motion.p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className={`group relative rounded-3xl border border-white/10 bg-white/5 p-8 transition-colors duration-300 hover:bg-white/10 ${feature.className}`}
            >
              <div
                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
              />

              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <div className="mb-6 inline-block rounded-2xl bg-white/10 p-4 ring-1 ring-white/20">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-white">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>

                {/* Decorative Elements */}
                <div className="mt-8 flex items-center justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <Zap className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
