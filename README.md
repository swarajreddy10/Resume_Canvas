# ResumeCanvas

> Full-stack AI-assisted resume builder: a free, open-source hobby project, mobile-first, built with agentic AI development.

**Live:** [resumecanvas.vercel.app](https://resumecanvas.vercel.app)

---

## Overview

ResumeCanvas is a career platform that helps professionals build ATS-optimized resumes using AI. It covers the full product surface: authentication, real-time resume editing, 5 professionally designed templates, AI-powered content generation, PDF export, public sharing, job application tracking, and analytics — all in a single Next.js 16 App Router application.

This project was built as a showcase of modern full-stack engineering combined with **agentic AI-assisted development** — using Claude Code (Anthropic), GitHub Copilot/Codex, and skills.sh agent skills to accelerate architecture, implementation, and continuous improvement while maintaining full human ownership of every technical decision.

---

## What It Does

| Feature | Description |
|---|---|
| **Resume Builder** | 6-section form (personal, experience, education, skills, projects, certifications) with real-time preview and auto-save |
| **5 Templates** | Executive, Tech, Corporate, Creative, Academic — all A4-optimized and ATS-compatible |
| **AI Bullet Generation** | Groq Llama 3.3 70B generates 4–6 action-oriented, metrics-driven bullets per role |
| **ATS Scoring** | 0–100 score with missing keyword detection and format compatibility checks |
| **Resume Review** | Section-by-section AI analysis with actionable feedback |
| **Keyword Optimizer** | Industry-specific keyword extraction and gap analysis |
| **Cover Letter Generator** | Context-aware AI cover letters tailored to job descriptions |
| **PDF Export** | Server-side Puppeteer rendering with browser pool management |
| **Public Sharing** | Public resume URLs with custom slugs and view count tracking |
| **Clone Resumes** | One-click resume duplication with full data copy |
| **Job Application Tracker** | Kanban-style status tracking with notes and follow-ups |
| **Analytics** | Resume view counts, download metrics, application funnel |
| **PWA** | Installable on mobile, service worker caching, offline-capable static routes |

---

## Tech Stack

### Frontend

| Package | Version | Role |
|---|---|---|
| Next.js | 16.2.0 | App Router, RSC, API routes, middleware |
| React | 19.2.4 | UI with Server + Client Components |
| TypeScript | 5.9.3 | Strict mode throughout |
| Tailwind CSS | 4.2.2 | Utility-first styling with custom design tokens |
| motion/react | 12.38.0 | Animations — spring physics, layout, AnimatePresence |
| Shadcn/ui + Radix | latest | Accessible component primitives |
| TanStack Query | 5.91.3 | Server state, caching, background refetch |
| React Hook Form | 7.71.2 | Performant forms with controlled validation |
| Zod | 4.3.6 | Schema validation (client + server) |
| Zustand | 5.0.12 | Lightweight client state |
| Immer | 11.1.4 | Immutable state updates |
| Plus Jakarta Sans | — | Primary UI typeface via next/font |

### Backend & Services

| Package | Version | Role |
|---|---|---|
| Bun | 1.3.4 | Runtime, package manager, test runner |
| MongoDB | 7.1.0 | Document database |
| Mongoose | 9.3.1 | ODM, schema validation, indexing |
| NextAuth.js | 5.0.0-beta.30 | JWT sessions, Google OAuth, credentials |
| Groq SDK | 1.1.1 | Llama 3.3 70B inference (AI features) |
| Puppeteer | 24.40.0 | Headless Chrome for PDF generation |
| Resend | 6.9.4 | Transactional email (password reset) |
| bcryptjs | 3.0.3 | Password hashing (10 rounds) |

### Tooling & Quality

| Tool | Version | Role |
|---|---|---|
| ESLint | 9.39.4 | Linting with TypeScript rules |
| Prettier | 3.8.1 | Code formatting |
| Husky + lint-staged | 9.1.7 | Pre-commit hooks |
| Playwright | 1.58.2 | End-to-end testing |
| TypeScript ESLint | 8.57.1 | TS-specific lint rules |

---

## Architecture

```
src/
├── app/
│   ├── (auth)/                    # Sign in, forgot password, reset password
│   ├── (dashboard)/               # Protected routes — layout with sidebar
│   │   ├── dashboard/             # Resume list + usage overview
│   │   ├── builder/[id]/          # Resume editor (856-line feature page)
│   │   ├── cover-letters/         # AI cover letter generator
│   │   ├── applications/          # Job application tracker
│   │   ├── analytics/             # Performance metrics
│   │   ├── career/                # Career recommendations
│   │   ├── profile/               # Account info + stats
│   │   └── settings/              # User preferences
│   ├── api/                       # 30 API routes
│   │   ├── auth/                  # NextAuth, forgot/reset password
│   │   ├── resumes/               # CRUD, PDF, ATS score, clone, slug, view tracking
│   │   ├── ai/                    # Bullets, review, ATS, keywords, cover letter, job match
│   │   ├── analytics/             # Resume + user + performance analytics
│   │   ├── applications/          # Job application CRUD
│   │   ├── cover-letters/         # Cover letter management
│   │   └── user/                  # Registration, stats
│   └── resume/[id]/               # Public resume view page
│
├── components/
│   ├── resume/templates/          # 5 A4 templates (inline styles, print-safe)
│   ├── resume/                    # TemplateRenderer, TemplateSelector, TemplateShowcase
│   ├── forms/                     # Per-section form components
│   ├── dashboard/                 # UsageLimits, stats widgets
│   ├── layout/                    # Sidebar navigation
│   └── ui/                        # Shadcn + custom primitives
│
├── lib/
│   ├── auth/config.ts             # NextAuth config (JWT, MongoDB adapter, callbacks)
│   ├── db/                        # Connection, models (User, Resume, JobApplication, CoverLetter)
│   ├── middleware/                # withAuth, withRateLimit, withValidation
│   ├── cache/                     # LRU memory cache + quota-aware layer
│   ├── security/                  # Rate limiting, input sanitization
│   └── email/                     # Resend integration
│
├── features/
│   ├── ai/services/               # Groq AI service, job matching
│   └── resume/services/           # PDF generation, browser pool
│
└── hooks/                         # useResumes, useSidebar, usePagination
```

### Key Design Decisions

**Route Groups** — `(auth)` and `(dashboard)` share separate layouts with no nesting overhead. The dashboard layout owns the sidebar; auth pages are bare.

**Templates as pure React** — all 5 templates render at 794×1123px (A4 at 96dpi) using only inline styles. No CSS-in-JS runtime, no Tailwind inside templates — ensures 1:1 fidelity between browser preview and Puppeteer PDF output.

**TemplateShowcase + ResizeObserver** — a single component handles scaling the A4 canvas to any container using a ResizeObserver-driven `scale` transform. Used in the landing carousel, builder preview, and template selector — three different modes, one component.

**Server-side PDF** — Puppeteer runs in a browser pool on the server. Each PDF request acquires a pooled Chromium instance, navigates to the resume's public URL, and captures a PDF — avoiding any client-side jank or font inconsistencies.

**Three-layer validation** — Zod on the client (React Hook Form), Zod again on the API route, and Mongoose schema validation at the database layer.

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/resumes` | List user resumes |
| POST | `/api/resumes` | Create resume |
| GET/PUT/DELETE | `/api/resumes/[id]` | Read, update, delete resume |
| POST | `/api/resumes/[id]/clone` | Duplicate resume |
| GET | `/api/resumes/[id]/pdf` | Generate and download PDF |
| POST | `/api/resumes/[id]/ats-score` | Run ATS analysis |
| POST | `/api/resumes/[id]/view` | Increment view count |
| GET | `/api/resumes/slug/[slug]` | Resolve resume by slug |
| POST | `/api/ai/generate-bullets` | AI bullet point generation |
| POST | `/api/ai/review-resume` | Full resume review |
| POST | `/api/ai/optimize` | ATS keyword optimization |
| POST | `/api/ai/analyze-keywords` | Keyword gap analysis |
| POST | `/api/ai/generate-cover-letter` | Cover letter generation |
| POST | `/api/ai/job-match` | Job description matching |
| POST | `/api/ai/interview-questions` | Interview prep questions |
| GET/POST | `/api/applications` | Job application tracking |
| GET | `/api/analytics/resume` | Resume analytics |
| GET | `/api/analytics/user` | User-level analytics |
| GET | `/api/analytics/performance` | Performance metrics |
| POST | `/api/auth/forgot-password` | Password reset email |
| POST | `/api/auth/reset-password` | Apply new password |
| POST | `/api/auth/validate-reset-token` | Token validation |
| POST | `/api/user/register` | New user registration |
| GET | `/api/user/stats` | User statistics |

**Rate limits:** 50 req/hr per signed-in user (AI endpoints) · 5 req/15 min per client IP and email (each auth endpoint, credentials sign-in included). Counts are kept per server instance; the cross-instance limit is a Vercel Firewall rule (see Security).

---

## AI Implementation

All AI features use **Groq's Llama 3.3 70B Versatile** model — chosen for sub-second inference latency on Groq's LPU hardware.

```typescript
// Core pattern used across all AI endpoints
const completion = await groq.chat.completions.create({
  messages: [{ role: 'user', content: prompt }],
  model: 'llama-3.3-70b-versatile',
  temperature: 0.7,
  max_tokens: 800,
});
```

| AI Feature | Input | Output |
|---|---|---|
| Bullet generation | Job title, company, description | 4–6 action verbs + metrics |
| ATS scoring | Resume sections | 0–100 score + missing keywords |
| Resume review | Full resume data | Section feedback + critical issues |
| Keyword analysis | Resume + job description | Gap list + suggestions |
| Cover letter | Resume + job description | Tailored 3-paragraph letter |
| Job matching | Resume + job listing | Match score + recommendations |

---

## Security

- **Authentication** — NextAuth.js v5 with JWT, Google OAuth 2.0 (PKCE), credentials provider
- **Password hashing** — bcryptjs, 10 rounds
- **Rate limiting** — in-process fixed windows behind one store interface (`src/lib/security/rateLimit.ts`), so on Vercel each function instance counts separately. The shared limit across instances needs one Vercel Firewall rule set up in the dashboard (all plans; Hobby allows one): Firewall → Configure → New Rule, *If* Request Path starts with `/api/auth/` **or** equals `/api/user/register`, *Then* Rate Limit, Fixed Window, 60 s, 30 requests (the session endpoint under `/api/auth/` is polled by every open tab), keyed by IP, action 429, then Review Changes → Publish ([docs](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting))
- **Account enumeration** — sign-in, registration and password reset give the same answer whether or not an account exists
- **Content-Security-Policy** — same-origin only, set in `next.config.ts` without nonces so pages stay statically rendered
- **Input sanitization** — XSS prevention on all user-submitted fields
- **CSRF** — NextAuth built-in protection on all mutations
- **Environment validation** — `@t3-oss/env-nextjs` with Zod at startup
- **Dependency security** — `bun audit` clean (zero vulnerabilities). Patched: Mongoose search injection (→ 9.3.1), Next.js DoS (→ 16.2.0), transitive overrides for `minimatch`, `flatted`, `basic-ftp`

---

## Design System

Consistent indigo palette applied across all pages, components, and templates:

| Token | Value | Usage |
|---|---|---|
| Primary | `#4f46e5` | Buttons, active states, icons, progress bars |
| Deep | `#1e1b4b` | Dark CTAs, hero gradient |
| Surface | `#f5f3ff` | Page background, empty states |
| Surface alt | `#eef2ff` | Icon boxes, badge backgrounds, progress tracks |
| Border hover | `#c7d2fe` | Card/input hover borders |
| Text primary | `#11101d` | Headings, strong text |
| Text secondary | `#64748b` | Body copy, labels, metadata |
| Font | Plus Jakarta Sans | 400/500/600/700/800 via next/font |

---

## PWA

- `manifest.json` with app name, icons, display mode
- Service worker (`public/sw.js`) — cache-first for static assets, passthrough for all dynamic routes (`/api/`, `/builder/`, `/dashboard`, etc.)
- Theme color `#4f46e5` synced to browser chrome
- Custom favicon — abstract mini resume mark (no text, scales to 16px)

---

## Getting Started

### Prerequisites

```
Bun 1.3.4+
MongoDB Atlas cluster
Google OAuth credentials (optional)
Groq API key
Resend API key (for password reset emails)
```

### Installation

```bash
git clone <repository-url>
cd Resume_canvas

bun install

cp .env.example .env.local
# fill in required variables

bun dev
```

### Environment Variables

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=           # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=          # optional
GOOGLE_CLIENT_SECRET=      # optional
GROQ_API_KEY=
RESEND_API_KEY=
RESEND_FROM_EMAIL=
RESEND_FROM_NAME=ResumeCanvas
```

### Commands

```bash
bun dev              # Development server (Turbopack)
bun build            # Production build
bun start            # Production server
bun lint             # ESLint with auto-fix
bun format           # Prettier
bun type-check       # tsc --noEmit
bun test             # Unit + performance tests
bun run test:e2e     # Playwright end-to-end
bun run verify       # format + lint + type-check
```

---

## Development Approach — Agentic AI

This project was developed using an **agentic AI-assisted workflow** as a deliberate methodology choice, not as a shortcut. The distinction matters:

| Aspect | Approach |
|---|---|
| **Architecture** | Human-designed — route groups, template rendering strategy, API shape, caching layers |
| **Feature implementation** | AI-accelerated — Claude Code and GitHub Copilot used to scaffold, iterate, and refine components |
| **Code quality** | Human-reviewed — every generated change reviewed, tested, and adjusted before committing |
| **Design decisions** | Human-led — design system tokens, UX flows, component hierarchy all explicitly specified |
| **Debugging** | Collaborative — AI used to diagnose and propose fixes, human validates before applying |

### Tools Used

**[Claude Code](https://claude.ai/code) (Anthropic)** — primary agentic coding assistant. Used for multi-file refactors, design system consistency passes, security audits, lint/type error resolution, and architectural planning. Running as a persistent session with full codebase context.

**[GitHub Copilot / Codex](https://github.com/features/copilot)** — inline code completion for boilerplate, repetitive patterns, and rapid prototyping inside the editor.

**[skills.sh](https://skills.sh)** — agent skill marketplace. Installed skills:
- `vercel-labs/agent-skills@web-design-guidelines` — Vercel web design guidelines for UI review
- `wshobson/agents@nextjs-app-router-patterns` — Next.js App Router best practices

### Why This Approach

Modern software engineering increasingly requires the ability to leverage AI tooling effectively — knowing what to delegate, what to own, and how to maintain quality throughout. This project demonstrates that skillset:

- Shipping a full-stack product faster without sacrificing code quality
- Using AI to enforce consistency (design tokens, error handling, type safety) across a large codebase
- Treating AI suggestions as drafts to be evaluated, not answers to be accepted
- Running `bun audit`, `tsc --noEmit`, and `bun lint` as ground truth — not the AI's confidence

---

## Roadmap

## 🎯 Current Limitations & Roadmap

**AI Rate Limits**

- Groq free tier: 14,400 requests/day
- Per-user limit: 50 requests/hour
- Cover letter generation: 10 requests/day (free tier)

**PDF Generation**

- Server-side only (Puppeteer)
- Memory intensive (~100MB per PDF)
- Browser pool management required
- Not suitable for edge runtime

**Database**

- Production: MongoDB Atlas M0
- Free tier: 512MB storage limit
- Complex queries may need optimization

**Upcoming Features**

- LinkedIn profile import (in development)
- Team collaboration features
- Premium subscription tiers
- Advanced analytics dashboard
- Mobile app (React Native)
- Multi-language resume support
- Career coaching AI (interview prep, salary negotiation)

---

## License

MIT — see [LICENSE](./LICENSE)

---

Built and maintained by a full-stack developer exploring the edge of what's possible when human engineering judgment meets agentic AI tooling. Deployed at [resumecanvas.vercel.app](https://resumecanvas.vercel.app).
