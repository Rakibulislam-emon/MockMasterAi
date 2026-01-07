import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import createNextIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Define public routes
const isPublicRoute = createRouteMatcher([
  '/',
  '/en',
  '/en/sign-in(.*)',
  '/en/sign-up(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api(.*)',
]);

// Create next-intl middleware
const intlMiddleware = createNextIntlMiddleware(routing);

export default clerkMiddleware(async (auth, request) => {
  const isPublic = isPublicRoute(request);

  // Protect non-public routes
  if (!isPublic) {
    await auth.protect();
  }

  // Run internationalization middleware
  return intlMiddleware(request);
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Enable next-intl locale routes
    '/en/:path*',
  ],
};
