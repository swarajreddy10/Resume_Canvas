'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import TemplateGallery from '@/components/resume/TemplateGallery';
import {
  Sparkles,
  Shield,
  ArrowRight,
  Check,
  Wand2,
  LayoutPanelTop,
  Gauge,
} from 'lucide-react';

const features = [
  {
    title: 'AI Writer',
    description: 'Tailor bullet points to every job in seconds.',
    icon: Wand2,
  },
  {
    title: 'ATS Check',
    description:
      'Pass screening with keywords and structure recruiters expect.',
    icon: Gauge,
  },
  {
    title: 'One-click styling',
    description: 'Swap templates and spacing without reformatting.',
    icon: LayoutPanelTop,
  },
];

const trustPoints = [
  'Free forever',
  'No credit card',
  'ATS-ready templates',
  'Instant PDF',
];

const steps = [
  { label: 'Pick a template', text: 'Choose a modern, ATS-friendly layout.' },
  {
    label: 'Add your details',
    text: 'AI assists with bullets, summaries, and keywords.',
  },
  { label: 'Publish & share', text: 'Export, share, or download instantly.' },
];

export default function HomePage() {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/auth/signin');
  };

  return (
    <div className="min-h-screen text-foreground">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-[-10%] top-[-20%] h-[320px] w-[320px] rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute right-[-10%] bottom-[-10%] h-[280px] w-[280px] rounded-full bg-blue-300/25 blur-[120px]" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white via-white/70 to-transparent" />
        </div>

        {/* Navigation */}
        <nav className="sticky top-0 z-50 border-b border-white/40 bg-white/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 md:px-8 lg:px-16 py-3 sm:py-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-gradient-primary tracking-tight">
                ResumeCanvas
              </span>
              <span className="rounded-full bg-primary/10 px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-semibold text-primary">
                AI
              </span>
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handleSignIn}
              className="text-xs sm:text-sm px-3 sm:px-4"
            >
              Sign in
            </Button>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative mx-auto max-w-7xl px-6 pb-20 pt-14 md:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur">
                <Sparkles className="h-4 w-4" />
                AI resume builder for modern professionals
              </div>
              <div className="space-y-4">
                <h1 className="text-4xl leading-tight font-black text-slate-900 md:text-5xl lg:text-6xl">
                  Land more interviews with
                  <span className="block text-gradient-primary">
                    ResumeCanvas
                  </span>
                  Resume Builder
                </h1>
                <p className="text-lg text-foreground/70 md:text-xl">
                  ATS check, AI writer, and one-click tailoring to stand out to
                  recruiters. Design once, adapt to every role in seconds.
                </p>
              </div>
              <Button
                size="lg"
                className="px-8 py-6 text-base"
                onClick={handleSignIn}
              >
                Build Your Resume Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <div className="flex flex-wrap items-center gap-3 text-sm text-foreground/60">
                {trustPoints.map((point) => (
                  <div key={point} className="inline-flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-primary" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 -top-8 h-24 w-24 rounded-full bg-primary/15 blur-3xl" />
              <div className="absolute right-0 top-12 h-16 w-16 rounded-full bg-blue-400/30 blur-xl" />
              <div className="glass-panel relative mx-auto w-full max-w-lg rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Hired-ready
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground/60">
                    <Shield className="h-4 w-4 text-primary" />
                    Secure cloud save
                  </div>
                </div>
                <div className="mt-6 space-y-4 rounded-2xl bg-white/70 p-4 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.08em] text-foreground/60">
                        Resume preview
                      </p>
                      <p className="text-sm font-semibold text-foreground/80">
                        Annie Levy
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-primary">
                      <Sparkles className="h-4 w-4" />
                      AI tailored
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/60 bg-gradient-to-br from-white via-white/80 to-blue-50/60 p-3 shadow-sm">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/70">
                        <span>Page margin</span>
                        <span className="text-primary">1.0</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-blue-100">
                        <div className="h-2 w-3/4 rounded-full bg-primary" />
                      </div>
                      <p className="mt-3 text-[11px] text-foreground/60">
                        Compact, ATS friendly
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/60 bg-gradient-to-br from-white via-white/80 to-blue-50/60 p-3 shadow-sm">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-foreground/70">
                        <span>ATS score</span>
                        <span className="text-primary">92</span>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-[11px] text-foreground/60">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary/30 bg-white text-primary font-bold">
                          92
                        </div>
                        Optimized keywords
                      </div>
                      <p className="mt-3 text-[11px] text-foreground/60">
                        Matching role: Product Designer
                      </p>
                    </div>
                  </div>
                  <div className="rounded-xl border border-white/70 bg-white/90 p-4 shadow-sm">
                    <p className="text-xs font-semibold text-foreground/70">
                      Layout options
                    </p>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-[11px] font-semibold text-foreground/70">
                      <div className="rounded-full bg-blue-50 px-3 py-2 text-primary shadow-sm">
                        Modern
                      </div>
                      <div className="rounded-full border border-white/60 bg-white px-3 py-2">
                        Executive
                      </div>
                      <div className="rounded-full border border-white/60 bg-white px-3 py-2">
                        Creative
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-[11px] text-foreground/60">
                      <span>Share link</span>
                      <span className="font-semibold text-primary">
                        ResumeCanvas.dev/annie
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Trust + features */}
      <section id="features" className="mx-auto max-w-7xl px-6 pb-16 sm:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Card className="p-8">
            <CardHeader className="p-0">
              <CardTitle className="text-2xl">Why ResumeCanvas?</CardTitle>
              <CardDescription className="text-base">
                Everything you need to create professional resumes that get
                results.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-6 grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <p className="mt-4 text-base font-semibold text-foreground">
                    {feature.title}
                  </p>
                  <p className="text-sm text-foreground/65">
                    {feature.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="p-7">
            <CardHeader className="p-0">
              <CardTitle className="text-xl">How it works</CardTitle>
              <CardDescription className="text-base">
                Three simple steps to publish your resume.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-6 space-y-5">
              {steps.map((step, idx) => (
                <div key={step.label} className="relative pl-12">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {idx + 1}
                  </div>
                  <p className="text-base font-semibold text-foreground">
                    {step.label}
                  </p>
                  <p className="text-sm text-foreground/65">{step.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Templates */}
      <section
        id="templates"
        className="mx-auto max-w-7xl px-6 pb-16 sm:pb-24 space-y-8"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            Templates
          </p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Choose a layout that fits your story
          </h2>
          <p className="text-base text-foreground/65">
            All templates are ATS-friendly, editable, and ready to share.
          </p>
        </div>
        <TemplateGallery
          selectedTemplate="tech"
          onTemplateSelect={() => router.push('/auth/signin')}
        />
      </section>

      {/* CTA */}
      <section
        id="pricing"
        className="mx-6 mb-16 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-sky-400 px-8 py-12 shadow-[0_24px_70px_-35px_rgba(37,99,235,0.6)] sm:mx-auto sm:max-w-6xl"
      >
        <div className="flex flex-col items-start gap-6 text-white lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">
              Ready when you are
            </p>
            <h3 className="text-3xl font-bold sm:text-4xl">
              Start free, publish in minutes
            </h3>
            <p className="text-white/80">
              AI assistance, live preview, and instant sharing built in.
            </p>
          </div>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-primary hover:bg-white/90 px-8"
            onClick={handleSignIn}
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/60 bg-white/70 backdrop-blur py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-foreground/70 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="text-lg font-black text-gradient-primary tracking-tight">
              ResumeCanvas
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-1 text-[11px] font-semibold text-primary">
              © 2025
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-foreground">
              Product
            </a>
            <a href="#" className="hover:text-foreground">
              Support
            </a>
            <a href="#" className="hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
