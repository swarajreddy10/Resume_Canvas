'use client';

import TemplateSection from '@/components/resume/TemplateSection';
import {
  fadeInUp,
  scaleIn,
  staggerContainer,
  staggerFast,
} from '@/lib/motion/variants';
import {
  ArrowRight,
  BrainCircuit,
  Check,
  ChevronRight,
  LayoutTemplate,
  LockKeyhole,
  ScanSearch,
  Sparkles,
  Star,
  Timer,
  TrendingUp,
  Wand2,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const CYCLING_WORDS = [
  'hired faster',
  'stand out',
  'get callbacks',
  'win offers',
];

const STATS = [
  { value: '5K+', label: 'Professionals hired', dark: false },
  { value: '95%', label: 'ATS pass rate', dark: false },
  { value: '4.8★', label: 'User rating', dark: false },
  { value: '3×', label: 'More interviews', dark: false },
  { value: '+40%', label: 'Salary outcome', dark: true },
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Build a draft in 10 minutes',
    desc: 'The AI builder is 10× faster than doing it yourself. Just paste your experience and let AI handle the rest.',
  },
  {
    icon: ScanSearch,
    title: 'Zero ATS failures, guaranteed',
    desc: 'Your resume passes every automated scan. Recruiters will see you, not a filtered-out file.',
  },
  {
    icon: Wand2,
    title: 'AI-written, job-tailored bullets',
    desc: 'Context-aware suggestions built for every job description you target. Metrics-first, always.',
  },
  {
    icon: TrendingUp,
    title: 'Get offers 7% above market',
    desc: 'Better resumes open better salary conversations. We help you negotiate too.',
  },
];

const TOOLS = [
  {
    icon: Wand2,
    title: 'AI Writing Assistant',
    desc: 'Generate quantified bullet points tailored to any job description. ATS-ready in one click.',
    tag: 'Most Popular',
  },
  {
    icon: ScanSearch,
    title: 'ATS Score Checker',
    desc: "Instant keyword analysis against job postings. Know exactly what's missing before you apply.",
    tag: null,
  },
  {
    icon: LayoutTemplate,
    title: 'Pro Templates',
    desc: 'Recruiter-approved designs. Switch templates instantly with a single click.',
    tag: null,
  },
  {
    icon: LockKeyhole,
    title: 'Secure & Private',
    desc: 'End-to-end encryption. Your data is never sold or shared with third parties.',
    tag: null,
  },
  {
    icon: Timer,
    title: 'Built in Minutes',
    desc: 'Stop spending days on formatting. Create a polished resume in under 10 minutes.',
    tag: null,
  },
  {
    icon: BrainCircuit,
    title: 'Smart Suggestions',
    desc: 'Real-time coaching as you type: stronger verbs, missing skills, better metrics.',
    tag: null,
  },
];

const TESTIMONIALS = [
  {
    name: 'Arjun Sharma',
    role: 'Software Engineer',
    company: 'Google',
    content:
      'Landed 3 interviews in my first week. The ATS optimization is incredible. Went from zero callbacks to multiple offers.',
    rating: 5,
    initials: 'AS',
  },
  {
    name: 'Sarah Mitchell',
    role: 'Product Manager',
    company: 'Amazon',
    content:
      "Best resume builder I've used. The AI suggestions saved me hours and the result looked completely professional.",
    rating: 5,
    initials: 'SM',
  },
  {
    name: 'Priya Nambiar',
    role: 'Data Scientist',
    company: 'Microsoft',
    content:
      'Professional templates and smart AI. Got my dream job at Microsoft within 3 weeks of using ResumeCanvas.',
    rating: 5,
    initials: 'PN',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setWordIndex((i) => (i + 1) % CYCLING_WORDS.length),
      2800
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#11101d] overflow-x-hidden">
      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-5 sm:px-8">
          <span className="text-lg font-extrabold tracking-tight">
            <span className="text-[#11101d]">Resume</span>
            <span className="text-canvas-gradient">Canvas</span>
          </span>

          <nav className="hidden md:flex items-center gap-1 text-sm">
            {[
              ['Templates', '#templates'],
              ['Features', '#features'],
              ['Reviews', '#reviews'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="relative px-4 py-2 text-[#64748b] hover:text-[#11101d] font-medium transition-colors rounded-lg group"
              >
                {label}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#4f46e5] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left rounded-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/auth/signin')}
              className="hidden sm:block text-sm text-[#11101d] font-medium transition-colors hover:text-[#4f46e5]"
            >
              Sign in
            </button>
            <button
              onClick={() => router.push('/auth/signin')}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#1e1b4b] to-[#312e81] hover:from-[#3730a3] hover:to-[#4f46e5] text-white text-sm font-semibold rounded-lg px-5 py-2.5 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
            >
              Get started
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="bg-[#f5f3ff] relative overflow-hidden">
        {/* Subtle dot grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,#cbd5e1_1px,transparent_1px)] bg-[length:28px_28px] opacity-40 pointer-events-none" />
        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 lg:gap-10 items-center">
          {/* Left */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col gap-6"
          >
            {/* Trust badge */}
            <motion.div variants={fadeInUp} className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-sm text-[#64748b] font-medium">
                4.8 · Trusted by 5,000+ professionals
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight text-[#11101d]"
            >
              This resume builder
              <br />
              gets you{' '}
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="text-canvas-gradient relative inline-block"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {CYCLING_WORDS[wordIndex]}
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-[#4f46e5] to-[#7c3aed] rounded-full" />
                </motion.span>
              </AnimatePresence>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg text-[#64748b] leading-relaxed max-w-md"
            >
              Only 2% of resumes win. Yours will be one of them. AI-powered,
              ATS-optimized, recruiter-approved.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={() => router.push('/auth/signin')}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#1e1b4b] to-[#312e81] hover:from-[#3730a3] hover:to-[#4f46e5] text-white font-semibold rounded-xl px-7 py-3.5 transition-all duration-300 text-base shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Create my resume
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('templates');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-2 border border-[#e2e8f0] bg-white text-[#11101d] hover:border-[#c7d2fe] hover:bg-[#eef2ff] font-semibold rounded-xl px-7 py-3.5 transition-all text-base"
              >
                View templates
              </button>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4 text-sm text-[#64748b]"
            >
              {[
                '39% more likely to land the job',
                'No credit card required',
                'Export to PDF free',
              ].map((text) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 flex-shrink-0 text-[#4f46e5]" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Resume mockup */}
          <motion.div
            className="relative flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
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
                  <div className="flex flex-wrap gap-2 text-[10px] text-[#64748b] mt-1.5">
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
                  <div className="text-[10px] font-semibold text-[#64748b] uppercase tracking-widest mb-2">
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
                          <span className="text-[9px] text-[#64748b]">
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
                  <div className="text-[10px] font-semibold text-[#64748b] uppercase tracking-widest mb-2">
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
              <motion.div
                className="absolute -top-4 -right-4 sm:-right-8 bg-white border border-[#e2e8f0] rounded-xl shadow-md px-3 py-2 flex items-center gap-2"
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
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
              </motion.div>

              {/* Floating AI chip */}
              <motion.div
                className="absolute -bottom-4 -left-4 sm:-left-8 bg-white border border-[#e2e8f0] rounded-xl shadow-md px-3 py-2 flex items-center gap-2 max-w-[180px]"
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
              >
                <div className="w-7 h-7 rounded-full bg-[#eef2ff] flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-[#4f46e5]" />
                </div>
                <div>
                  <div className="text-[9px] font-bold text-[#11101d]">
                    AI Suggestion
                  </div>
                  <div className="text-[8px] text-[#64748b] leading-tight">
                    Add &quot;OKRs&quot; to match 4 more jobs
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="py-10 bg-white border-y border-[#e2e8f0]">
        <motion.div
          className="max-w-6xl mx-auto px-5 sm:px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
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
                  <div className="flex items-end gap-1 mt-3">
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
                  <div className="text-xs font-semibold uppercase tracking-widest text-[#64748b] mt-1">
                    {s.label}
                  </div>
                </div>
              )
            )}
          </div>
        </motion.div>
      </section>

      {/* ── WHY RESUMECANVAS ── */}
      <section
        id="features"
        className="py-20 sm:py-28 px-5 sm:px-8 bg-[#f5f3ff]"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4f46e5] mb-3">
              AI-POWERED RESUME BUILDER
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#11101d] leading-tight max-w-2xl">
              Why job seekers choose ResumeCanvas
            </h2>
            <p className="text-[#64748b] text-base mt-3 max-w-xl leading-relaxed">
              Built for speed, ATS compliance, and real results. Not just pretty
              templates.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerFast}
          >
            {FEATURES.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeInUp}
                className="flex gap-5 p-6 rounded-2xl border border-[#e2e8f0] bg-white hover:border-[#c7d2fe] card-hover"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#eef2ff] flex items-center justify-center flex-shrink-0">
                  <f.icon className="h-6 w-6 text-[#4f46e5]" />
                </div>
                <div>
                  <h3 className="font-bold text-[#11101d] mb-1">{f.title}</h3>
                  <p className="text-sm text-[#64748b] leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <div id="templates">
        <TemplateSection />
      </div>

      {/* ── EVERYTHING YOU NEED ── */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="mb-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4f46e5] mb-3">
              BUILT FOR RESULTS
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#11101d] leading-tight max-w-2xl">
              Everything you need to stand out
            </h2>
            <p className="text-[#64748b] text-base mt-3 max-w-xl leading-relaxed">
              Powerful AI tools and professional templates built for modern job
              seekers.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
          >
            {TOOLS.map((tool) => (
              <motion.div
                key={tool.title}
                variants={scaleIn}
                className="rounded-2xl border border-[#e2e8f0] bg-white p-7 hover:border-[#c7d2fe] card-hover cursor-default"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#eef2ff] flex items-center justify-center mb-5">
                  <tool.icon className="h-5 w-5 text-[#4f46e5]" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-[#11101d]">{tool.title}</h3>
                  {tool.tag && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#eef2ff] text-[#4f46e5]">
                      {tool.tag}
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#64748b] leading-relaxed">
                  {tool.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section
        id="reviews"
        className="py-20 sm:py-28 px-5 sm:px-8 bg-[#f5f3ff]"
      >
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="mb-14" variants={fadeInUp}>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#4f46e5] mb-3">
              SUCCESS STORIES
            </p>
            <div className="flex items-end justify-between flex-wrap gap-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#11101d] leading-tight">
                Loved by job seekers
              </h2>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>
            <p className="text-[#64748b] text-base mt-3 leading-relaxed">
              From big tech to startups, see who&apos;s getting hired
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.name}
                variants={scaleIn}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-7 hover:border-[#c7d2fe] card-hover"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <p className="text-[#11101d] leading-relaxed mb-6">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="border-t border-[#e2e8f0] pt-5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#eef2ff] flex items-center justify-center text-sm font-bold text-[#4f46e5] flex-shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-[#11101d] text-sm">
                      {t.name}
                    </div>
                    <div className="text-xs text-[#64748b]">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 sm:py-28 px-5 sm:px-8 bg-white">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative rounded-2xl overflow-hidden bg-[#1e1b4b] text-white px-8 py-16 sm:px-16 sm:py-20 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:20px_20px]" />
            <div className="relative z-10">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#818cf8] mb-4">
                START FOR FREE
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold mb-4 leading-tight text-white">
                Ready to get hired?
              </h2>
              <p className="text-[#94a3b8] text-base sm:text-lg max-w-lg mx-auto mb-10 leading-relaxed">
                Join 50,000+ professionals who landed their dream jobs with
                AI-powered resumes.
              </p>
              <button
                onClick={() => router.push('/auth/signin')}
                className="inline-flex items-center gap-2 bg-white text-[#1e1b4b] hover:bg-[#eef2ff] font-semibold rounded-xl px-7 py-3.5 text-base transition-colors"
              >
                Create my resume, it&apos;s free
                <ArrowRight className="h-4 w-4" />
              </button>
              <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-8 text-sm text-[#94a3b8]">
                {['No credit card', 'Free forever', 'Export to PDF'].map(
                  (item) => (
                    <div key={item} className="flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-[#818cf8]" />
                      <span>{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-[#e2e8f0] py-10 px-5 sm:px-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="font-extrabold text-base">
            <span className="text-[#11101d]">Resume</span>
            <span className="text-canvas-gradient">Canvas</span>
            <span className="text-[#64748b] font-normal text-sm ml-2">
              © 2025
            </span>
          </span>
          <div className="flex gap-8 text-sm text-[#64748b]">
            {['Privacy', 'Terms', 'Support'].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-[#11101d] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
