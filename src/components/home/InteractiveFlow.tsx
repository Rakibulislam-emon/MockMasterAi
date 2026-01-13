'use client';

import { motion } from 'framer-motion';
import { Upload, Cpu, MessageSquare, Award } from 'lucide-react';
import { useState } from 'react';

const steps = [
  {
    id: 1,
    title: 'Upload Resume',
    description: 'Our AI scans your resume to understand your background and experience.',
    icon: Upload,
    color: 'text-blue-400',
  },
  {
    id: 2,
    title: 'AI Analysis',
    description: 'We generate tailored questions based on your specific job role and level.',
    icon: Cpu,
    color: 'text-purple-400',
  },
  {
    id: 3,
    title: 'Mock Interview',
    description: 'Practice in a realistic environment with voice interaction.',
    icon: MessageSquare,
    color: 'text-pink-400',
  },
  {
    id: 4,
    title: 'Get Certified',
    description: 'Receive a detailed report and certification of your readiness.',
    icon: Award,
    color: 'text-yellow-400',
  },
];

export function InteractiveFlow() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="relative bg-background py-32">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left Side - Content */}
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-8 text-4xl font-bold text-white md:text-5xl"
            >
              How it works
            </motion.h2>

            <div className="space-y-8">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`relative cursor-pointer pl-8 transition-all duration-300 ${activeStep === index ? 'scale-105 opacity-100' : 'opacity-40 hover:opacity-70'}`}
                  onMouseEnter={() => setActiveStep(index)}
                >
                  {/* Timeline Line */}
                  {index !== steps.length - 1 && (
                    <div className="absolute left-3 top-10 h-full w-0.5 bg-white/10" />
                  )}
                  {/* Dot */}
                  <div
                    className={`absolute left-0 top-1 h-6 w-6 rounded-full border-2 ${activeStep === index ? 'border-primary bg-primary/20' : 'border-white/20 bg-background'} transition-colors`}
                  />

                  <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-white">
                    <step.icon className={`h-5 w-5 ${step.color}`} />
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Visuals */}
          <div className="relative flex h-[600px] items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
                animate={{
                  opacity: activeStep === index ? 1 : 0,
                  scale: activeStep === index ? 1 : 0.8,
                  rotate: activeStep === index ? 0 : 10,
                  display: activeStep === index ? 'flex' : 'none',
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 items-center justify-center"
              >
                <div className="text-center">
                  <div
                    className={`mb-6 inline-flex rounded-full bg-white/5 p-8 ring-1 ring-white/10 ${step.color}`}
                  >
                    <step.icon className="h-24 w-24" />
                  </div>
                  <h4 className="text-3xl font-bold text-white">{step.title}</h4>
                  <p className="mx-auto mt-4 max-w-sm text-white/60">
                    visual representation of {step.title.toLowerCase()}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
