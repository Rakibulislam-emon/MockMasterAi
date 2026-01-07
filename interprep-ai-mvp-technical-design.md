# Technical Design Document: InterPrep AI (MVP Edition)

**Project Name:** InterPrep AI
**Version:** 2.0 (MVP)
**Date:** January 2026
**Classification:** Free-to-Use Interview Preparation Platform
**Architectural Paradigm:** Next.js Monolith with AI-Powered Interview Simulation

---

## Executive Summary

This updated Technical Design Document reflects the refined scope for InterPrep AI's initial release, prioritizing rapid delivery of core interview preparation functionality while deferring monetization infrastructure to future development phases. The platform continues to embody its mission of helping job seekers improve their communication and interview skills through AI-powered simulated conversations, but now with an entirely free access model that maximizes user acquisition and platform adoption during the MVP phase.

The architectural decisions have been streamlined to accelerate development velocity while maintaining production quality standards. The platform will employ a Next.js Monolith architecture where the frontend presentation layer and backend API logic coexist within a single codebase, leveraging Next.js Server Actions and API Routes for all server-side operations. This approach eliminates the complexity of managing distributed services while providing sufficient scalability for the anticipated user base during the MVP period.

Authentication has been delegated to Clerk, a managed authentication service that provides superior developer experience, robust security features, and pre-built components that significantly reduce implementation time compared to self-hosted solutions. This change allows focus to remain on core feature development rather than authentication infrastructure maintenance. Database architecture utilizes MongoDB with Mongoose for flexible document storage, supporting the varied data structures inherent in interview transcripts, user preferences, and session metadata.

The AI integration layer continues to leverage free AI models including Google Gemini Flash and Groq's Llama 3 implementation, providing high-quality interview simulation without per-request costs that would complicate the free-access business model. The multi-provider gateway pattern ensures service reliability despite individual provider rate limits, maintaining consistent user experience throughout the platform.

---

## Phase 1: Feature Scope and Technology Stack

### 1.1 Architecture Recommendation and Decision

Before detailing the feature set and technology stack, it is essential to address the fundamental architectural question of project structure. After careful evaluation of three primary options, the recommendation is to proceed with a Next.js Monolith architecture.

**Architectural Options Evaluated:**

The first option considered was a complete monorepo approach using tools like Turborepo or Nx. This architecture separates the frontend application, backend services, and shared utilities into distinct packages within a single repository. While this approach provides excellent scalability for large teams and complex applications, it introduces significant overhead in configuration, deployment coordination, and development workflow that is disproportionate to the requirements of an MVP platform built by a solo developer or small team.

The second option evaluated was a fully separated backend using frameworks like Express.js, Fastify, or NestJS alongside a distinct frontend application. This separation provides clean architectural boundaries and enables independent scaling of services, but it introduces CORS complexity, requires coordination of multiple deployment pipelines, and necessitates the maintenance of API contracts between services. For a platform whose backend logic primarily involves database CRUD operations and AI API forwarding, this separation adds complexity without commensurate benefit.

The third option, and the recommended approach, is a Next.js Monolith where the frontend presentation layer and backend API logic coexist within the Next.js framework. This architecture leverages Next.js Server Actions for mutations and Route Handlers for specialized operations, providing all necessary backend capabilities within a unified codebase. The framework's built-in API routes handle serverless function deployment, eliminating the need for separate server infrastructure while maintaining excellent performance through edge caching and optimized cold starts.

**Recommendation: Next.js Monolith with Server Actions**

The Next.js Monolith architecture provides several advantages for the InterPrep AI MVP. Development velocity accelerates because engineers work within a single codebase with unified type definitions, eliminating the context switching and synchronization challenges inherent in distributed architectures. Type safety extends naturally from database models through API layers to frontend components, catching errors at compile time rather than runtime. Deployment simplifies to a single command that publishes both frontend and backend changes, with Vercel's serverless infrastructure handling API route scaling automatically.

This architecture accommodates the platform's current requirements while preserving future flexibility. If the backend evolves to require independent scaling or specialized infrastructure, the migration path to a separate service remains straightforward. The clean separation between Server Actions, API Routes, and client components within the Next.js codebase ensures that extraction of backend logic does not require rewrites but rather refactoring and relocation of existing code.

**Technology Stack Summary:**

| Layer | Technology | Justification |
|-------|------------|---------------|
| Framework | Next.js 16 (App Router) | Full-stack capabilities, server components, excellent performance |
| Language | TypeScript | Type safety, improved developer experience, better tooling |
| Styling | Tailwind CSS v4 | Utility-first, optimized bundles, modern features |
| UI Components | shadcn/ui | Accessible, customizable, Radix UI foundation |
| Authentication | Clerk | Managed service, rapid implementation, robust security |
| Database | MongoDB with Mongoose | Flexible schemas, natural fit for varied data structures |
| AI Providers | Google Gemini Flash, Groq Llama 3 | Free tier availability, complementary strengths |
| State Management | React Context + Zustand | Simple state needs, minimal boilerplate |

### 1.2 Core MVP Feature Set

The MVP focuses on delivering essential interview preparation functionality that demonstrates platform value while establishing foundations for future enhancement. All features are accessible without payment barriers, maximizing user acquisition during the initial market entry phase.

**AI Interview Simulation**

The core feature enables users to experience realistic job interviews conducted entirely by AI. Users select their target role, desired difficulty level, and interview focus area before entering a conversational interface where they respond to AI-generated questions. The AI interviewer adapts to user responses, asking follow-up questions for interesting answers, providing gentle corrections for language struggles, and maintaining appropriate pacing throughout the session.

Voice interaction support allows users to speak their responses rather than typing, with the Web Speech API providing speech-to-text conversion. Text-to-speech synthesis converts AI responses into spoken words, creating an auditory experience that simulates conversation with a human interviewer. The system includes audio visualization that animates in sync with speech, enhancing the sense of interaction.

Post-session feedback provides comprehensive analysis of user performance across multiple dimensions including content relevance, language quality, communication clarity, and confidence indicators. The feedback includes specific comparisons between user responses and improved alternatives, with explanations of grammar corrections and content enhancements. This feedback loop accelerates skill development by making improvement areas concrete and actionable.

**Bilingual Support System**

The platform's bilingual architecture genuine provides support for Bengali-speaking users preparing for English-language interviews. Interface elements, instructions, and feedback displays are available in both English and Bengali, with instant toggle capability that preserves context and progress.

The AI interviewer understands when users switch languages or request Bengali explanations, adapting its behavior to provide scaffolding while maintaining the goal of English proficiency. Question content is available in both languages with translations that preserve cultural context relevant to job interviews. Feedback reports generate parallel explanations in both languages, ensuring users can fully understand improvement areas regardless of their English proficiency level.

**Interview Question Bank**

A comprehensive question database powers the AI interviewer's content generation capabilities. Questions organize across multiple dimensions including question type (behavioral, technical, situational, general), job category (software engineering, data science, marketing, finance), experience level (entry, mid, senior, executive), and difficulty progression. The system supports company-specific and role-specific preparation by generating tailored questions based on target employer information.

**Progress Tracking Dashboard**

The dashboard provides users with visibility into their interview preparation journey, displaying aggregate statistics across completed sessions, improvement trends over time, and comparative performance metrics. Gamification elements encourage consistent practice through achievement badges, streak tracking, and milestone celebrations. The system acknowledges consistent engagement, mastery of specific question categories, and measurable improvement in performance metrics.

**Resume Analyzer**

An integrated resume analyzer helps users evaluate their resumes against target job descriptions. Users upload resume files in PDF format, and the AI extracts key content, analyzes alignment with job requirements, identifies missing keywords, and provides improvement suggestions. This integration ensures users arrive at interviews with both strong interview performance and well-matched documentation.

### 1.3 Deferred Features

The following features are deferred to future development phases after MVP launch and market validation:

**Monetization Infrastructure**

Stripe integration, subscription tiers (Free, Pro, Enterprise), usage limits tied to subscription status, and payment processing are deferred. The platform operates with unlimited access during the MVP phase, with usage limits implemented only through basic rate limiting to prevent abuse rather than monetization enforcement.

**Advanced Analytics**

Detailed analytics dashboards with trend predictions, comparative benchmarking against peer populations, and predictive modeling of interview readiness are deferred. Basic progress tracking and session statistics remain available, but advanced analytical features require additional development effort.

**Enterprise Features**

Team management dashboards, custom question bank uploads, branded experience options, API access for LMS integration, and dedicated account management are deferred to enterprise roadmap following MVP validation.

---

## Phase 2: Data Architecture

### 2.1 Database Schema Design

The MongoDB schema design prioritizes query efficiency for common access patterns, flexibility for evolving requirements, and clear relationships between entities. Collections are structured to minimize expensive join operations while maintaining referential integrity where necessary.

**Users Collection**

The users collection stores Clerk authentication reference and user preferences that persist across sessions. Minimal user data is stored in MongoDB since Clerk handles authentication state, profile images, and basic account management.

```javascript
{
  _id: ObjectId,
  clerkId: String,                    // Unique, indexed - primary identifier from Clerk
  email: String,                      // For database queries and display
  name: String,                       // Display name
  preferredLanguage: String,          // 'en', 'bn', 'both'
  targetRole: String,                 // For personalized question generation
  targetIndustry: String,
  experienceLevel: String,            // 'entry', 'mid', 'senior', 'executive'
  timezone: String,                   // For scheduling interviews
  onboardingCompleted: Boolean,       // Track onboarding flow status
  createdAt: Date,                    // First login timestamp
  lastLoginAt: Date,                  // Most recent activity timestamp
  updatedAt: Date                     // Last profile update
}
```

The clerkId field serves as the primary identifier, linking MongoDB records to Clerk authentication state. This design ensures that user data remains accessible even if email addresses change, while enabling efficient lookups during authentication callbacks.

**InterviewSessions Collection**

Interview sessions represent individual interview practice events, storing complete conversation transcripts and generated feedback.

```javascript
{
  _id: ObjectId,
  clerkId: String,                    // Indexed - references user via Clerk
  sessionType: String,                // 'behavioral', 'technical', 'general', 'mock'
  status: String,                     // 'in_progress', 'completed', 'aborted'
  difficultyLevel: String,            // 'easy', 'medium', 'hard', 'adaptive'
  languageMode: String,               // 'en', 'bn', 'mixed'
  targetRole: String,
  targetCompany: String,
  messages: [{
    role: String,                     // 'user', 'ai', 'system'
    content: String,                  // Message text content
    audioUrl: String,                 // For voice interactions (optional)
    timestamp: Date,                  // Message timestamp
    transcriptionConfidence: Number,  // STT confidence score
    durationMs: Number                // Audio duration if applicable
  }],
  feedback: {
    overallScore: Number,             // 0-100 composite score
    contentScore: Number,             // Score for answer relevance
    languageScore: Number,            // Score for grammar and vocabulary
    confidenceScore: Number,          // Score for communication confidence
    strengths: [String],              // Identified strong areas
    improvements: [{
      category: String,               // Improvement area category
      description: String,            // Specific observation
      suggestedResponse: String,      // Better answer example
      explanation: String             // Why this is better
    }],
    suggestedResources: [{
      type: String,                   // 'article', 'video', 'practice'
      title: String,                  // Resource title
      url: String                     // Resource link
    }]
  },
  duration: Number,                   // Total session duration in seconds
  questionsCompleted: Number,         // Number of questions answered
  startedAt: Date,
  completedAt: Date
}
```

The messages array stores the complete conversation transcript, enabling review, feedback generation, and future improvements through conversation analysis. The feedback subdocument provides structured performance data without requiring separate queries for feedback retrieval.

**QuestionBank Collection**

The question bank stores interview questions with rich metadata supporting diverse selection and generation strategies.

```javascript
{
  _id: ObjectId,
  category: String,                   // 'behavioral', 'technical', 'situational'
  subcategory: String,                // e.g., 'leadership', 'system-design'
  difficulty: Number,                 // 1-5 scale
  questionEn: String,                 // English version
  questionBn: String,                 // Bengali translation
  modelAnswerEn: String,              // Reference answer for feedback
  modelAnswerBn: String,              // Bengali reference answer
  evaluationCriteria: [{
    criterion: String,                // Evaluation dimension
    description: String,              // What to look for
    keywords: [String],               // Important concepts
    maxPoints: Number                 // Maximum points for this criterion
  }],
  tags: [String],                     // For filtering (e.g., 'amazon', 'system-design')
  usageCount: Number,                 // For popularity-based suggestions
  averageRating: Number,              // User feedback average
  createdBy: String,                  // 'admin', 'ai-generated'
  isActive: Boolean,                  // Soft delete flag
  createdAt: Date,
  updatedAt: Date
}
```

Questions are tagged for flexible filtering and selection, with usage counts and ratings enabling intelligent question presentation that balances variety with proven effectiveness.

**Resumes Collection**

User resumes are stored with extracted content for analysis and matching.

```javascript
{
  _id: ObjectId,
  clerkId: String,                    // Indexed - user reference
  fileName: String,                   // Original filename
  fileUrl: String,                    // S3 or storage reference
  fileSize: Number,                   // File size in bytes
  mimeType: String,                   // File type (application/pdf)
  extractedText: String,              // Parsed text content
  parsedSections: {
    summary: String,
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    education: [{
      institution: String,
      degree: String,
      year: String
    }],
    skills: [String],
    certifications: [String]
  },
  analysis: {
    overallScore: Number,
    atsScore: Number,                 // Applicant Tracking System compatibility
    missingKeywords: [String],
    improvementSuggestions: [{
      section: String,
      suggestion: String,
      importance: String              // 'high', 'medium', 'low'
    }]
  },
  isDefault: Boolean,                 // Primary resume flag
  createdAt: Date,
  analyzedAt: Date
}
```

The extractedText field enables AI analysis without requiring repeated file parsing, while parsedSections provide structured access to resume content for display and comparison purposes.

**ProgressTracking Collection**

Daily progress snapshots support the gamification and progress tracking features.

```javascript
{
  _id: ObjectId,
  clerkId: String,                    // Indexed - user reference
  date: Date,                         // Daily snapshot date
  interviewsCompleted: Number,
  totalQuestionsAnswered: Number,
  averageScore: Number,
  timeSpentMinutes: Number,
  focusAreas: [String],               // Categories with most practice
  achievements: [{
    achievementId: String,
    earnedAt: Date
  }],
  streaks: {
    current: Number,
    longest: Number,
    lastActivityDate: Date
  }
}
```

Daily aggregation reduces query complexity for dashboard displays while maintaining granular data for detailed analytics.

### 2.2 Indexing Strategy

Strategic indexing ensures query performance across common access patterns while avoiding excessive overhead from unused indexes.

```javascript
// Users collection indexes
{ clerkId: 1 }, { unique: true }
{ email: 1 }

// InterviewSessions collection indexes
{ clerkId: 1, createdAt: -1 }
{ status: 1 }
{ sessionType: 1 }

// QuestionBank collection indexes
{ category: 1, subcategory: 1 }
{ difficulty: 1 }
{ tags: 1 }
{ isActive: 1 }

// Resumes collection indexes
{ clerkId: 1 }
{ clerkId: 1, isDefault: 1 }

// ProgressTracking collection indexes
{ clerkId: 1, date: -1 }
```

Composite indexes support common multi-condition queries while single-field indexes enable efficient filtering by individual attributes.

### 2.3 Clerk Webhook Integration

The authentication flow requires webhook integration between Clerk and MongoDB to ensure user records exist before data operations.

**Clerk Webhook Events:**

| Event Type | Description | Action |
|------------|-------------|--------|
| user.created | New user registration | Create MongoDB user record |
| user.updated | Profile information changed | Update MongoDB user record |
| user.deleted | Account deletion | Delete or anonymize MongoDB data |

The webhook endpoint validates Clerk signature headers, parses event payloads, and performs corresponding database operations to maintain synchronization between authentication state and application data.

---

## Phase 3: Backend Architecture

### 3.1 API Design Philosophy

The backend API implements RESTful conventions with Next.js Server Actions for mutations and Route Handlers for specialized operations. All endpoints require Clerk authentication verification, with protected routes redirecting unauthenticated users to the login flow.

**Request Validation Strategy:**

Zod schemas validate all request payloads before processing, preventing invalid data from reaching business logic. Validation errors return actionable messages that help legitimate users correct input issues while avoiding information disclosure that could aid attackers.

**Rate Limiting Configuration:**

Usage-based rate limiting protects API resources while accommodating legitimate usage patterns. Different limits apply to different endpoint categories, with stricter limits on AI endpoints that consume external API credits and more generous limits on data retrieval operations.

**Error Handling Standardization:**

All errors follow a consistent format including error code, user message, and optional details for debugging. Structured error responses enable consistent error handling on the frontend while providing sufficient context for troubleshooting.

### 3.2 API Endpoint Specifications

**Authentication Endpoints (Clerk Integration)**

The authentication endpoints are handled by Clerk's React components and Next.js middleware, requiring minimal custom implementation. The following flows are supported through Clerk's pre-built components:

**User Registration Flow:**

Users access the registration page rendered by Clerk's components, providing email or OAuth provider authentication. Upon successful registration, Clerk generates a webhook event that triggers user record creation in MongoDB through the webhook endpoint.

**User Login Flow:**

Login is handled by Clerk's authentication components, supporting email magic links and OAuth providers including Google and GitHub. Session management is handled entirely by Clerk's secure session cookies.

**Session Verification:**

The `auth()` function from `@clerk/nextjs/server` provides session verification in Server Actions and API routes, returning the authenticated user's Clerk ID and basic profile information.

**Interview Session Endpoints:**

POST /api/interviews/create initializes a new interview session. Request parameters include session type, difficulty preference, target role, and optional company context. The endpoint creates the session record, initializes the message array with system configuration, and returns the session ID with initial question.

GET /api/interviews/:id retrieves an existing session including messages and feedback. Access is restricted to the session owner through ownership verification using the Clerk ID from session state.

POST /api/interviews/:id/message sends a user message within an active session. The request includes message content or audio reference, which the endpoint processes by appending to the message array, invoking AI processing, and generating the AI response.

POST /api/interviews/:id/complete finalizes an interview session, generating comprehensive feedback based on the complete conversation transcript. The endpoint calculates scores across multiple dimensions, identifies strengths and improvements, generates suggested resources, updates user progress tracking, and returns the complete feedback report.

GET /api/interviews/history retrieves the user's interview history with pagination and filtering options. Query parameters support filtering by date range, session type, and status.

**Question Bank Endpoints:**

GET /api/questions retrieves questions with filtering and pagination. Query parameters support category, subcategory, difficulty, and language filters.

GET /api/questions/random retrieves a random selection of questions for practice mode. Parameters specify count, categories, and difficulty range.

POST /api/questions/generate triggers AI-powered question generation for custom scenarios. Request parameters include role, industry, difficulty, and specific topics to address.

**Resume Endpoints:**

POST /api/resumes/upload handles resume file uploads, storing the file in cloud storage, extracting text content, and creating the resume record with parsed sections.

GET /api/resumes retrieves the user's resume list with metadata for selection interfaces.

GET /api/resumes/:id returns a specific resume including parsed content for display.

DELETE /api/resumes/:id removes a resume and associated analysis data.

POST /api/resumes/:id/analyze triggers AI analysis of a resume against an optional job description. The endpoint retrieves resume content, generates AI-powered analysis, updates the resume record, and returns improvement suggestions.

**Progress and Analytics Endpoints:**

GET /api/progress/dashboard retrieves aggregate statistics for the user's dashboard display. Data includes total interviews completed, average scores, improvement trends, current streak, and recent achievements.

GET /api/progress/history retrieves daily progress records for trend visualization. Parameters specify date range and data granularity.

GET /api/progress/achievements returns earned and available achievements with progress toward incomplete items.

**User Preferences Endpoints:**

GET /api/users/preferences retrieves user configuration including preferred language, target role, experience level, and interface settings.

PUT /api/users/preferences updates user configuration. Request parameters support partial updates for individual preference categories.

**Clerk Webhook Endpoint:**

POST /api/webhooks/clerk handles Clerk webhook events for user synchronization. The endpoint validates webhook signatures, processes event payloads, and performs corresponding database operations to maintain authentication-data synchronization.

### 3.3 AI Integration Layer

**AI Gateway Architecture:**

The AI Gateway routes requests across multiple providers based on availability, rate limit status, and response quality considerations. The gateway implements a provider abstraction that normalizes different API interfaces into consistent request and response formats.

**Primary Provider: Google Gemini Flash 1.5:**

Gemini Flash 1.5 serves as the primary AI model due to its generous free tier limits (15 RPM, 1M TPM), fast inference speed, and multimodal capabilities. The integration converts conversation context into structured prompts that elicit consistent JSON responses for reliable parsing.

**Fallback Provider: Groq (Llama 3):**

Groq's Llama 3 implementation provides ultra-fast inference that creates more natural conversation flow when available. The gateway routes requests to Groq when Gemini returns rate limit errors or exceeds acceptable latency thresholds.

**Prompt Engineering Strategy:**

Interview prompts include comprehensive context about the conversation history, user profile, target role, and session configuration. System messages establish the AI interviewer persona with specific behavioral guidelines including adaptive difficulty, bilingual support activation, and feedback delivery expectations.

Response formatting instructions specify JSON output with structured fields for feedback generation, enabling reliable parsing without fragile text extraction.

**Caching Strategy:**

Frequently requested information including common question responses and standard feedback templates is cached to reduce AI API consumption. Cache invalidation occurs on configuration changes or content updates.

---

## Phase 4: Frontend Architecture and Component Tree

### 4.1 Route Structure

**Public Routes (Unauthenticated):**

/ serves as the marketing landing page with feature highlights, testimonials, calls to action for registration, and value proposition messaging. Server-side rendering ensures optimal SEO performance and fast initial page loads.

/sign-in presents the Clerk authentication interface for existing users.

/sign-up provides the Clerk registration interface for new users.

**Protected Routes (Authenticated):**

/dashboard serves as the primary user hub, displaying progress overview, recent activity, quick actions, and motivational elements encouraging consistent practice.

/practice launches the interview preparation interface with mode selection (voice/text), difficulty adjustment, and session configuration.

/practice/new initiates a new interview session with configuration options for session type, role targeting, and difficulty level.

/practice/:id renders an active or completed interview session with full interaction capabilities or review mode.

/history displays the user's interview history with filtering, sorting, and detailed session access.

/resumes manages resume uploads, parsed content display, and analysis results.

/analytics provides detailed performance analytics with trend visualization and improvement recommendations.

/achievements displays earned and available achievements with progress tracking.

/settings enables user preference management including language and notification settings.

### 4.2 Component Hierarchy

**Page Components (Routes):**

LandingPage renders the marketing homepage with hero section, features, and calls to action.

SignInPage presents the Clerk authentication interface with email and OAuth provider options.

SignUpPage provides the Clerk registration flow with account creation steps.

DashboardPage serves as the authenticated hub with overview cards, recent activity feed, quick action buttons, and progress visualizations.

PracticeConfigPage provides interview session configuration with mode selection, difficulty adjustment, and targeting options.

InterviewSessionPage renders the active interview interface with real-time interaction capabilities.

HistoryPage displays searchable, filterable interview history with detail navigation.

ResumesPage manages resume collection with upload interface and parsed content display.

AnalyticsPage provides performance dashboards with trend charts and improvement recommendations.

SettingsPage enables user preference configuration across multiple categories.

**Smart Components (Data and Logic):**

ClerkProvider wraps the application to enable Clerk authentication state access throughout the component tree.

InterviewSessionProvider manages active session state including messages, timing, and status transitions.

SpeechRecognitionProvider wraps Web Speech API for speech-to-text conversion with language configuration.

SpeechSynthesisProvider manages text-to-speech output with voice selection and playback control.

AIController handles AI API communication including request queuing, response parsing, and error recovery.

ProgressTracker aggregates performance data for dashboard display and analytics.

**UI Components (Presentation):**

Button, Input, Select, Textarea, Checkbox, RadioGroup provide form controls with consistent styling and validation integration.

Card, Accordion, Badge, Alert, Toast provide information display with appropriate visual hierarchy.

Modal, Dialog, Sheet, Popover provide overlay interfaces for focused interactions.

Table, DataTable provide structured data display with sorting and pagination.

Progress, Skeleton provide loading and progress indicators.

Avatar, DropdownMenu, NavigationMenu provide navigation and user interface elements.

**Specialized Components:**

AudioVisualizer renders animated visualization synchronized with speech output, creating the sense of a present interviewer.

TranscriptDisplay shows real-time conversation transcript with speaker attribution and timestamp alignment.

FeedbackReport presents post-interview analysis with score breakdown and improvement suggestions.

QuestionCard displays individual question content with language toggle and answer reveal controls.

ResumeUploader handles drag-and-drop file upload with parsing progress indication.

LanguageToggle provides instant language switching for bilingual interface elements.

### 4.3 State Management Architecture

**Global State (Zustand):**

useAuthStore accesses Clerk authentication state including user profile, session status, and sign-out functionality.

useInterviewStore manages active interview session state including messages, timing, and configuration.

useSpeechStore manages speech recognition and synthesis state including language settings and voice selection.

usePreferencesStore manages user configuration including theme, language preference, and notification settings.

**Local State (React Hooks):**

useDebounce provides input debouncing for search and filter operations.

useMediaQuery provides responsive design breakpoint detection.

useLocalStorage persists non-sensitive user preferences to local storage.

useSpeechRecognition wraps browser speech recognition with error handling and state management.

**Server State (TanStack Query):**

useQuery hooks manage server state for data fetching with caching, refetching, and error handling.

useMutation hooks manage server state for data mutations with optimistic updates and error recovery.

Query keys follow consistent naming conventions that enable easy cache invalidation.

### 4.4 Internationalization

**next-intl Integration:**

Translation files organize content by locale and namespace:

```
messages/
  en.json
  bn.json
```

Keys follow hierarchical naming conventions that enable logical grouping:

```json
{
  "common": {
    "appName": "InterPrep AI",
    "loading": "Loading...",
    "error": "An error occurred"
  },
  "interview": {
    "title": "Interview Practice",
    "start": "Start Interview",
    "end": "End Interview"
  }
}
```

**Dynamic Language Switching:**

The LanguageToggle component updates the active locale in state and configuration, triggering UI updates without page reload. AI conversation context includes language mode that persists across messages.

---

## Phase 5: Implementation Roadmap

### 5.1 Phase 1: Foundation (Days 1-5)

**Day 1: Project Setup and Infrastructure**

Initialize Next.js 16 project with TypeScript, Tailwind CSS v4, and shadcn/ui installation. Configure ESLint with accessibility and security rules. Set up Clerk account and configure publishable/secret keys. Set up MongoDB Atlas cluster with connection pooling. Configure environment variables for Clerk authentication, database URI, and AI API keys. Establish project folder structure with clear separation between components, hooks, services, and types. Create database connection utilities with Mongoose models for users and sessions.

**Day 2: Clerk Authentication Integration**

Configure Clerk middleware for route protection. Implement sign-in and sign-up pages using Clerk components. Create webhook endpoint for Clerk events. Build user synchronization logic to create MongoDB records on registration. Test authentication flow including OAuth providers. Implement protected route redirect behavior.

**Day 3: Basic UI Foundation**

Implement the main layout with navigation sidebar and header. Create reusable UI components from shadcn/ui with Tailwind styling. Build the landing page with hero section and features display. Implement responsive design for mobile and desktop layouts. Create loading states and error boundaries. Establish design system tokens and component variants.

**Day 4: Question Bank Foundation**

Create QuestionBank collection schema and CRUD operations. Build admin interface for question creation with bilingual input fields. Implement question categorization system with category, subcategory, and difficulty attributes. Create seed data scripts for initial question bank population. Build API endpoints for question retrieval with filtering and pagination.

**Day 5: Database Models and Connections**

Implement User model with Clerk ID reference. Create Session model with message and feedback schemas. Build Resume model with parsed content structure. Implement Progress model for daily tracking. Create database indexes for query optimization. Write connection utility with proper error handling and retry logic.

### 5.2 Phase 2: Core Interview Functionality (Days 6-10)

**Day 6: Speech Recognition Integration**

Implement Web Speech API integration for speech-to-text conversion. Create SpeechRecognitionProvider with language configuration for English and Bengali. Build voice input controls with visual feedback during listening state. Handle browser compatibility issues with fallback text input. Implement error handling for microphone permission denial.

**Day 7: AI Gateway Implementation**

Create AI Gateway abstraction with provider interface. Implement Gemini Flash 1.5 integration with prompt engineering for interview scenarios. Build fallback routing to Groq Llama 3 for rate limit scenarios. Create prompt templates for different interview types and difficulty levels. Implement response parsing for structured feedback extraction.

**Day 8: Interview Session Implementation**

Build the interview session page with real-time message display. Implement the conversation flow with user message submission and AI response generation. Create voice output integration with text-to-speech synthesis. Build the AudioVisualizer component synchronized with speech. Implement session state management with message persistence.

**Day 9: Session Completion and Feedback**

Create session completion flow with confirmation dialogs. Implement feedback generation algorithm analyzing conversation content. Build the FeedbackReport component with score breakdown and improvement suggestions. Implement progress tracking updates upon session completion. Create session history listing with detail navigation.

**Day 10: History and Review Features**

Build history page with search functionality across session content. Implement advanced filtering by date range, session type, and performance metrics. Create sortable columns for history table. Build quick review interface for past sessions. Implement transcript playback with synchronized highlighting.

### 5.3 Phase 3: Enhanced Features (Days 11-14)

**Day 11: Resume Builder and Analyzer**

Implement resume upload with file storage and parsing. Create PDF text extraction with pdf-parse library. Build resume display with parsed section rendering. Implement AI-powered resume analysis against job descriptions. Create improvement suggestion display with actionable recommendations.

**Day 12: Bilingual Support Implementation**

Implement internationalization with next-intl for English and Bengali. Create translation files for all interface text. Build language toggle with persistent state. Update AI prompts for bilingual support with language-aware responses. Implement bilingual question display with synchronized translations.

**Day 13: Progress Tracking and Gamification**

Build progress dashboard with statistics visualization. Implement achievement system with badge definitions and earning criteria. Create streak tracking with daily activity monitoring. Build analytics page with trend charts and performance breakdowns. Implement goal setting with progress notifications.

**Day 14: Settings and User Preferences**

Implement settings page with preference management. Build language preference toggle. Create experience level and target role selection. Implement notification settings configuration. Build account information display with Clerk profile integration.

### 5.4 Phase 5: Testing and Deployment (Days 15-18)

**Day 15: Quality Assurance**

Implement unit tests for critical utility functions. Create integration tests for API endpoints. Build component tests for key UI elements. Implement AI response validation tests. Create performance tests for database queries.

**Day 16: Security and Performance**

Implement rate limiting for all API endpoints. Add input validation and sanitization throughout. Configure security headers including CSP. Perform accessibility audit and fix identified issues. Optimize images and static assets.

**Day 17: Monitoring and Observability**

Set up error tracking with proper context logging. Configure performance monitoring for key user flows. Implement usage analytics for feature adoption. Create dashboards for system health monitoring. Set up alerting for error rate thresholds.

**Day 18: Deployment and Launch**

Deploy to Vercel with environment configuration. Set up MongoDB Atlas with backup automation. Configure custom domain and SSL. Perform final smoke testing across all features. Monitor deployment health and address issues. Document deployment process and runbooks.

---

## 6. Database Schema Definitions

### 6.1 MongoDB Models

```javascript
// lib/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  preferredLanguage: {
    type: String,
    enum: ['en', 'bn', 'both'],
    default: 'en'
  },
  targetRole: {
    type: String
  },
  targetIndustry: {
    type: String
  },
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive']
  },
  timezone: {
    type: String,
    default: 'Asia/Dhaka'
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
```

```javascript
// lib/models/InterviewSession.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'ai', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  audioUrl: String,
  timestamp: {
    type: Date,
    default: Date.now
  },
  transcriptionConfidence: Number,
  durationMs: Number
}, { _id: false });

const ImprovementSchema = new mongoose.Schema({
  category: String,
  description: String,
  suggestedResponse: String,
  explanation: String
}, { _id: false });

const ResourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['article', 'video', 'practice']
  },
  title: String,
  url: String
}, { _id: false });

const InterviewSessionSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    index: true
  },
  sessionType: {
    type: String,
    enum: ['behavioral', 'technical', 'general', 'mock'],
    required: true
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'aborted'],
    default: 'in_progress'
  },
  difficultyLevel: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'adaptive'],
    default: 'adaptive'
  },
  languageMode: {
    type: String,
    enum: ['en', 'bn', 'mixed'],
    default: 'en'
  },
  targetRole: String,
  targetCompany: String,
  messages: [MessageSchema],
  feedback: {
    overallScore: Number,
    contentScore: Number,
    languageScore: Number,
    confidenceScore: Number,
    strengths: [String],
    improvements: [ImprovementSchema],
    suggestedResources: [ResourceSchema]
  },
  duration: Number,
  questionsCompleted: Number,
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
}, {
  timestamps: true
});

InterviewSessionSchema.index({ clerkId: 1, createdAt: -1 });

export default mongoose.models.InterviewSession || 
  mongoose.model('InterviewSession', InterviewSessionSchema);
```

```javascript
// lib/models/Question.js
import mongoose from 'mongoose';

const CriterionSchema = new mongoose.Schema({
  criterion: String,
  description: String,
  keywords: [String],
  maxPoints: Number
}, { _id: false });

const QuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    index: true
  },
  subcategory: String,
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  questionEn: {
    type: String,
    required: true
  },
  questionBn: String,
  modelAnswerEn: String,
  modelAnswerBn: String,
  evaluationCriteria: [CriterionSchema],
  tags: [String],
  usageCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: String,
    enum: ['admin', 'ai-generated'],
    default: 'ai-generated'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

QuestionSchema.index({ category: 1, subcategory: 1 });
QuestionSchema.index({ tags: 1 });
QuestionSchema.index({ isActive: 1 });

export default mongoose.models.Question || 
  mongoose.model('Question', QuestionSchema);
```

```javascript
// lib/models/Resume.js
import mongoose from 'mongoose';

const ResumeSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    index: true
  },
  fileName: String,
  fileUrl: String,
  fileSize: Number,
  mimeType: String,
  extractedText: String,
  parsedSections: {
    summary: String,
    experience: [{
      title: String,
      company: String,
      duration: String,
      description: String
    }],
    education: [{
      institution: String,
      degree: String,
      year: String
    }],
    skills: [String],
    certifications: [String]
  },
  analysis: {
    overallScore: Number,
    atsScore: Number,
    missingKeywords: [String],
    improvementSuggestions: [{
      section: String,
      suggestion: String,
      importance: String
    }]
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

ResumeSchema.index({ clerkId: 1, isDefault: 1 });

export default mongoose.models.Resume || 
  mongoose.model('Resume', ResumeSchema);
```

```javascript
// lib/models/Progress.js
import mongoose from 'mongoose';

const ProgressSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  interviewsCompleted: {
    type: Number,
    default: 0
  },
  totalQuestionsAnswered: {
    type: Number,
    default: 0
  },
  averageScore: Number,
  timeSpentMinutes: {
    type: Number,
    default: 0
  },
  focusAreas: [String],
  achievements: [{
    achievementId: String,
    earnedAt: Date
  }],
  streaks: {
    current: {
      type: Number,
      default: 0
    },
    longest: {
      type: Number,
      default: 0
    },
    lastActivityDate: Date
  }
}, {
  timestamps: true
});

export default mongoose.models.Progress || 
  mongoose.model('Progress', ProgressSchema);
```

### 6.2 Database Connection Utility

```javascript
// lib/mongodb.js
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
```

---

## 7. Environment Configuration

### 7.1 Required Environment Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# MongoDB
MONGODB_URI=mongodb+srv://...

# AI Providers
GEMINI_API_KEY=AI...
GROQ_API_KEY=gsk_...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 7.2 Clerk Webhook Configuration

The Clerk webhook endpoint requires additional configuration for production deployment:

```javascript
// pages/api/webhooks/clerk.js (Pages Router) or
// app/api/webhooks/clerk/route.js (App Router)
import { headers } from 'next/headers';
import { Webhook } from 'svix';
import User from '@/lib/models/User';

export async function POST(req) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  // Get headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are none
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create Svix instance with secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;

  // Verify payload with headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    
    try {
      await User.create({
        clerkId: id,
        email: email_addresses[0]?.email_address || '',
        name: [first_name, last_name].filter(Boolean).join(' ') || null,
        lastLoginAt: new Date()
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    
    try {
      await User.findOneAndUpdate(
        { clerkId: id },
        {
          email: email_addresses[0]?.email_address || '',
          name: [first_name, last_name].filter(Boolean).join(' ') || null,
        }
      );
    } catch (error) {
      console.error('Error updating user:', error);
      return new Response('Error updating user', { status: 500 });
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;
    
    try {
      await User.findOneAndDelete({ clerkId: id });
    } catch (error) {
      console.error('Error deleting user:', error);
      return new Response('Error deleting user', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}
```

---

## 8. Acceptance Criteria and Testing

### 8.1 Authentication Testing

**Clerk Integration Verification:**

Verify that Clerk middleware correctly redirects unauthenticated users away from protected routes. Confirm that sign-in and sign-up pages render correctly with Clerk components. Test OAuth provider flow with Google authentication. Verify that webhook endpoint correctly creates MongoDB user records on registration. Ensure that user data synchronizes correctly between Clerk and MongoDB.

### 8.2 Interview Functionality Testing

**Voice Input Verification:**

Verify that microphone permission prompt appears on first voice input attempt. Confirm that speech recognition captures English speech with reasonable accuracy. Verify that Bengali speech recognition works with appropriate script support. Ensure that fallback to text input is available when voice fails.

**AI Response Verification:**

Verify that AI responses appear within 5 seconds of user message submission. Confirm that responses are contextually appropriate for the interview scenario. Ensure that bilingual support activates when users request Bengali explanations. Verify that fallback routing works when primary AI provider returns rate limit errors.

**Feedback Generation Verification:**

Verify that post-interview feedback includes scores across all dimensions. Confirm that improvement suggestions are specific and actionable. Ensure that suggested responses demonstrate better alternatives. Verify that resource recommendations are relevant to identified improvement areas.

### 8.3 Performance Testing

**Response Time Verification:**

Verify that initial page loads complete within 2 seconds on standard connections. Confirm that AI responses generate within 5 seconds for typical scenarios. Ensure that database queries execute within 100 milliseconds for standard operations. Verify that audio playback starts within 500 milliseconds of AI response generation.

### 8.4 Security Testing

**Authentication Security:**

Verify that Clerk session tokens are properly validated on protected routes. Confirm that API routes reject requests without valid authentication. Test that webhook signatures are properly validated. Ensure that user data isolation prevents access to other users' sessions.

---

## 9. Deployment Architecture

### 9.1 Frontend Deployment (Vercel)

The Next.js application deploys to Vercel with automatic GitHub integration for continuous deployment. Environment variables configure database connections, AI API keys, and Clerk authentication credentials. Edge middleware implements authentication verification and route protection.

**Environment Configuration:**

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
MONGODB_URI=mongodb+srv://...
GEMINI_API_KEY=AI...
GROQ_API_KEY=gsk_...
NEXT_PUBLIC_APP_URL=https://interprep.ai
```

### 9.2 Database Configuration (MongoDB Atlas)

MongoDB Atlas hosts the production database with geographic replica set distribution for low-latency access. Daily automated backups protect against data loss with 35-day retention. Performance alerts notify of slow queries or connection pool exhaustion.

**Security Configuration:**

Network access restricts connections to Vercel IP ranges and developer IPs. Encryption at rest protects stored data regardless of access point. Encryption in transit uses TLS for all connections. Database credentials rotate quarterly with automated enforcement.

### 9.3 Monitoring and Observability

**Error Tracking:**

Error tracking captures uncaught exceptions and rejected promises with full context including user ID, request path, and stack traces. Error severity classification enables appropriate alert routing and response prioritization. Error trends analysis identifies systematic issues requiring architectural fixes.

**Performance Monitoring:**

APM instrumentation tracks endpoint response times, database query performance, and external API latency. User experience monitoring captures Core Web Vitals metrics for performance analysis. Custom dashboards visualize key metrics with alerting on threshold breaches.

---

## 10. Code Quality Standards and Learning-Focused Documentation

This section establishes the coding standards and documentation practices that ensure the codebase serves both as a functional application and a comprehensive learning resource. Every implementation decision prioritizes readability and understanding, enabling developers to not only use the code but deeply comprehend the architectural patterns and design decisions employed throughout.

### 10.1 Clear Naming Conventions

Consistent and descriptive naming forms the foundation of readable code. Variable, function, and component names should immediately convey their purpose without requiring examination of implementation details. The naming conventions establish a vocabulary that developers internalize as they explore the codebase, reducing cognitive overhead when navigating between files and features.

**Variable and Function Names:**

All variable and function names follow camelCase convention with descriptive identifiers that explain their purpose. Generic names like "data" or "temp" are prohibited in favor of specific names like "userSession" or "temporaryCache." Boolean variables begin with auxiliary verbs like "is," "has," or "can" to clearly indicate their truthy nature, such as "isAuthenticated," "hasError," or "canProceed." Function names describe actions using verb-noun patterns like "createSession," "validateInput," or "fetchQuestions."

```typescript
// ❌ Poor naming examples
const d = new Date();
const temp = fetchData();
function process() { ... }

// ✅ Excellent naming examples
const currentTimestamp = new Date();
const pendingInterviewSessions = fetchInterviewSessions();
function validateSessionInput(input: SessionInput): ValidationResult { ... }
```

**Component Names:**

React components follow PascalCase convention with descriptive names that indicate their role and content. Compound names combine functional descriptors with domain concepts, such as "InterviewSessionCard" or "FeedbackReportGenerator." Helper components that support larger components use prefixed names like "InterviewSessionHeader" or "FeedbackScoreBadge" to establish clear relationships.

**Constants and Configuration:**

Constants use SCREAMING_SNAKE_CASE with names that clearly communicate their purpose and scope. Configuration objects use camelCase with descriptive keys that explain their function. Group-related constants under namespace objects to prevent global namespace pollution while maintaining discoverability.

```typescript
// ✅ Excellent constant naming
const AI_PROVIDER_TIMEOUT_MS = 30000;
const MAX_RETRY_ATTEMPTS = 3;

const SessionStatus = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABORTED: 'aborted',
} as const;

const APIEndpoints = {
  CREATE_SESSION: '/api/interviews/create',
  GET_HISTORY: '/api/interviews/history',
  UPLOAD_RESUME: '/api/resumes/upload',
} as const;
```

### 10.2 Comprehensive Comment Strategy

Comments serve as documentation within code, explaining not just what the code does but why it was written that way. The commenting strategy distinguishes between necessary technical documentation and obvious code that requires no explanation. Comments update alongside code changes to prevent documentation drift where comments describe behavior that no longer matches implementation.

**Inline Implementation Comments:**

Complex algorithms and non-obvious logic include inline comments that explain the approach and any trade-offs considered. These comments appear above the relevant code block rather than inline with it, preserving code readability while providing context for understanding.

```typescript
/**
 * Generates contextual interview questions based on user profile and target role.
 *
 * Strategy: We first retrieve the user's target role and experience level from
 * their profile, then query the question bank for matching difficulty levels.
 * If insufficient questions exist at the exact difficulty, we fall back to
 * adjacent difficulty levels to ensure interview variety.
 *
 * Performance consideration: Questions are cached in-memory during the session
 * to prevent redundant database queries for repeated question access.
 */
function generateInterviewQuestions(
  userProfile: UserProfile,
  sessionConfig: SessionConfig
): Question[] {
  // Fetch base questions matching user's target role and experience level
  const baseQuestions = await questionRepository.findByDifficulty(
    userProfile.targetRole,
    userProfile.experienceLevel
  );

  // If insufficient questions available, expand search to adjacent difficulty levels
  if (baseQuestions.length < MIN_QUESTIONS_PER_SESSION) {
    const adjacentQuestions = await questionRepository.findByDifficultyRange(
      userProfile.targetRole,
      userProfile.experienceLevel - 1,
      userProfile.experienceLevel + 1
    );
    // Merge and deduplicate results
    return [...new Set([...baseQuestions, ...adjacentQuestions])].slice(0, MAX_QUESTIONS);
  }

  return baseQuestions.slice(0, MAX_QUESTIONS);
}
```

**Function Documentation (JSDoc):**

All exported functions, hooks, and utility classes include JSDoc comments that document parameters, return values, and usage examples. TypeScript interfaces provide additional documentation through their structure, with JSDoc supplementing with context about usage patterns and constraints.

```typescript
/**
 * Creates a new interview session for the authenticated user.
 *
 * @param clerkId - The unique identifier from Clerk authentication
 * @param sessionConfig - Configuration options for the session
 * @returns Promise resolving to the created session document
 *
 * @example
 * ```typescript
 * const session = await createInterviewSession('user_123', {
 *   sessionType: 'technical',
 *   difficultyLevel: 'medium',
 *   targetRole: 'Frontend Developer'
 * });
 * ```
 *
 * @throws {ValidationError} If session configuration is invalid
 * @throws {AuthenticationError} If clerkId is not authenticated
 */
async function createInterviewSession(
  clerkId: string,
  sessionConfig: SessionConfig
): Promise<InterviewSession> {
  // Implementation...
}
```

**Bilingual Comments for Learning:**

Where helpful for understanding complex concepts, comments include Bengali translations alongside English explanations. This dual-language documentation supports learners who prefer Bengali explanations for technical concepts while maintaining accessibility for international collaborators.

```typescript
/**
 * AI Gateway handles request routing between multiple AI providers.
 *
 * AI Gateway একাধিক AI provider এর মধ্যে request routing করে।
 * প্রাইমারি provider Gemini, fallback provider Groq।
 *
 * Primary provider (Gemini): High free tier limits, excellent quality
 * Fallback provider (Groq): Fast inference, used when Gemini rate-limited
 */
class AIGateway {
  // Implementation...
}
```

### 10.3 Modular Architecture Principles

The codebase follows modular design principles that separate concerns into distinct, focused modules. Each module has a single responsibility and exposes a clear interface for interaction. This modularity enables understanding of individual components without requiring comprehension of the entire system, facilitating both learning and maintenance.

**File Organization Structure:**

The project directory structure reflects logical separation of concerns, making it intuitive to locate related files and understand the system's organization.

```
src/
├── app/                      # Next.js App Router pages
│   ├── (auth)/              # Authentication routes
│   ├── (dashboard)/         # Protected application routes
│   └── api/                 # API route handlers
├── components/              # React components
│   ├── ui/                  # Base UI components (shadcn)
│   ├── interview/           # Interview-specific components
│   ├── dashboard/           # Dashboard components
│   └── resumes/             # Resume-related components
├── lib/                     # Core utilities and configurations
│   ├── models/              # Mongoose schemas
│   ├── services/            # Business logic services
│   ├── utils/               # Helper functions
│   └── config.ts            # Application configuration
├── hooks/                   # Custom React hooks
├── stores/                  # Zustand state stores
├── types/                   # TypeScript type definitions
├── messages/                # Internationalization messages
└── styles/                  # Global styles
```

**Single Responsibility Principle:**

Each function performs one task and performs it well. Functions exceeding twenty lines are candidates for refactoring into smaller, focused helpers. Components split by concern rather than page, with presentational components separated from logic-containing components.

```typescript
// ❌ Violates single responsibility
async function processInterviewSession(sessionId: string) {
  // Validates session
  // Fetches messages
  // Generates AI feedback
  // Updates database
  // Sends notification
}

// ✅ Follows single responsibility
async function validateSession(sessionId: string): Session { ... }
async function generateFeedback(session: Session): Feedback { ... }
async function saveFeedback(sessionId: string, feedback: Feedback): void { ... }
async function notifySessionComplete(session: Session): void { ... }

async function processInterviewSession(sessionId: string) {
  const session = await validateSession(sessionId);
  const feedback = await generateFeedback(session);
  await saveFeedback(sessionId, feedback);
  await notifySessionComplete(session);
}
```

**Explicit Dependencies:**

All dependencies are imported explicitly rather than relying on global state or implicit availability. This explicit declaration makes dependencies clear and enables easier testing through dependency injection.

```typescript
// ✅ Explicit dependency injection
interface InterviewServiceDependencies {
  questionRepository: QuestionRepository;
  aiGateway: AIGateway;
  userRepository: UserRepository;
}

function createInterviewService(deps: InterviewServiceDependencies) {
  return {
    async createSession(...): Promise<InterviewSession> {
      // Use deps.questionRepository, deps.aiGateway, deps.userRepository
    },
  };
}

// Usage with real dependencies
const interviewService = createInterviewService({
  questionRepository: new QuestionRepository(),
  aiGateway: new AIGateway(),
  userRepository: new UserRepository(),
});

// Usage with mock dependencies for testing
const mockInterviewService = createInterviewService({
  questionRepository: mockQuestionRepository,
  aiGateway: mockAIGateway,
  userRepository: mockUserRepository,
});
```

### 10.4 Consistent Formatting and Style

The codebase enforces consistent formatting through ESLint and Prettier configuration, eliminating debates about style while ensuring all code meets established standards. The configuration extends from recommended base configurations with custom rules addressing project-specific needs.

**ESLint Configuration Principles:**

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',    // Next.js best practices
    'plugin:@typescript-eslint/recommended',  // TypeScript rules
    'plugin:react-hooks/recommended', // React hooks best practices
    'prettier',                // Disable rules handled by Prettier
  ],
  rules: {
    // Enforce descriptive variable names
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'forbidden',
      },
    ],
    // Require JSDoc for exported functions
    'jsdoc/require-jsdoc': [
      'error',
      { publicOnly: true, require: { FunctionDeclaration: true } },
    ],
    // Prevent any type usage
    '@typescript-eslint/no-explicit-any': 'error',
    // Prefer const over let
    'prefer-const': 'error',
  },
};
```

**Prettier Configuration:**

```javascript
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

**Code Style Guidelines:**

Line length maximum is 100 characters to maintain readability on standard screens. Deeply nested code (more than three levels) is refactored into named functions. Ternary operators used only for simple conditions; complex logic expressed in if-else blocks for clarity. Early returns preferred at function tops for validation and edge cases, reducing cognitive load for the main logic path.

### 10.5 TypeScript for Clarity and Safety

TypeScript provides self-documenting code through explicit type definitions that serve as living documentation. The type system catches errors at compile time rather than runtime, reducing debugging time while teaching developers about data structures and their constraints.

**Explicit Type Annotations:**

Function parameters and return values include explicit type annotations rather than relying on type inference. This practice forces consideration of types during implementation and provides immediate visibility into function contracts.

```typescript
// ❌ Relies on inference
function processSession(session) {
  return session.messages.map(m => m.content);
}

// ✅ Explicit types clarify contract
function extractMessages(session: InterviewSession): string[] {
  return session.messages.map((message: Message): string => message.content);
}
```

**Interface Definitions for Domain Objects:**

Domain objects use interfaces that document their structure and relationships. Interfaces co-located with related code in the same file or adjacent files, grouped by domain rather than technical layer.

```typescript
/**
 * Represents a single message within an interview session.
 *
 * Message role distinguishes between user input, AI responses,
 * and system-level messages like session configuration.
 */
export interface Message {
  /** 'user' | 'ai' | 'system' - Identifies message source */
  role: MessageRole;

  /** The actual text content of the message */
  content: string;

  /** Optional URL to audio recording for voice-based interactions */
  audioUrl?: string;

  /** When the message was sent/received */
  timestamp: Date;

  /** Speech-to-text confidence score (0-1) when applicable */
  transcriptionConfidence?: number;

  /** Duration in milliseconds for audio messages */
  durationMs?: number;
}

/** Type union for valid message roles */
export type MessageRole = 'user' | 'ai' | 'system';

/** Complete interview session document */
export interface InterviewSession {
  id: string;
  clerkId: string;
  sessionType: SessionType;
  status: SessionStatus;
  difficultyLevel: DifficultyLevel;
  languageMode: LanguageMode;
  targetRole?: string;
  targetCompany?: string;
  messages: Message[];
  feedback?: SessionFeedback;
  duration?: number;
  questionsCompleted?: number;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

**Discriminated Unions for State Management:**

Complex state with mutually exclusive conditions uses discriminated unions for compile-time exhaustiveness checking and clear state transitions.

```typescript
/** Union type covering all interview session states */
export type InterviewSessionState =
  | { status: 'idle' }
  | { status: 'initializing'; targetRole: string }
  | { status: 'in_progress'; sessionId: string; messages: Message[] }
  | { status: 'generating_feedback'; progress: number }
  | { status: 'completed'; feedback: SessionFeedback }
  | { status: 'error'; message: string };

/**
 * Reducer demonstrating type-safe state transitions.
 * TypeScript ensures all cases are handled.
 */
function interviewReducer(
  state: InterviewSessionState,
  action: InterviewAction
): InterviewSessionState {
  switch (action.type) {
    case 'START_SESSION':
      return state.status === 'idle'
        ? { status: 'initializing', targetRole: action.targetRole }
        : state;

    case 'SESSION_CREATED':
      return state.status === 'initializing'
        ? { status: 'in_progress', sessionId: action.sessionId, messages: [] }
        : state;

    case 'RECEIVE_MESSAGE':
      return state.status === 'in_progress'
        ? { ...state, messages: [...state.messages, action.message] }
        : state;

    case 'GENERATE_FEEDBACK':
      return state.status === 'in_progress'
        ? { status: 'generating_feedback', progress: 0 }
        : state;

    case 'FEEDBACK_COMPLETE':
      return state.status === 'generating_feedback'
        ? { status: 'completed', feedback: action.feedback }
        : state;

    case 'SET_ERROR':
      return { status: 'error', message: action.message };

    case 'RESET':
      return { status: 'idle' };

    default:
      // Exhaustiveness check - ensures all cases handled
      const _exhaustive: never = action;
      return state;
  }
}
```

### 10.6 Progressive Complexity and Learning Path

The codebase introduces concepts progressively, with simpler patterns established before more advanced techniques. Developers can understand fundamental features before encountering complex patterns, building knowledge systematically.

**Layered Introduction of Concepts:**

The implementation order follows a learning progression rather than feature dependencies. Basic CRUD operations introduce database patterns before AI integration. Simple state management demonstrates concepts before advanced patterns like optimistic updates. Local components establish patterns before distributed state across services.

**Component Complexity Gradient:**

UI components start as simple presentational elements and evolve into connected components with data fetching and state management. This progression allows developers to understand each layer independently before combining them.

```typescript
// Level 1: Pure presentational component
// File: components/ui/Button.tsx
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive';
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant }))}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Level 2: Connected component with local state
// File: components/interview/VoiceInput.tsx
export function VoiceInput({ onTranscript }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const toggleListening = useCallback(() => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  }, [isListening]);

  // Level 3 would add error handling, retry logic, and fallback to text input
}
```

**Pattern Documentation:**

Each major pattern introduced includes documentation explaining its purpose, benefits, and when to use it. These documentation sections serve as educational content for developers learning modern React patterns.

```typescript
/**
 * Custom Hook Pattern
 * ===================
 *
 * Custom hooks extract and share stateful logic between components.
 * They follow the pattern of starting with "use" and can call other hooks.
 *
 * Benefits:
 * - Reusable logic across multiple components
 * - Clean component code focused on rendering
 * - Easy to test in isolation
 *
 * Example:
 * ```typescript
 * function useSpeechRecognition(language: Language) {
 *   const [transcript, setTranscript] = useState('');
 *   const [isListening, setIsListening] = useState(false);
 *
 *   // Recognition setup and event handlers...
 *
 *   return { transcript, isListening, start, stop };
 * }
 * ```
 *
 * Usage in component:
 * ```typescript
 * const { transcript, isListening, start } = useSpeechRecognition('en-US');
 * ```
 */
```

### 10.7 Documentation Structure

Documentation exists at multiple levels, from inline comments to architectural decision records, providing learning resources at every level of abstraction.

**README Documentation Structure:**

```markdown
# InterPrep AI

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure

- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - React components organized by feature
- `src/lib/` - Core utilities, models, and services
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript type definitions

## Key Concepts

### Authentication
Uses Clerk for authentication with webhook synchronization to MongoDB.
See: [Authentication Guide](./docs/authentication.md)

### AI Integration
Multi-provider gateway routing between Gemini and Groq.
See: [AI Gateway Documentation](./docs/ai-gateway.md)

### State Management
Zustand for global state, React Context for dependency injection.
See: [State Management Guide](./docs/state-management.md)
```

**Architecture Decision Records (ADRs):**

Major architectural decisions include ADRs that document the problem, considered options, and reasoning for the selected approach. These records preserve context for future maintainers and serve as learning resources for understanding design trade-offs.

```markdown
# ADR-001: Next.js Monolith Architecture

## Status
Accepted

## Context
We needed to choose an architecture that balances development velocity
with long-term maintainability for an MVP interview preparation platform.

## Decision
We will use Next.js Monolith architecture with Server Actions and API Routes
for all backend functionality within the same codebase as the frontend.

## Consequences

### Positive
- Single deployment pipeline
- End-to-end TypeScript
- Simplified development workflow
- Serverless scaling without separate infrastructure

### Negative
- Less flexible for microservices decomposition
- Tighter coupling between frontend and backend logic

## Learning Resources
- Next.js Server Actions documentation
- Monolith vs Microservices trade-offs
```

**Component Documentation:**

Each component file includes documentation header explaining its purpose, props, and usage examples. Complex components include embedded documentation for internal helpers and state machine transitions.

---

## 11. Conclusion

This Technical Design Document provides the complete specification for implementing InterPrep AI as a free-to-use MVP interview preparation platform. The architecture prioritizes development velocity through the Next.js Monolith approach, rapid authentication implementation through Clerk integration, and cost-effective AI operation through multi-provider gateway routing.

The deferred monetization features (Stripe integration, subscription tiers, enterprise features) can be added following MVP validation and market traction. The modular architecture ensures that future feature additions integrate cleanly without requiring fundamental restructuring.

The recommended Next.js Monolith approach balances immediate development efficiency against long-term scalability, providing a clear migration path should the platform require separate service decomposition as user scale increases. All architectural decisions prioritize the core mission of helping job seekers improve their interview performance through accessible, AI-powered practice tools.

The code quality standards established in Section 10 ensure that the implementation serves not only as a functional application but as a comprehensive learning resource. Every code element prioritizes readability and understanding, enabling developers to internalize patterns and practices that transfer to future projects. The combination of clear naming, comprehensive documentation, progressive complexity, and consistent style creates a codebase that rewards careful study and supports continuous learning.
