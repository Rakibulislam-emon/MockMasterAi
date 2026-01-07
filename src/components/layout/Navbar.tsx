'use client';

import Link from 'next/link';
import { useAuth, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Mic, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  variant?: 'landing' | 'dashboard';
}

export function Navbar({ variant = 'landing' }: NavbarProps) {
  const { userId, isLoaded } = useAuth();

  const isLanding = variant === 'landing';

  return (
    <nav
      className={cn(
        'z-50 border-b transition-all duration-300',
        isLanding
          ? 'sticky top-0 bg-background/80 backdrop-blur-sm'
          : 'fixed left-0 right-0 top-0 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
      )}
    >
      <div
        className={cn(
          'container mx-auto flex items-center justify-between px-4',
          isLanding ? 'py-4' : 'h-full'
        )}
      >
        {/* Logo */}
        <Link href={userId ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            {isLanding ? (
              <Mic className="h-5 w-5 text-primary-foreground" />
            ) : (
              <svg
                className="h-5 w-5 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            )}
          </div>
          <span className="text-xl font-bold">InterPrep AI</span>
        </Link>

        {/* Landing Navigation Links */}
        {isLanding && (
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="#features"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link
              href="#testimonials"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Testimonials
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          {!isLoaded ? (
            // Show placeholder buttons while loading (prevents layout shift)
            <>
              <Button variant="ghost" disabled>
                Sign In
              </Button>
              <Button disabled>Get Started</Button>
            </>
          ) : userId ? (
            <>
              {isLanding ? (
                <Link href="/dashboard">
                  <Button>Go to Dashboard</Button>
                </Link>
              ) : (
                <UserButton afterSignOutUrl="/" />
              )}
            </>
          ) : (
            <>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button>Get Started</Button>
              </SignUpButton>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
