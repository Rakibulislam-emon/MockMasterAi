# InterPrep AI

<div align="center">

**Master Your Interview Skills with AI-Powered Practice**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-purple)](https://clerk.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google-Gemini-blue)](https://gemini.google.com/)
[![Groq](https://img.shields.io/badge/Groq-Llama3-orange)](https://groq.com/)

A comprehensive AI-powered interview preparation platform built with Next.js 15, featuring realistic mock interviews, voice interaction, instant feedback, and bilingual support.

[Features](#features) • [Quick Start](#quick-start) • [Environment Variables](#environment-variables) • [Deployment](#deployment)

</div>

---

## 🚀 Features

### Core Features

- **AI-Powered Interviews**: Practice with intelligent AI that asks relevant questions, adapts to your responses, and provides realistic conversation
- **Voice Interaction**: Speak your answers using Web Speech API for realistic interview practice
- **Instant Feedback**: Get detailed feedback on answers, grammar, and communication style
- **Bilingual Support**: Full support for English and Bengali (বাংলা) throughout the platform
- **Resume Analysis**: Upload your resume and get AI-powered suggestions for improvement
- **Progress Tracking**: Track your improvement over time with detailed analytics
- **Gamification**: Stay motivated with achievements, streaks, and progress metrics

### Technical Highlights

- **Next.js 15 App Router**: Modern full-stack React framework
- **TypeScript**: End-to-end type safety
- **Clerk Authentication**: Secure, production-ready auth
- **MongoDB with Mongoose**: Flexible document storage
- **AI Gateway**: Multi-provider AI routing (Gemini + Groq)
- **Tailwind CSS + shadcn/ui**: Beautiful, accessible components
- **Server Actions**: No API routes needed for mutations

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 20.x or higher
- **npm** or **yarn** or **pnpm**
- **MongoDB Atlas** account (free tier available)
- **Clerk** account (free tier available)
- **Google Cloud** account for Gemini API (free tier available)
- **Groq** account for Llama 3 (free tier available)

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/interprep-ai.git
cd interprep-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# MongoDB Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/interprep-ai

# Google AI (Gemini)
GOOGLE_API_KEY=AIzaSy_...

# Groq AI (Llama 3)
GROQ_API_KEY=gsk_...

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Set Up Database

Create a MongoDB Atlas cluster and get your connection string. The application will automatically create the necessary collections on first run.

### 5. Configure Clerk Webhooks

1. Go to your Clerk Dashboard → Webhooks
2. Create a webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy the webhook secret to `CLERK_WEBHOOK_SECRET`

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎯 Project Structure

```
interprep-ai/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── [locale]/           # Internationalized routes
│   │   │   ├── page.tsx        # Landing page
│   │   │   ├── dashboard/      # Protected dashboard
│   │   │   ├── practice/       # Interview practice
│   │   │   ├── resumes/        # Resume management
│   │   │   ├── history/        # Interview history
│   │   │   ├── settings/       # User settings
│   │   │   └── api/            # API routes
│   │   ├── globals.css         # Global styles
│   │   └── layout.tsx          # Root layout
│   ├── actions/                # Server Actions
│   │   ├── interview.ts        # Interview session actions
│   │   ├── user.ts             # User preference actions
│   │   └── resume.ts           # Resume actions
│   ├── components/             # React components
│   │   ├── ui/                 # Base UI components (shadcn)
│   │   └── ...
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-speech-recognition.ts
│   │   ├── use-speech-synthesis.ts
│   │   └── use-app-store.ts
│   ├── lib/                    # Core utilities
│   │   ├── models/             # Mongoose models
│   │   ├── ai/                 # AI service integrations
│   │   ├── mongodb.ts          # Database connection
│   │   └── utils.ts            # Utility functions
│   ├── types/                  # TypeScript definitions
│   ├── messages/               # i18n messages
│   │   ├── en.json
│   │   └── bn.json
│   └── middleware.ts           # Auth middleware
├── public/                     # Static assets
├── scripts/                    # Utility scripts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

---

## 🔑 Environment Variables

| Variable                            | Description               | Required |
| ----------------------------------- | ------------------------- | -------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key     | Yes      |
| `CLERK_SECRET_KEY`                  | Clerk secret key          | Yes      |
| `CLERK_WEBHOOK_SECRET`              | Clerk webhook secret      | Yes      |
| `MONGODB_URI`                       | MongoDB connection string | Yes      |
| `GOOGLE_API_KEY`                    | Google Gemini API key     | Yes      |
| `GROQ_API_KEY`                      | Groq API key              | Yes      |
| `NEXT_PUBLIC_APP_URL`               | Application URL           | Yes      |

---

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Docker

```bash
docker build -t interprep-ai .
docker run -p 3000:3000 interprep-ai
```

---

## 📚 Documentation

- [Architecture Overview](docs/architecture.md)
- [API Reference](docs/api.md)
- [Component Library](docs/components.md)
- [Deployment Guide](docs/deployment.md)

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Clerk](https://clerk.com/) - Authentication & User Management
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Google Gemini](https://gemini.google.com/) - AI Language Model
- [Groq](https://groq.com/) - Fast AI Inference
- [MongoDB](https://www.mongodb.com/) - Database

---

<div align="center">

**Built with ❤️ for job seekers everywhere**

</div>
# MockMasterAi
