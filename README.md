# ResumeCanvas

> Full-stack AI-assisted resume builder: a free, open-source hobby project, mobile-first, built with agentic AI development.

**Live:** [resumecanvas.vercel.app](https://resumecanvas.vercel.app)

---

## Overview

ResumeCanvas is a career platform that helps professionals build ATS-optimized resumes using AI. It covers the full product surface: authentication, real-time resume editing, 5 professionally designed templates, AI-powered content generation, PDF export, public sharing, job application tracking, and analytics — all in a single Next.js 16 App Router application.

This project was built as a showcase of modern full-stack engineering combined with **agentic AI-assisted development** — using Claude Code (Anthropic), GitHub Copilot/Codex, and skills.sh agent skills to accelerate architecture, implementation, and continuous improvement while maintaining full human ownership of every technical decision.

---

## What It Does

| Feature                     | Description                                                                                                                         |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Resume Builder**          | 6-section form (personal, experience, education, skills, projects, certifications) with real-time preview and auto-save             |
| **5 Templates**             | Executive, Tech, Corporate, Creative, Academic — all A4-optimized and ATS-compatible                                                |
| **AI Bullet Generation**    | GPT-OSS 120B on Groq writes up to five action-oriented bullets per role from the facts given, checked for invented figures          |
| **ATS Scoring**             | 0–100 completeness score across seven weighted sections (contact, summary, experience, education, skills, projects, certifications) |
| **Resume Review**           | Section-by-section AI analysis with actionable feedback                                                                             |
| **Keyword Optimizer**       | Industry-specific keyword extraction and gap analysis                                                                               |
| **Cover Letter Generator**  | Context-aware AI cover letters tailored to job descriptions                                                                         |
| **PDF Export**              | Server-side Puppeteer rendering, one headless Chromium per request                                                                  |
| **Public Sharing**          | Public resume URLs with custom slugs and view count tracking                                                                        |
| **Clone Resumes**           | One-click resume duplication with full data copy                                                                                    |
| **Job Application Tracker** | Status from applied to offer, rejected or withdrawn, with job details and notes per application                                     |
| **Analytics**               | Views of published resumes, published count, and average ATS score; only measured figures                                           |
| **PWA**                     | Web app manifest for installation; no service worker and no offline mode                                                            |

---

## Tech Stack

### Frontend

| Package           | Version | Role                                                 |
| ----------------- | ------- | ---------------------------------------------------- |
| Next.js           | 16.4.5  | App Router, RSC, API routes, middleware              |
| React             | 19.2.4  | UI with Server + Client Components                   |
| TypeScript        | 5.9.3   | Strict mode throughout                               |
| Tailwind CSS      | 4.2.2   | Utility-first styling with custom design tokens      |
| motion/react      | 12.38.0 | Animations — spring physics, layout, AnimatePresence |
| Shadcn/ui + Radix | latest  | Accessible component primitives                      |
| TanStack Query    | 5.91.3  | Server state, caching, background refetch            |
| React Hook Form   | 7.71.2  | Performant forms with controlled validation          |
| Zod               | 4.6.6   | Schema validation (client + server)                  |
| Zustand           | 5.0.12  | Lightweight client state                             |
| Immer             | 11.1.4  | Immutable state updates                              |
| Plus Jakarta Sans | —       | Primary UI typeface via next/font                    |

### Backend & Services

| Package     | Version       | Role                                    |
| ----------- | ------------- | --------------------------------------- |
| Bun         | 1.4.3         | Runtime, package manager, test runner   |
| MongoDB     | 7.2.0         | Document database                       |
| Mongoose    | 9.7.4         | ODM, schema validation, indexing        |
| NextAuth.js | 5.0.0-beta.32 | JWT sessions, Google OAuth, credentials |
| Groq SDK    | 1.1.1         | GPT-OSS 120B inference (AI features)    |
| Puppeteer   | 24.40.0       | Headless Chrome for PDF generation      |
| Resend      | 6.9.4         | Transactional email (password reset)    |
| bcryptjs    | 3.0.3         | Password hashing (cost 12)              |

### Tooling & Quality

| Tool                | Version | Role                          |
| ------------------- | ------- | ----------------------------- |
| ESLint              | 9.39.4  | Linting with TypeScript rules |
| Prettier            | 3.8.1   | Code formatting               |
| Husky + lint-staged | 9.1.7   | Pre-commit hooks              |
| Playwright          | 1.58.2  | End-to-end testing            |
| TypeScript ESLint   | 8.57.1  | TS-specific lint rules        |

---

## Architecture

```
src/
├── app/
│   ├── (auth)/                    # Sign in, forgot password, reset password
│   ├── (dashboard)/               # Protected routes — layout with sidebar
│   │   ├── dashboard/             # Resume list + usage overview
│   │   ├── builder/[id]/          # Resume editor
│   │   ├── cover-letters/         # AI cover letter generator
│   │   ├── applications/          # Job application tracker
│   │   ├── analytics/             # Views, published count, average ATS score
│   │   ├── profile/               # Account info + stats
│   │   └── settings/              # User preferences
│   ├── api/                       # 22 route files
│   │   ├── auth/                  # NextAuth, forgot/reset password
│   │   ├── resumes/               # CRUD, PDF, ATS score, clone, slug
│   │   ├── resume/public/         # Published resume by id or slug; counts the view
│   │   ├── ai/                    # Bullets, review, optimize, keywords, cover letter
│   │   ├── analytics/             # Per-account performance figures
│   │   ├── applications/          # Job application CRUD
│   │   ├── cover-letters/         # Cover letter management
│   │   └── user/                  # Registration, stats
│   └── resume/[id]/               # Public resume view page
│
├── components/
│   ├── resume/templates/          # 5 A4 templates and the sections they share (inline styles, print-safe)
│   ├── resume/                    # TemplateRenderer, TemplateSelector, TemplateShowcase
│   ├── forms/                     # Per-section form components
│   ├── dashboard/                 # UsageLimits, stats widgets
│   ├── layout/                    # Sidebar navigation
│   └── ui/                        # Shadcn + custom primitives
│
├── lib/
│   ├── auth/config.ts             # NextAuth config (JWT, MongoDB adapter, callbacks)
│   ├── db/                        # Connection, models (User, Resume, JobApplication, CoverLetter)
│   ├── middleware/                # withAuth (private, no-store), withRateLimit
│   ├── security/                  # Rate limiting, input sanitization
│   └── email/                     # Resend integration
│
├── features/
│   ├── ai/services/               # Groq AI service
│   └── resume/services/           # PDF generation
│
└── hooks/                         # useResumes, useSidebar, usePagination
```

### Key Design Decisions

**Route Groups** — `(auth)` and `(dashboard)` share separate layouts with no nesting overhead. The dashboard layout owns the sidebar; auth pages are bare.

**Templates as pure React** — all 5 templates render at 794×1123px (A4 at 96dpi) using only inline styles. No CSS-in-JS runtime, no Tailwind inside templates.

**TemplateShowcase + ResizeObserver** — a single component handles scaling the A4 canvas to any container using a ResizeObserver-driven `scale` transform. Used in the landing carousel, builder preview, and template selector — three different modes, one component.

**Server-side PDF** — each PDF request launches a headless Chromium, loads HTML built on the server (`src/features/resume/services/pdf.service.ts`) with `setContent`, prints A4 and closes the browser. That HTML is separate from the React templates: Executive and Tech have their own PDF layout, while Corporate, Creative and Academic share one standard layout in their accent colour.

**Validation** — Zod on the client forms (React Hook Form) and on the auth and registration API routes; resume, application and cover-letter writes accept only an allow-list of fields, and Mongoose schema validation runs on every create and update (update validators are on globally).

---

## API Reference

| Method         | Endpoint                                                    | Description                                                    |
| -------------- | ----------------------------------------------------------- | -------------------------------------------------------------- |
| GET            | `/api/resumes`                                              | List user resumes                                              |
| POST           | `/api/resumes`                                              | Create resume                                                  |
| GET/PUT/DELETE | `/api/resumes/[id]`                                         | Read, update, delete resume                                    |
| POST           | `/api/resumes/[id]/clone`                                   | Duplicate resume                                               |
| GET            | `/api/resumes/[id]/pdf`                                     | Generate and download PDF                                      |
| POST           | `/api/resumes/[id]/ats-score`                               | Run ATS analysis                                               |
| GET            | `/api/resumes/slug/[slug]`                                  | Resolve resume by slug                                         |
| GET            | `/api/resume/public/[id]`, `/api/resume/public/slug/[slug]` | Published resume for the public page; counts one view per read |
| POST           | `/api/ai/generate-bullets`                                  | AI bullet point generation                                     |
| POST           | `/api/ai/review-resume`                                     | Full resume review                                             |
| POST           | `/api/ai/optimize`                                          | ATS keyword optimization                                       |
| POST           | `/api/ai/analyze-keywords`                                  | Keyword gap analysis                                           |
| POST           | `/api/ai/generate-cover-letter`                             | Cover letter generation                                        |
| GET/POST       | `/api/applications`                                         | Job application tracking                                       |
| GET/POST       | `/api/cover-letters`                                        | Saved cover letters                                            |
| GET            | `/api/analytics/performance`                                | Views, published count, average ATS score                      |
| POST           | `/api/auth/forgot-password`                                 | Password reset email                                           |
| POST           | `/api/auth/reset-password`                                  | Apply new password                                             |
| POST           | `/api/auth/validate-reset-token`                            | Token validation                                               |
| POST           | `/api/user/register`                                        | New user registration                                          |
| GET            | `/api/user/stats`                                           | User statistics                                                |

**Rate limits:** 50 req/hr per signed-in user (AI endpoints) · 5 req/15 min per client IP and email (each auth endpoint, credentials sign-in included). Counts are kept per server instance; the cross-instance limit is a Vercel Firewall rule (see Security).

---

## AI Implementation

All AI features call **`openai/gpt-oss-120b` on Groq**, the replacement Groq names for the
retired `llama-3.3-70b-versatile` ([deprecations](https://console.groq.com/docs/deprecations)),
through one function in `src/features/ai/services/ai.service.ts`:

```typescript
await groq.chat.completions.create({
  model: 'openai/gpt-oss-120b',
  messages: [{ role: 'user', content: prompt }],
  reasoning_effort: 'low', // reasoning tokens count against the budget
  include_reasoning: false,
  temperature: 0.6,
  max_completion_tokens: budget,
  response_format: { type: 'json_object' }, // then a Zod check of the shape
});
```

JSON object mode, not strict `json_schema`: in 24 live calls each, strict mode failed twice
with `tool_use_failed` and JSON object mode never did. There is no canned answer: a Groq error
(after the SDK's two retries), an empty or cut-off reply, or a reply of the wrong shape is a
502, and the UI shows the message. `bun run ai:smoke` calls every feature once against the
live API; on 2026-11-04 each answered in 1.0 to 2.4 s.

Bullets and cover letters go on a real person's resume, so the prompts ask for the facts given
only, and code checks the result (`src/lib/ai/facts.ts`): a bullet with a figure the description
does not give is dropped (the request fails if none is left), and a cover letter with such a
figure, a bracketed placeholder or a date is refused with a 502. A figure is read with its
currency, unit and scale, so "30 minutes" does not license "30%" and "10k" does not license
"10M". The check is a backstop, not a parser of all English: it does not see numbers spelled
out, time units, or digits outside ASCII. Bullets may quantify a result the description states
with a placeholder such as `[X%]` for the user to fill in; cover letters carry no placeholders
and take the candidate's facts from the resume only, never from the job description.
`bun run ai:facts` measures the model's raw drafts live: on 2026-11-04 (6 runs each), bullets
with a number the user never gave fell from 59 of 59 on the old prompt to 1 of 48 and then 0 of
48 in two runs of the current one (the 1 a "26-minute" cut the model worked out from "30 to 4
minutes", which the check drops), and cover letters with invented numbers, `[Your Address]`-style
placeholders or a made-up date from 6, 6 and at least 4 of 6 to none.

| AI Feature        | Input                           | Output                                                        |
| ----------------- | ------------------------------- | ------------------------------------------------------------- |
| Bullet generation | Job title, company, description | Up to five action-verb bullets; `[X%]` marks a missing metric |
| ATS optimization  | Resume text                     | 0–100 score, suggestions, missing keywords                    |
| Resume review     | Full resume data                | Score, assessment, strengths, ranked suggestions              |
| Keyword analysis  | Resume + job description        | Match score, keywords present or missing, by need             |
| Cover letter      | Resume + job description        | Letter body, 3–4 paragraphs, from the resume's facts          |

---

## Security

- **Authentication** — NextAuth.js v5 with JWT, Google OAuth 2.0 (PKCE), credentials provider
- **Password hashing** — bcryptjs, cost 12, one policy and one hash function (`src/lib/auth/password.ts`) for registration and reset
- **Rate limiting** — in-process fixed windows behind one store interface (`src/lib/security/rateLimit.ts`), so on Vercel each function instance counts separately. The shared limit across instances needs one Vercel Firewall rule set up in the dashboard (all plans; Hobby allows one): Firewall → Configure → New Rule, _If_ Request Path starts with `/api/auth/` **or** equals `/api/user/register`, _Then_ Rate Limit, Fixed Window, 60 s, 30 requests (the session endpoint under `/api/auth/` is polled by every open tab), keyed by IP, action 429, then Review Changes → Publish ([docs](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting))
- **Account enumeration** — sign-in, registration and password reset give the same answer whether or not an account exists
- **Content-Security-Policy** — same-origin only, set in `next.config.ts` without nonces so pages stay statically rendered
- **Output encoding** — React escapes rendered text and the PDF service encodes its HTML; text is stored exactly as typed. AI routes strip markup and script patterns from their input before it reaches the model
- **CSRF** — NextAuth built-in protection on all mutations
- **Environment validation** — `src/lib/config/app.config.ts` throws on a missing required variable when the config loads
- **Dependency security** — `bun audit fix` applied; Next.js 16.4.5, Auth.js 5.0.0-beta.32 / `@auth/core` 0.41.3 and Mongoose 9.7.4 carry the fixes `bun audit` reported; overrides pin `minimatch`, `flatted` and `basic-ftp` (≥ 5.3.1). The advisories still reported have no fix inside their dependents' ranges: `basic-ftp` 6.x and `extract-zip` (Puppeteer's browser download), `zod` 3 (Puppeteer and the React hooks lint plugin), `minimatch` 3 (ESLint 9) and `uuid` 10 (Resend)

---

## Design System

Consistent indigo palette applied across all pages, components, and templates:

| Token          | Value                       | Usage                                                                    |
| -------------- | --------------------------- | ------------------------------------------------------------------------ |
| Primary        | `#4f46e5`                   | Buttons, active states, icons, progress bars                             |
| Deep           | `#1e1b4b`                   | Dark CTAs, hero gradient                                                 |
| Surface        | `#f5f3ff`                   | Page background, empty states                                            |
| Surface alt    | `#eef2ff`                   | Icon boxes, badge backgrounds, progress tracks                           |
| Border hover   | `#c7d2fe`                   | Card/input hover borders                                                 |
| Text primary   | `#11101d`                   | Headings, strong text                                                    |
| Text secondary | `#5b6b80` (`text-rc-muted`) | Body copy, labels, metadata; at least 4.5:1 on every light surface above |
| Font           | Plus Jakarta Sans           | 400/500/600/700/800 via next/font                                        |

---

## PWA

- `manifest.json` with app name, icons, display mode
- No service worker: the app has no offline mode. `public/sw.js` is a retired no-op that deletes the caches an earlier version made and unregisters itself in browsers that installed it
- Theme color `#4f46e5` synced to browser chrome
- Custom favicon — abstract mini resume mark (no text, scales to 16px)

---

## Getting Started

### Prerequisites

```
Bun 1.4.3+ (older Bun cannot run Next.js 16.4's production build)
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
bun run lint:check   # ESLint, no fixes, fails on any warning (CI)
bun format           # Prettier
bun type-check       # tsc --noEmit
bun run test         # Unit tests, client components included (happy-dom + Testing Library)
bun run test:coverage     # Unit tests with coverage (coverage/lcov.info)
bun run test:integration  # API routes against an in-memory MongoDB
bun run test:integration:coverage  # The same, writing coverage-integration/lcov.info
bun run test:e2e     # Playwright: builds, then serves against an in-memory MongoDB
bun run verify       # format + lint + type-check
bun run db:sync-indexes  # make MongoDB indexes match the Mongoose schemas
bun run db:migrate-slugs # rewrite legacy name/N resume slugs to one URL segment
bun run ai:smoke     # call every AI feature once against the live Groq API
bun run ai:facts     # measure invented numbers, placeholders and dates in live bullets and letters
```

CI (`.github/workflows/ci.yml`) runs type-check, lint, unit and integration tests with
coverage, the production build and the Playwright suite on every push and pull request to
`main` and `dev`. Run `bun run test:e2e:browsers` once before the first local `test:e2e`.

Coverage is gated on new code, not as a project-wide number. The `sonar` job sends both
LCOV reports to SonarQube Cloud (CI-based analysis, configured in
`sonar-project.properties`), whose Sonar way quality gate requires at least 80% coverage on
the code a change adds. Bun counts only the files a test run loads, so its own percentages
are not project coverage; `scripts/lcov-unloaded-files.ts` adds every other source file at
zero, so a change that adds a file no test loads cannot pass the gate. The job needs a `SONAR_TOKEN` repository secret and Automatic
Analysis switched off in SonarQube Cloud (Administration → Analysis Method); automatic
analysis cannot import coverage. Bumping `version` in `package.json` starts a new "new code"
period for the main branch.

### Database indexes

Every index is declared once, in the Mongoose schemas under `src/lib/db/models`.
Production instances start with `autoIndex` and `autoCreate` off, so a cold start sends no
index or collection commands; `bun run db:sync-indexes` runs on deploy instead, with
`MONGODB_URI` pointing at that environment's database. It builds missing indexes, drops
indexes no schema declares (never `_id_`), and prints both per collection. On Vercel, set
the production Build Command to
`bun run db:sync-indexes && bun run db:migrate-slugs && bun run build` (the slug migration
is idempotent and rewrites slugs from the old `name/N` format, whose share links never
resolved);
`docker compose up` runs it as the one-shot `db-sync-indexes` service before `app`
starts. Development and tests keep Mongoose's automatic index builds.

### Analytics

Vercel Web Analytics and Speed Insights send nothing from a browser where
`localStorage` holds `va-disable` (`src/lib/analytics/ownVisits.ts`). To leave your own
visits out, run `localStorage.setItem('va-disable', '1')` once in the DevTools console on
the production site, in each browser you use. Views already recorded stay in the dashboard.

---

## Development Approach — Agentic AI

This project was developed using an **agentic AI-assisted workflow** as a deliberate methodology choice, not as a shortcut. The distinction matters:

| Aspect                     | Approach                                                                                         |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| **Architecture**           | Human-designed — route groups, template rendering strategy, API shape, data access               |
| **Feature implementation** | AI-accelerated — Claude Code and GitHub Copilot used to scaffold, iterate, and refine components |
| **Code quality**           | Human-reviewed — every generated change reviewed, tested, and adjusted before committing         |
| **Design decisions**       | Human-led — design system tokens, UX flows, component hierarchy all explicitly specified         |
| **Debugging**              | Collaborative — AI used to diagnose and propose fixes, human validates before applying           |

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

## Current Limitations & Roadmap

**AI Rate Limits**

- Per-user limit: 50 requests/hour across the AI endpoints
- Groq's own limits apply per organization and per model; for `openai/gpt-oss-120b` on the Developer plan, 30 requests and 8,000 tokens a minute ([rate limits](https://console.groq.com/docs/rate-limits)). An ATS optimization call used 490 to 808 tokens in 24 measured calls

**PDF Generation**

- Server-side only (Puppeteer): each request launches and closes its own headless Chromium
- Not suitable for edge runtime

**Database**

- Production: MongoDB Atlas free cluster, 0.5 GB storage including indexes ([limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/))

**Upcoming Features**

- LinkedIn profile import
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
