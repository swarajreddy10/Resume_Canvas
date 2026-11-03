import { CyclingWord } from '@/components/landing/CyclingWord';
import { HeroMotionToggle } from '@/components/landing/HeroMotionToggle';
import { LazyTemplateCarousel } from '@/components/landing/LazyTemplateCarousel';
import { Reveal } from '@/components/landing/Reveal';
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronRight,
  LayoutTemplate,
  LockKeyhole,
  ScanSearch,
  Sparkles,
  Timer,
  TrendingUp,
  Wand2,
  Zap,
} from 'lucide-react';
import { OPEN_GRAPH_BASE } from '@/lib/config/site.config';
import type { Metadata } from 'next';
import Link from 'next/link';

// A Server Component: the hero, including the LCP paragraph, is in the server HTML and
// visible before any JavaScript runs. Interactivity lives in small client islands
// (CyclingWord, HeroMotionToggle, Reveal, LazyTemplateCarousel).
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { ...OPEN_GRAPH_BASE, url: '/' },
};

const REPO_URL = 'https://github.com/swarajreddy10/Resume_Canvas';

const CYCLING_WORDS = [
  'stand out',
  'tailor faster',
  'match the job',
  'apply with confidence',
] as const;

// Product facts only. No user counts, ratings, outcome rates, or testimonials: this is a
// free hobby project with no measured user base, so any such figure would be invented.
const STATS = [
  { value: '5', label: 'Resume templates', dark: false },
  { value: '7', label: 'AI tools', dark: false },
  { value: 'Live', label: 'Preview as you edit', dark: false },
  { value: 'PDF', label: 'One-click export', dark: false },
  { value: 'Free', label: 'Open source on GitHub', dark: true },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Start from a draft, not a blank page',
    desc: 'Paste your experience and the AI suggests structured bullets you can edit and keep.',
  },
  {
    icon: ScanSearch,
    title: 'See which keywords are missing',
    desc: 'Compare your resume with a job description before you apply and close the gaps you choose.',
  },
  {
    icon: Wand2,
    title: 'Bullets tailored to the job',
    desc: 'Suggestions are written against the job description you target, with room for your own numbers.',
  },
  {
    icon: TrendingUp,
    title: 'Prepare beyond the resume',
    desc: 'Draft a tailored cover letter and practise likely interview questions from the same job description.',
  },
];

const TOOLS = [
  {
    icon: Wand2,
    title: 'AI Writing Assistant',
    desc: 'Generate bullet points tailored to a job description, then edit them in place.',
  },
  {
    icon: ScanSearch,
    title: 'ATS Keyword Check',
    desc: 'Keyword analysis against a job posting, so you know what is missing before you apply.',
  },
  {
    icon: LayoutTemplate,
    title: 'Templates',
    desc: 'Five designs with live preview. Switch templates with a single click.',
  },
  {
    icon: LockKeyhole,
    title: 'Private by Default',
    desc: 'Your resumes stay in your account unless you choose to publish a share link.',
  },
  {
    icon: Timer,
    title: 'Less Time Formatting',
    desc: 'Live preview and one-click PDF export keep the layout out of your way.',
  },
  {
    icon: BrainCircuit,
    title: 'Resume Review',
    desc: 'AI feedback on verbs, missing skills, and where a number would make a bullet stronger.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#11101d] overflow-x-hidden">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-5 sm:px-8">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            <span className="text-[#11101d]">Resume</span>
            <span className="text-canvas-gradient">Canvas</span>
          </Link>

          <nav
            aria-label="Page sections"
            className="hidden md:flex items-center gap-1 text-sm"
          >
            {[
              ['Templates', '#templates'],
              ['Features', '#features'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="relative px-4 py-2 text-rc-muted hover:text-[#11101d] font-medium transition-colors rounded-lg group"
              >
                {label}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#4f46e5] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/auth/signin"
              className="hidden sm:block text-sm text-[#11101d] font-medium transition-colors hover:text-[#4f46e5]"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signin"
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#1e1b4b] to-[#312e81] hover:from-[#3730a3] hover:to-[#4f46e5] text-white text-sm font-semibold rounded-lg px-5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            >
              Get started
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO ── */}
        <section className="bg-[#f5f3ff] relative overflow-hidden">
          {/* Subtle dot grid */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,#cbd5e1_1px,transparent_1px)] bg-[length:28px_28px] opacity-40 pointer-events-none" />
          <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
            {/* Left */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <Sparkles
                  aria-hidden="true"
                  className="h-4 w-4 text-[#4f46e5]"
                />
                <span className="text-sm text-rc-muted font-medium">
                  Free and open source · AI-assisted resume builder
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight text-[#11101d]">
                A resume builder
                <br />
                that helps you <CyclingWord words={CYCLING_WORDS} />
              </h1>

              <p className="text-lg text-rc-muted leading-relaxed max-w-md">
                Write with AI help, check your resume against the job&apos;s
                keywords, and export a clean PDF, with live preview the whole
                way.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/auth/signin"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1e1b4b] to-[#312e81] hover:from-[#3730a3] hover:to-[#4f46e5] text-white font-semibold rounded-xl px-7 py-3.5 transition-all duration-300 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Create my resume
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <a
                  href="#templates"
                  className="flex items-center justify-center gap-2 border border-[#e2e8f0] bg-white text-[#11101d] hover:border-[#c7d2fe] hover:bg-[#eef2ff] font-semibold rounded-xl px-7 py-3.5 transition-all text-base"
                >
                  View templates
                </a>
              </div>

              {/* Trust signals */}
              <ul className="flex flex-wrap gap-4 text-sm text-rc-muted">
                {[
                  'Open source on GitHub',
                  'No credit card required',
                  'Export to PDF free',
                ].map((text) => (
                  <li key={text} className="flex items-center gap-1.5">
                    <Check
                      aria-hidden="true"
                      className="h-4 w-4 flex-shrink-0 text-[#4f46e5]"
                    />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>

              <HeroMotionToggle />
            </div>

            {/* Right — Resume mockup (an illustration: one image to assistive tech) */}
            <div
              role="img"
              aria-label="Example resume with an ATS score badge and an AI keyword suggestion"
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-xs sm:max-w-sm">
                {/* Resume card */}
                <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-lg p-5 sm:p-6">
                  <div className="mb-4 pb-3 border-b border-[#e2e8f0]">
                    <div className="text-base font-bold text-[#11101d]">
                      Ananya Krishnan
                    </div>
                    <div className="text-xs text-[#4f46e5] font-semibold mt-0.5">
                      Senior Product Manager
                    </div>
                    <div className="flex flex-wrap gap-2 text-[10px] text-rc-muted mt-1.5">
                      <span>ananya.k@email.com</span>
                      <span>·</span>
                      <span>Bangalore, India</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 mb-4">
                    <div className="h-2 bg-[#f1f5f9] rounded-full w-full" />
                    <div className="h-2 bg-[#f1f5f9] rounded-full w-11/12" />
                    <div className="h-2 bg-[#f1f5f9] rounded-full w-4/5" />
                  </div>

                  <div className="mb-3">
                    <div className="text-[10px] font-semibold text-rc-muted uppercase tracking-widest mb-2">
                      Experience
                    </div>
                    <div className="space-y-3">
                      {[
                        {
                          title: 'Product Lead · Flipkart',
                          period: '2022 – Present',
                        },
                        { title: 'PM · Razorpay', period: '2020 – 2022' },
                      ].map((job) => (
                        <div key={job.title}>
                          <div className="flex justify-between items-baseline">
                            <span className="text-[11px] font-semibold text-[#11101d]">
                              {job.title}
                            </span>
                            <span className="text-[9px] text-rc-muted">
                              {job.period}
                            </span>
                          </div>
                          <div className="mt-1 space-y-1">
                            <div className="h-1.5 bg-[#f1f5f9] rounded-full w-full" />
                            <div className="h-1.5 bg-[#f1f5f9] rounded-full w-10/12" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-semibold text-rc-muted uppercase tracking-widest mb-2">
                      Skills
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        'Product Strategy',
                        'Roadmapping',
                        'SQL',
                        'Figma',
                        'A/B Testing',
                      ].map((s) => (
                        <span
                          key={s}
                          className="px-2 py-0.5 bg-[#eef2ff] border border-[#c7d2fe] rounded text-[10px] text-[#4f46e5] font-medium"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating ATS badge */}
                <div className="rc-float absolute -top-4 -right-4 sm:-right-8 bg-white border border-[#e2e8f0] rounded-xl shadow-md px-3 py-2 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#eef2ff] flex items-center justify-center text-xs font-extrabold text-[#4f46e5]">
                    96
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#11101d]">
                      ATS Score
                    </div>
                    <div className="text-[9px] text-[#4f46e5] font-medium">
                      Excellent
                    </div>
                  </div>
                </div>

                {/* Floating AI chip */}
                <div
                  className="rc-float absolute -bottom-4 -left-4 sm:-left-8 bg-white border border-[#e2e8f0] rounded-xl shadow-md px-3 py-2 flex items-center gap-2 max-w-[180px]"
                  style={
                    {
                      '--rc-float-y': '6px',
                      '--rc-float-duration': '5s',
                      '--rc-float-delay': '1s',
                    } as React.CSSProperties
                  }
                >
                  <div className="w-7 h-7 rounded-full bg-[#eef2ff] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-[#4f46e5]" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-[#11101d]">
                      AI Suggestion
                    </div>
                    <div className="text-[8px] text-rc-muted leading-tight">
                      Add &quot;OKRs&quot; to match 4 more jobs
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section
          aria-label="Product facts"
          className="py-10 bg-white border-y border-[#e2e8f0]"
        >
          <Reveal className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {STATS.map((s) =>
                s.dark ? (
                  <div
                    key={s.label}
                    className="col-span-2 sm:col-span-1 bg-[#1e1b4b] rounded-2xl p-6 flex flex-col justify-between min-h-[104px] relative overflow-hidden"
                  >
                    <div className="text-3xl font-extrabold text-[#818cf8] tabular-nums">
                      {s.value}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-[#94a3b8] mt-1">
                      {s.label}
                    </div>
                    <div
                      aria-hidden="true"
                      className="flex items-end gap-1 mt-3"
                    >
                      {[3, 5, 4, 6, 5].map((h, i) => (
                        <div
                          key={i}
                          className="w-2 rounded-sm bg-[#818cf8]/70"
                          style={{ height: `${h * 4}px` }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-[#e2e8f0] bg-white p-6 flex flex-col justify-between min-h-[104px] hover:border-[#c7d2fe] card-hover"
                  >
                    <div className="text-3xl font-extrabold text-[#11101d] tabular-nums">
                      {s.value}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-widest text-rc-muted mt-1">
                      {s.label}
                    </div>
                  </div>
                )
              )}
            </div>
          </Reveal>
        </section>

        {/* ── WHY RESUMECANVAS ── */}
        <section
          id="features"
          aria-labelledby="features-heading"
          className="py-20 sm:py-28 px-5 sm:px-8 bg-[#f5f3ff]"
        >
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-14">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4f46e5] mb-3">
                AI-POWERED RESUME BUILDER
              </p>
              <h2
                id="features-heading"
                className="text-3xl sm:text-4xl font-extrabold text-[#11101d] leading-tight max-w-2xl"
              >
                Why job seekers choose ResumeCanvas
              </h2>
              <p className="text-rc-muted text-base mt-3 max-w-xl leading-relaxed">
                Built for speed, ATS compliance, and real results. Not just
                pretty templates.
              </p>
            </Reveal>

            <div className="grid sm:grid-cols-2 gap-4">
              {FEATURES.map((f, i) => (
                <Reveal
                  key={f.title}
                  delay={i * 0.06}
                  className="flex gap-5 p-6 rounded-2xl border border-[#e2e8f0] bg-white hover:border-[#c7d2fe] card-hover"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[#eef2ff] flex items-center justify-center flex-shrink-0">
                    <f.icon
                      aria-hidden="true"
                      className="h-6 w-6 text-[#4f46e5]"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#11101d] mb-1">{f.title}</h3>
                    <p className="text-sm text-rc-muted leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEMPLATES ── */}
        <section
          id="templates"
          aria-labelledby="templates-heading"
          className="py-20 sm:py-28 bg-[#f5f3ff] overflow-hidden"
        >
          <Reveal className="max-w-6xl mx-auto px-5 sm:px-8 mb-12">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4f46e5] mb-3">
              PROFESSIONAL TEMPLATES
            </p>
            <h2
              id="templates-heading"
              className="text-3xl sm:text-4xl font-extrabold text-[#11101d] leading-tight mb-3"
            >
              Tested resume templates
            </h2>
            <p className="text-rc-muted text-base leading-relaxed max-w-xl">
              Use the templates recruiters love. Export to PDF instantly.
            </p>
          </Reveal>
          <LazyTemplateCarousel />
        </section>

        {/* ── EVERYTHING YOU NEED ── */}
        <section
          aria-labelledby="tools-heading"
          className="py-20 sm:py-28 px-5 sm:px-8 bg-white"
        >
          <div className="max-w-6xl mx-auto">
            <Reveal className="mb-14">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4f46e5] mb-3">
                BUILT FOR RESULTS
              </p>
              <h2
                id="tools-heading"
                className="text-3xl sm:text-4xl font-extrabold text-[#11101d] leading-tight max-w-2xl"
              >
                Everything you need to stand out
              </h2>
              <p className="text-rc-muted text-base mt-3 max-w-xl leading-relaxed">
                Powerful AI tools and professional templates built for modern
                job seekers.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOOLS.map((tool, i) => (
                <Reveal
                  key={tool.title}
                  delay={i * 0.1}
                  className="rounded-2xl border border-[#e2e8f0] bg-white p-7 hover:border-[#c7d2fe] card-hover cursor-default"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#eef2ff] flex items-center justify-center mb-5">
                    <tool.icon
                      aria-hidden="true"
                      className="h-5 w-5 text-[#4f46e5]"
                    />
                  </div>
                  <h3 className="font-bold text-[#11101d] mb-2">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-rc-muted leading-relaxed">
                    {tool.desc}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section
          aria-labelledby="cta-heading"
          className="py-20 sm:py-28 px-5 sm:px-8 bg-white"
        >
          <Reveal className="max-w-6xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden bg-[#1e1b4b] text-white px-8 py-16 sm:px-16 sm:py-20 text-center">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]" />
              <div className="relative z-10">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#818cf8] mb-4">
                  START FOR FREE
                </p>
                <h2
                  id="cta-heading"
                  className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight text-white"
                >
                  Ready to write your next resume?
                </h2>
                <p className="text-[#94a3b8] text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                  AI help for every section, a keyword check against the job,
                  and a clean PDF when you are done.
                </p>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 bg-white text-[#1e1b4b] hover:bg-[#eef2ff] font-semibold rounded-xl px-7 py-3.5 text-base transition-colors"
                >
                  Create my resume, it&apos;s free
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <ul className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-8 text-sm text-[#94a3b8]">
                  {['No credit card', 'Free to use', 'Export to PDF'].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-1.5">
                        <Check
                          aria-hidden="true"
                          className="h-3.5 w-3.5 text-[#818cf8]"
                        />
                        <span>{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-[#e2e8f0] py-10 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-extrabold text-base">
            <span className="text-[#11101d]">Resume</span>
            <span className="text-canvas-gradient">Canvas</span>
            <span className="text-rc-muted font-normal text-sm ml-2">
              © 2025
            </span>
          </span>
          <a
            href={REPO_URL}
            className="text-sm text-rc-muted hover:text-[#11101d] transition-colors"
          >
            Source on GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}
