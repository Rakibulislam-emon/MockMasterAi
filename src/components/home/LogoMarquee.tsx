'use client';

import { motion } from 'framer-motion';

const companies = [
  'Google',
  'Microsoft',
  'Amazon',
  'Netflix',
  'Meta',
  'Apple',
  'Uber',
  'Airbnb',
  'Stripe',
  'Vercel',
  'OpenAI',
  'Anthropic',
];

export function LogoMarquee() {
  return (
    <section className="overflow-hidden bg-background py-20">
      <div className="container mx-auto mb-10 px-4 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          Prepare for technical interviews at top companies
        </p>
      </div>

      <div className="relative flex w-full select-none overflow-hidden bg-background">
        {/* Gradient Masks */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-gradient-to-l from-background to-transparent" />

        <div className="flex w-max min-w-full shrink-0 flex-nowrap gap-16 py-4">
          <motion.div
            animate={{ x: '-50%' }}
            transition={{
              repeat: Infinity,
              ease: 'linear',
              duration: 20,
            }}
            className="flex items-center gap-16 whitespace-nowrap"
          >
            {[...companies, ...companies].map((company, i) => (
              <span
                key={i}
                className="cursor-default bg-gradient-to-b from-muted-foreground/80 to-muted-foreground/40 bg-clip-text text-2xl font-bold text-transparent transition-all duration-300 hover:to-foreground"
              >
                {company}
              </span>
            ))}
            {[...companies, ...companies].map((company, i) => (
              <span
                key={`duplicate-${i}`}
                className="cursor-default bg-gradient-to-b from-muted-foreground/80 to-muted-foreground/40 bg-clip-text text-2xl font-bold text-transparent transition-all duration-300 hover:to-foreground"
              >
                {company}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
