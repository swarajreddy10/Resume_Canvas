# ResumeCanvas

> AI-powered resume builder with real-time ATS optimization and professional templates

**Live**: [resumecanvas.live](https://www.resumecanvas.live/)

---

## 🎯 What It Does

ResumeCanvas helps you create professional, ATS-optimized resumes using AI. Built with Next.js 16, React 19, and powered by Groq's Llama 3.3 70B model.

### ✨ Core Features

**📝 Resume Builder**

- 6-section form builder (Personal Info, Experience, Education, Skills, Projects, Certifications)
- Real-time preview with live updates
- Auto-save every 3 seconds
- Form validation with instant feedback
- Clone existing resumes

**🤖 AI-Powered Tools**

- Generate professional bullet points
- ATS score analysis (0-100 rating)
- Resume review with actionable feedback
- Keyword optimization suggestions

**🎨 Professional Templates**

- Executive Template (dark sidebar, leadership-focused)
- Tech Template (modern sans layout, skills-forward)
- Corporate Template (conservative, bullet-driven)
- Creative Template (clean grid with accents)
- Academic Template (structured CV for research)
- Real-time template switching
- Print-optimized layouts

**📊 Application Tracking**

- Track job applications
- Monitor application status
- Add notes and follow-ups
- Link resumes to applications

**📈 Analytics**

- View count tracking
- Public/private resume toggle
- Share via custom URL slugs
- Performance metrics

**📄 Export & Sharing**

- PDF generation (Puppeteer-based)
- Public resume URLs
- Custom slug support
- One-click sharing

---

## 🛠️ Tech Stack

### Frontend

```
Next.js 16.0.10          App Router, Server Components
React 19.2.1             Latest React with RSC
TypeScript 5.9.3         Strict mode enabled
Tailwind CSS 4.1         Utility-first styling
Shadcn/ui                Radix UI components
TanStack Query 5.90      Server state management
React Hook Form 7.68     Form handling
Zod 4.2                  Schema validation
```

### Backend

```
Bun 1.3.4                JavaScript runtime (10x faster)
MongoDB 7.0              Document database
Mongoose 8.7.3           ODM with schema validation
NextAuth.js 5.0          JWT + Google OAuth
bcryptjs 3.0             Password hashing
Groq SDK 0.7.0           AI inference (Llama 3.3 70B)
Puppeteer 24.33          PDF generation
```

### Development

```
Bun Test                 Testing framework
ESLint 9                 Code linting
Prettier 3.3             Code formatting
Husky 9.1                Git hooks
TypeScript ESLint 8.8    TS linting rules
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/                    # Authentication pages
│   │   └── auth/
│   │       ├── signin/            # Sign in page
│   │       ├── signup/            # Sign up page
│   │       └── forgot-password/   # Password reset
│   │
│   ├── (dashboard)/               # Protected routes
│   │   ├── dashboard/             # Main dashboard
│   │   ├── builder/[id]/          # Resume builder
│   │   ├── applications/          # Job tracking
│   │   ├── analytics/             # Performance metrics
│   │   └── profile/               # User profile
│   │
│   ├── api/                       # API endpoints (25 routes)
│   │   ├── auth/                  # Authentication
│   │   ├── resumes/               # Resume CRUD
│   │   ├── ai/                    # AI features (7 endpoints)
│   │   ├── applications/          # Job tracking
│   │   └── user/                  # User management
│   │
│   └── resume/[id]/               # Public resume view
│
├── components/
│   ├── forms/                     # Form components
│   │   ├── PersonalInfoForm.tsx   # Personal details
│   │   ├── ExperienceForm.tsx     # Work experience
│   │   ├── EducationForm.tsx      # Education history
│   │   ├── SkillsForm.tsx         # Skills list
│   │   ├── ProjectsForm.tsx       # Project showcase
│   │   └── CertificationsForm.tsx # Certifications
│   │
│   ├── resume/                    # Resume components
│   │   ├── templates/             # 5 templates
│   │   ├── TemplateRenderer.tsx   # Template engine
│   │   ├── TemplateGallery.tsx    # Template selector
│   │   ├── ATSOptimizer.tsx       # ATS analysis
│   │   ├── ResumeAnalytics.tsx    # View tracking
│   │   ├── ShareButton.tsx        # Share functionality
│   │   ├── PDFDownloader.tsx      # PDF export
│   │   └── ResumeCloner.tsx       # Clone resumes
│   │
│   ├── ai/                        # AI components
│   │   ├── KeywordOptimizer.tsx   # Keyword analysis
│   │   └── ResumeReviewer.tsx     # AI review
│   │
│   └── ui/                        # Base UI (Shadcn)
│       ├── button.tsx, card.tsx, input.tsx
│       ├── form.tsx, dialog.tsx, tabs.tsx
│       └── 20+ more components
│
├── lib/
│   ├── db/
│   │   ├── models/
│   │   │   ├── User.ts            # User schema
│   │   │   ├── Resume.ts          # Resume schema
│   │   │   └── JobApplication.ts  # Application schema
│   │   └── connection.ts          # MongoDB connection
│   │
│   ├── auth/
│   │   └── config.ts              # NextAuth config
│   │
│   ├── validation/
│   │   └── resume.schemas.ts      # Zod schemas
│   │
│   ├── cache/
│   │   └── memory-cache.ts        # LRU cache
│   │
│   └── security/
│       ├── rateLimit.ts           # Rate limiting
│       └── sanitize.ts            # Input sanitization
│
├── services/
│   ├── ai.service.ts              # Groq AI integration
│   └── pdf.service.ts             # PDF generation
│
└── types/
    └── resume.unified.ts          # TypeScript types
```

---

## 🗄️ Database Schema

### User Model

```typescript
{
  email: string (unique, indexed)
  name: string
  password: string (bcryptjs hashed)
  subscriptionTier: 'free' | 'pro' | 'enterprise'
  profile: {
    firstName, lastName, phone, location
  }
  timestamps: createdAt, updatedAt
}
```

### Resume Model

```typescript
{
  userEmail: string (indexed)
  title: string
  slug: string (unique, indexed)
  personalInfo: { name, email, phone, summary, ... }
  experience: Experience[]
  education: Education[]
  skills: string[]
  projects: Project[]
  certifications: Certification[]
  templateId: 'executive' | 'tech' | 'corporate'
  isPublic: boolean
  atsScore: number (0-100)
  viewCount: number
  timestamps: createdAt, updatedAt
}

Indexes: 6 strategic indexes
- slug (unique)
- userEmail + updatedAt
- userEmail + isPublic
- createdAt, atsScore
```

### JobApplication Model

```typescript
{
  userEmail: string;
  resumeId: ObjectId;
  company: string;
  position: string;
  status: 'applied' | 'interviewing' | 'offered' | 'rejected';
  appliedDate: Date;
  notes: string;
}
```

---

## 🔌 API Endpoints

### Authentication (3 endpoints)

```
POST   /api/auth/[...nextauth]      NextAuth handler
POST   /api/auth/check-email        Email availability
POST   /api/user/register           User registration
```

### Resume Management (10 endpoints)

```
GET    /api/resumes                 List user resumes
POST   /api/resumes                 Create resume
GET    /api/resumes/[id]            Get resume by ID
PUT    /api/resumes/[id]            Update resume
DELETE /api/resumes/[id]            Delete resume
POST   /api/resumes/[id]/clone      Clone resume
POST   /api/resumes/[id]/ats-score  Calculate ATS score
GET    /api/resumes/[id]/pdf        Generate PDF
GET    /api/resumes/slug/[slug]     Get by slug
POST   /api/resumes/migrate-slugs   Migrate slugs
```

### AI Features (7 endpoints)

```
POST   /api/ai/generate-bullets     Generate bullet points
POST   /api/ai/optimize             ATS optimization
POST   /api/ai/review-resume        Resume review
POST   /api/ai/generate-cover-letter  Cover letter
POST   /api/ai/interview-questions  Interview prep
POST   /api/ai/analyze-keywords     Keyword analysis
POST   /api/ai/job-match            Job matching
```

### Applications & Analytics (3 endpoints)

```
GET    /api/applications            List applications
POST   /api/applications            Create application
GET    /api/user/stats              User statistics
```

### Public & Utilities (2 endpoints)

```
GET    /api/resume/public/[id]      Public resume view
GET    /api/test-db                 Database health
```

---

## 🤖 AI Implementation

### Groq Integration

```typescript
// Llama 3.3 70B Versatile model
const completion = await groq.chat.completions.create({
  messages: [{ role: 'user', content: prompt }],
  model: 'llama-3.3-70b-versatile',
  temperature: 0.8,
  max_tokens: 800,
});
```

### AI Features

**🎯 Bullet Point Generation**

- Analyzes job title, company, description
- Generates 4-6 action-oriented bullets
- Includes quantifiable metrics
- ATS-optimized keywords

**📊 ATS Optimization**

- Scores resume 0-100
- Identifies missing keywords
- Suggests improvements
- Format compatibility check

**✍️ Resume Review**

- Section-by-section analysis
- Critical issues identification
- Actionable recommendations
- Competitive analysis

**🔍 Keyword Analysis**

- Extracts important keywords
- Identifies missing terms
- Industry-specific suggestions
- Optimization recommendations

**🔍 Keyword Analysis**

## 🎨 Templates

### Executive Template

- Dark sidebar with white main content
- Professional serif structure
- Two-column layout
- Best for: Directors, VPs, C-level roles

### Tech Template

- Modern sans layout
- Skills-forward blocks
- Project highlights
- Best for: Software engineers, data roles

### Corporate Template

- Conservative bullet-driven layout
- Traditional professional styling
- Impact-focused sections
- Best for: Consulting, finance, operations

### Creative Template

- Clean grid with restrained accents
- Modern, portfolio-friendly
- Case study ready
- Best for: Product managers, designers

### Academic Template

- Structured CV format
- Multi-page support
- Publication and grant focus
- Best for: Researchers, professors, PhD candidates

**Features**:

- Real-time template switching
- Print-optimized (A4 format)
- ATS-compatible formatting
- Responsive preview

---

## 🔒 Security

### Authentication

```typescript
// NextAuth.js with JWT
- Credentials provider (email/password)
- Google OAuth 2.0 (PKCE, state validation)
- bcryptjs password hashing (10 rounds)
- 1-day session expiry (auto-refresh every hour)
- Secure cookies (HttpOnly, SameSite=Lax)
- Account linking support
```

### Input Validation

```typescript
// Three-layer validation
1. Client: React Hook Form + Zod
2. Server: Zod schema validation
3. Database: Mongoose schema validation
```

### Rate Limiting

```typescript
API Routes:    100 requests / 15 minutes
AI Endpoints:  50 requests / 1 hour
Auth Routes:   5 requests / 15 minutes
```

### Data Protection

- XSS prevention (input sanitization)
- SQL injection protection (Mongoose)
- CSRF protection (NextAuth built-in)
- Environment variable validation

---

## ⚡ Performance

### Caching Strategy

```typescript
// In-memory LRU cache
- 50 resumes cached
- 5-minute TTL
- 60% reduction in DB queries
- <100ms API response time
```

### Database Optimization

```typescript
// Connection pooling
- Max: 10 connections
- Min: 2 connections
- 6 strategic indexes per collection
- Query projection for efficiency
```

### Code Optimization

- Server Components (reduce client JS)
- Dynamic imports (code splitting)
- Bundle size: <200KB initial load
- Lazy loading for heavy components

---

## 🧪 Testing

### Coverage: 89.58%

```
121 tests passing
0 failures
212 assertions
~7 second execution
```

### Test Distribution

```
Unit Tests:        91 tests
Integration Tests: 19 tests
Performance Tests:  5 tests
Security Tests:    11 tests
```

### What's Tested

- ✅ All validation schemas
- ✅ Cache functionality
- ✅ AI service integration
- ✅ API endpoints
- ✅ Security (XSS, SQL injection)
- ✅ Rate limiting
- ✅ Performance benchmarks

---

## 🚀 Getting Started

### Prerequisites

```bash
Bun 1.3.4+
MongoDB Atlas account
Google OAuth credentials
Groq API key
```

### Installation

```bash
# Clone repository
git clone <repository-url>
cd career_canvas1

# Install dependencies
bun install

# Setup environment
cp .env.example .env.local
# Fill in required variables

# Run development server
bun dev
```

### Environment Variables

```env
MONGODB_URI=mongodb+srv://...
NEXTAUTH_SECRET=<32-char-secret>  # Generate: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<google-oauth-id>
GOOGLE_CLIENT_SECRET=<google-oauth-secret>
GROQ_API_KEY=<groq-api-key>
```

### Development Commands

```bash
bun dev              # Start dev server
bun build            # Build for production
bun start            # Start production server
bun lint             # Run ESLint
bun format           # Format with Prettier
bun type-check       # TypeScript check
bun test             # Run tests
bun test --coverage  # Generate coverage
bun run verify       # Run all checks
```

---

## 📊 Project Stats

```
Source Files:      146 TypeScript/TSX files
API Endpoints:     25 routes
React Components:  80+ components
Database Models:   3 models
Test Coverage:     89.58%
Templates:         5 professional designs
AI Features:       7 AI-powered tools
```

---

## 🎓 Key Learnings

### Frontend

- React 19 Server Components
- Next.js 16 App Router
- TypeScript strict mode
- Form handling with validation
- State management (Zustand + TanStack Query)

### Backend

- RESTful API design
- MongoDB with Mongoose
- Authentication (JWT + OAuth)
- Rate limiting & security
- Caching strategies

### AI Integration

- Groq SDK integration
- Prompt engineering
- Error handling for AI services
- Rate limiting for AI endpoints

### DevOps

- Bun runtime
- Testing (89.58% coverage)
- Code quality tools
- Git hooks with Husky

---

## 🔄 Data Flow

### Resume Creation

```
User Input → Form Validation (Zod) →
API Route → Service Layer →
MongoDB → Response → UI Update
```

### AI Generation

```
User Request → API Route →
AI Service → Groq API →
Response Processing → UI Display
```

### PDF Export

```
Resume Data → HTML Template →
Puppeteer (Headless Chrome) →
PDF Buffer → Download
```

---

## 🎯 Current Limitations

**AI Rate Limits**

- Groq free tier: 14,400 requests/day
- Per-user limit: 50 requests/hour

**PDF Generation**

- Server-side only (Puppeteer)
- Memory intensive (~100MB per PDF)
- Not suitable for edge runtime

**Database**

- Production: MongoDB Atlas M20 (4GB RAM)
- Free tier: 512MB storage limit

---

## 🛠️ Tech Choices Explained

**Why Bun?**

- 10x faster than Node.js
- Built-in test runner
- Native TypeScript support

**Why Next.js 16?**

- App Router performance
- Server Components
- Built-in API routes

**Why MongoDB?**

- Flexible schema for resume data
- Better for nested documents
- JSON-like structure

**Why Groq?**

- 10x faster inference than OpenAI
- Free tier available
- Open-source models (Llama)

**Why bcryptjs?**

- Pure JavaScript (no native dependencies)
- Works with Bun runtime
- Industry-standard security

---

## 📝 License

MIT License - See [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

Built with these amazing open-source technologies:

- Next.js by Vercel
- React by Meta
- MongoDB by MongoDB Inc.
- Bun by Jarred Sumner
- Groq AI Platform
- Tailwind CSS
- Shadcn/ui by shadcn

---

**Production-ready application** with comprehensive testing, security measures, and performance optimizations. Actively maintained and deployed at [resumecanvas.live](https://www.resumecanvas.live/).
