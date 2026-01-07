# InterPrep AI Project Refactoring Guidelines

This document provides a comprehensive guide for refactoring the InterPrep AI application based on the errors and issues encountered during the build process. Following these guidelines will help ensure code quality, type safety, and proper functionality.

## 1. Authentication System (Clerk v6)

The authentication system required significant changes due to Clerk v6's updated API patterns. The previous implementation used legacy middleware patterns that are no longer compatible with the latest version.

### 1.1 Middleware Implementation

The middleware file must use the new `clerkMiddleware` function with a handler pattern. This approach integrates authentication and internationalization middleware correctly.

**Key Changes Made:**
- Replaced standalone `authMiddleware` with `clerkMiddleware`
- Used `createRouteMatcher` for defining public routes
- Nested intl middleware inside the Clerk middleware handler
- Used `auth.protect()` for route protection

**Verification Steps:**
- Test that unauthenticated users are redirected to sign-in page
- Verify that public routes (`/sign-in`, `/sign-up`, `/api/questions`) are accessible without authentication
- Confirm that protected routes redirect unauthenticated users
- Test locale routing works alongside authentication

**File to Review:**
- `src/middleware.ts`

---

## 2. Internationalization Configuration (next-intl v3)

Internationalization configuration was fragmented across multiple files with inconsistent locale definitions. This caused routing conflicts and build failures.

### 2.1 Unified Routing Configuration

A single source of truth for locale configuration is essential. The project had two routing files with different locale definitions, which created conflicts during the build process.

**Key Changes Made:**
- Created `src/i18n/routing.ts` as the primary routing configuration
- Standardized locales to `['en', 'bn']`
- Removed duplicate `src/app/[locale]/routing.ts` or aligned it with the primary configuration
- Created `src/i18n/request.ts` for request configuration
- Updated `next.config.js` to use `next-intl/plugin`

**Verification Steps:**
- Verify both `/en` and `/bn` routes render correctly
- Test language switching functionality
- Confirm localized content loads based on URL locale
- Check that default locale (`en`) falls back correctly for invalid locales

**Files to Review:**
- `src/i18n/routing.ts`
- `src/i18n/request.ts`
- `src/i18n.ts`
- `next.config.js`

---

## 3. Database Models (Mongoose with TypeScript)

Mongoose models with static methods require special TypeScript handling. The build failed multiple times due to type mismatches between Mongoose model types and custom interfaces.

### 3.1 Static Method Typing Pattern

When defining static methods on Mongoose models, the interface must extend `Model<T>` and use type assertion to satisfy TypeScript's structural typing requirements.

**Pattern Applied:**
```typescript
interface IInterviewSessionModel extends Model<IInterviewSessionDocument> {
  // static method signatures
}

const InterviewSession = model<IInterviewSessionDocument, IInterviewSessionModel>(
  'InterviewSession',
  InterviewSessionSchema
) as unknown as IInterviewSessionModel;
```

**Verification Steps:**
- Test all static methods on models (findByUserId, findUnanswered, etc.)
- Verify CRUD operations work through the models
- Check that database connections handle connection pooling correctly
- Test error handling for database operations

**Files to Review:**
- `src/lib/models/InterviewSession.ts`
- `src/lib/models/Resume.ts`
- `src/lib/models/Progress.ts`
- `src/lib/models/User.ts`
- `src/lib/models/Question.ts`
- `src/lib/mongodb.ts`

---

## 4. Web Speech API Integration

The Web Speech API types (`SpeechRecognition` and `speechSynthesis`) caused TypeScript errors due to browser type conflicts and experimental API status.

### 4.1 Handling Experimental Browser Types

The Web Speech API is experimental and not fully covered by TypeScript's default lib definitions. Custom type handling is required to prevent compilation errors.

**Pattern Applied:**
- Removed conflicting `declare global` blocks
- Used type assertions where browser types are incomplete
- Handled graceful degradation for unsupported browsers

**Verification Steps:**
- Test speech recognition in Chrome/Edge (Webkit-based browsers)
- Test speech synthesis for question reading
- Verify fallback handling for browsers without speech support
- Check that microphone permissions are handled correctly
- Test error states (no microphone, denied permissions)

**Files to Review:**
- `src/hooks/use-speech-recognition.ts`
- `src/hooks/use-speech-synthesis.ts`

---

## 5. AI Integration (Groq SDK)

The Groq SDK required proper package installation and import configuration. The wrong import pattern caused build failures.

### 5.2 Correct SDK Implementation

The Groq SDK package must be installed correctly and imported using the default export pattern.

**Pattern Applied:**
```typescript
import Groq from 'groq-sdk';
```

**Verification Steps:**
- Verify API calls return valid responses
- Test rate limiting and error handling
- Check that different AI models can be selected
- Verify streaming responses work correctly

**Files to Review:**
- `src/lib/ai/groq.ts`
- `src/lib/ai/gemini.ts`
- `src/lib/ai/index.ts`

---

## 6. TypeScript Strict Mode Compliance

Multiple type errors occurred due to implicit `any` types, particularly in `reduce` callbacks and complex data transformations.

### 6.1 Explicit Type Annotations

All function parameters, return types, and callback parameters must have explicit type annotations when working with complex data structures.

**Pattern Applied:**
```typescript
const totalDuration = sessions.reduce<number>(
  (sum: number, session: IInterviewSessionDocument) => sum + session.duration,
  0
);
```

**Verification Steps:**
- Run TypeScript compiler with strict mode enabled
- Check all ESLint warnings are addressed
- Verify no implicit `any` types remain
- Test all server actions with various input scenarios

**Files to Review:**
- `src/actions/interview.ts`
- `src/actions/user.ts`
- `src/actions/resume.ts`

---

## 7. ESLint Compliance

The build produced numerous ESLint warnings for unused variables, imports, and other code quality issues. These should be addressed for production readiness.

### 7.1 Code Quality Standards

All code should pass ESLint checks without warnings. This includes proper handling of unused variables, correct import patterns, and adherence to TypeScript best practices.

**Common Issues to Address:**
- Remove unused imports and variables
- Use `const` instead of `let` for non-reassigned variables
- Replace `any` types with specific types where possible
- Use proper component imports from UI libraries

**Verification Steps:**
- Run `npm run lint` and verify no errors
- Run `npm run lint:fix` for auto-fixable issues
- Address all manual fixes required

---

## 8. Environment Configuration

Environment variables must be properly configured for the application to function correctly.

### 8.1 Required Environment Variables

The application requires several environment variables to be set in the deployment environment.

**Required Variables:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `MONGODB_URI` - MongoDB connection string
- `GROQ_API_KEY` - Groq API key
- `GOOGLE_API_KEY` - Google Gemini API key

**Verification Steps:**
- Verify all required environment variables are set
- Test authentication flow with Clerk
- Verify database connection to MongoDB
- Test AI API calls with valid credentials

---

## 9. UI Component Consistency

Throughout the codebase, UI components should maintain consistent patterns for styling, accessibility, and functionality.

### 9.1 Component Standards

All UI components should follow the established patterns using Radix UI primitives with Tailwind CSS styling.

**Verification Steps:**
- Verify all interactive elements have proper keyboard navigation
- Check that focus states are visible and consistent
- Test responsive layouts across different screen sizes
- Verify loading states and error states are handled properly

**Files to Review:**
- All files in `src/components/ui/`
- All page components in `src/app/[locale]/**/`

---

## 10. API Route Validation

API routes should have proper input validation and error handling to ensure security and reliability.

### 10.1 Route Security

All API endpoints should validate incoming requests and handle errors gracefully.

**Verification Steps:**
- Test API endpoints with valid and invalid inputs
- Verify authentication is enforced on protected routes
- Check that rate limiting works correctly
- Test error responses are properly formatted

**Files to Review:**
- `src/app/api/questions/route.ts`
- Any webhook handlers

---

## Testing Checklist

Before considering the refactoring complete, verify the following functionality:

### Authentication Testing
- [ ] User can sign up with email/password
- [ ] User can sign in with existing account
- [ ] Protected routes redirect unauthenticated users
- [ ] Sign out functionality works correctly
- [ ] Session persists across page refreshes

### Interview Flow Testing
- [ ] User can create a new interview session
- [ ] Voice recognition works during practice
- [ ] Text-to-speech reads questions aloud
- [ ] Session history is saved correctly
- [ ] Progress is tracked over time

### Resume Management Testing
- [ ] User can upload resume files
- [ ] Resume parsing works correctly
- [ ] Multiple resumes can be managed
- [ ] Resume deletion works correctly

### Internationalization Testing
- [ ] English locale loads correctly at `/en`
- [ ] Bengali locale loads correctly at `/bn`
- [ ] Language switcher changes content
- [ ] URLs reflect current locale

### Database Testing
- [ ] Data saves correctly to MongoDB
- [ ] Data retrieves correctly from MongoDB
- [ ] Connection handles reconnection gracefully
- [ ] Large data sets load efficiently

---

## Deployment Readiness Checklist

Before deploying to production, ensure:

- [ ] All TypeScript compilation errors are resolved
- [ ] All ESLint warnings are addressed
- [ ] Environment variables are configured
- [ ] Database connection is tested
- [ ] Authentication flow is verified
- [ ] All third-party API keys are valid
- [ ] Error monitoring is configured
- [ ] Logging is implemented for debugging

---

