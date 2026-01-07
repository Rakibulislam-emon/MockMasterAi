'use client';

import Link from 'next/link';
import { useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Mic, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

interface NavbarProps {
  variant?: 'landing' | 'dashboard';
}

export function Navbar({ variant = 'landing' }: NavbarProps) {
  const { userId, isLoaded } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', latest => {
    setScrolled(latest > 20);
  });

  const isLanding = variant === 'landing';

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={cn(
        'fixed left-0 right-0 top-0 z-50 transition-all duration-300',
        scrolled || !isLanding
          ? 'border-b border-white/10 bg-background/60 shadow-lg backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'
          : 'bg-transparent py-2'
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href={userId ? '/dashboard' : '/'} className="group flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/40">
            {isLanding ? (
              <Mic className="h-5 w-5 text-white" />
            ) : (
              <Sparkles className="h-5 w-5 text-white" />
            )}
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
          <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent transition-all duration-300 group-hover:from-indigo-300 group-hover:to-purple-300">
            InterPrep AI
          </span>
        </Link>

        {/* Landing Navigation Links */}
        {isLanding && (
          <div className="hidden items-center gap-8 md:flex">
            {['Features', 'How It Works', 'Testimonials'].map(item => (
              <Link
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          {!isLoaded ? (
            // Placeholder buttons to prevent layout shift
            <>
              <Button variant="ghost" disabled className="opacity-50">
                Sign In
              </Button>
              <Button disabled className="opacity-50">
                Get Started
              </Button>
            </>
          ) : userId ? (
            <>
              {isLanding ? (
                <Link href="/dashboard">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
                      Go to Dashboard
                    </Button>
                  </motion.div>
                </Link>
              ) : (
                <div className="flex items-center gap-4">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        avatarBox:
                          'h-9 w-9 ring-2 ring-indigo-500/20 hover:ring-indigo-500/40 transition-all',
                      },
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost" className="font-medium hover:bg-white/5">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-6 font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40">
                    Get Started
                  </Button>
                </motion.div>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
