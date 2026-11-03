import { SignInForm } from '@/components/auth/SignInForm';
import { OPEN_GRAPH_BASE } from '@/lib/config/site.config';
import {
  BrainCircuit,
  Check,
  LayoutTemplate,
  LockKeyhole,
  ScanSearch,
} from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

// A Server Component: the brand panel and the form's markup are prerendered, so the
// server HTML carries the email and password fields instead of a "Loading..." fallback.
const DESCRIPTION =
  'Sign in or create a free ResumeCanvas account to build and tailor your resume.';

export const metadata: Metadata = {
  title: 'Sign in',
  description: DESCRIPTION,
  alternates: { canonical: '/auth/signin' },
  openGraph: {
    ...OPEN_GRAPH_BASE,
    title: 'Sign in | ResumeCanvas',
    description: DESCRIPTION,
    url: '/auth/signin',
  },
};

const FEATURES = [
  {
    icon: BrainCircuit,
    label: 'AI-Assisted Writing',
    desc: 'Bullets tailored to the job',
  },
  {
    icon: ScanSearch,
    label: 'ATS Keyword Check',
    desc: 'See what the job asks for',
  },
  {
    icon: LayoutTemplate,
    label: 'Templates',
    desc: '5 designs, live preview',
  },
  {
    icon: LockKeyhole,
    label: 'Private by Default',
    desc: 'Shared only if you publish',
  },
];

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-white flex">
      {/* ══ LEFT — Brand panel (hidden on mobile) ══ */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col bg-gradient-to-br from-blue-600 to-blue-800 text-white px-10 xl:px-14 py-12 relative overflow-hidden flex-shrink-0">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[length:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_80%,rgba(255,255,255,0.1),transparent)]" />

        <div className="relative z-10 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-2 group mb-auto">
            <span className="text-xl font-black tracking-tight text-white">
              Resume<span className="text-indigo-200">Canvas</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white/20 text-white/90 tracking-wide">
              AI
            </span>
          </Link>

          {/* Main copy */}
          <div className="py-12">
            <h2 className="text-4xl xl:text-5xl font-black leading-tight mb-4">
              Build a resume
              <br />
              <span className="text-indigo-200">that opens doors</span>
            </h2>
            <p className="text-indigo-100 text-base leading-relaxed mb-10">
              AI-powered tools that take you from blank page to interview-ready
              in under 10 minutes.
            </p>

            {/* Features */}
            <ul className="space-y-4 mb-10">
              {FEATURES.map(({ icon: Icon, label, desc }) => (
                <li key={label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
                    <Icon
                      aria-hidden="true"
                      className="h-4.5 w-4.5 text-white"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {label}
                    </div>
                    <div className="text-xs text-indigo-200">{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Product facts (no user counts or ratings: none are measured) */}
          <div className="flex items-center gap-8 pt-6 border-t border-white/15">
            {[
              ['5', 'Templates'],
              ['7', 'AI tools'],
              ['PDF', 'Export'],
            ].map(([val, label]) => (
              <div key={label}>
                <div className="text-lg font-black text-white">{val}</div>
                <div className="text-[10px] text-indigo-200 uppercase tracking-wider">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT — Form panel ══ */}
      <div className="flex-1 flex flex-col justify-center px-5 sm:px-10 lg:px-14 xl:px-20 py-12 bg-white overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex justify-center mb-8 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-slate-900">
              Resume<span className="text-[#4f46e5]">Canvas</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#eef2ff] text-[#3730a3] tracking-wide">
              AI
            </span>
          </Link>
        </div>

        <SignInForm />

        {/* Trust strip */}
        <ul className="w-full max-w-md mx-auto flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-slate-100">
          {['No credit card', 'Free forever', 'ATS-optimized'].map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 text-xs text-rc-muted"
            >
              <Check
                aria-hidden="true"
                className="h-3 w-3 text-emerald-600 flex-shrink-0"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
