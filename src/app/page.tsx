'use client';

import { useRouter } from 'next/navigation';
import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TemplateSection from '@/components/resume/TemplateSection';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Check,
  Target,
  Rocket,
  Star,
  Brain,
  Shield,
} from 'lucide-react';
import { fadeInUp, scaleIn, staggerContainer } from '@/lib/motion/variants';

const stats = [
  { value: '50K+', label: 'Resumes Created' },
  { value: '95%', label: 'ATS Pass Rate' },
  { value: '4.9/5', label: 'User Rating' },
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Writing',
    description:
      'Generate professional bullet points tailored to any job in seconds',
  },
  {
    icon: Target,
    title: 'ATS Optimization',
    description: 'Score 90+ on ATS systems with keyword-optimized content',
  },
  {
    icon: Zap,
    title: 'Instant Templates',
    description: 'Switch between 5 professional templates with one click',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Your data is encrypted and never shared with third parties',
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer',
    company: 'Google',
    content:
      'Landed 3 interviews in my first week. The ATS optimization is incredible!',
    rating: 5,
  },
  {
    name: 'Michael Rodriguez',
    role: 'Product Manager',
    company: 'Amazon',
    content:
      "Best resume builder I've used. The AI suggestions saved me hours.",
    rating: 5,
  },
  {
    name: 'Emily Watson',
    role: 'Data Scientist',
    company: 'Microsoft',
    content: 'Professional templates and easy customization. Got my dream job!',
    rating: 5,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const navY = useTransform(scrollY, [0, 100], [0, -100]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/30 to-white overflow-x-hidden">
      {/* Floating Nav */}
      <motion.nav
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-white/80 backdrop-blur-xl rounded-full border shadow-lg"
        style={{ opacity: navOpacity, y: navY }}
      >
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              ResumeCanvas
            </span>
            <Badge variant="secondary" className="text-xs">
              AI
            </Badge>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <a href="#features" className="hover:text-blue-600 transition">
              Features
            </a>
            <a href="#templates" className="hover:text-blue-600 transition">
              Templates
            </a>
            <a href="#testimonials" className="hover:text-blue-600 transition">
              Reviews
            </a>
          </div>
          <Button size="sm" onClick={() => router.push('/auth/signin')}>
            Get Started
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        </div>

        <motion.div
          className="max-w-7xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <Badge className="mb-6 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Trusted by 50,000+ professionals
            </Badge>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent leading-tight"
            variants={fadeInUp}
          >
            Land Your Dream Job
            <br />
            With AI-Powered Resumes
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            variants={fadeInUp}
          >
            Create ATS-optimized resumes in minutes. AI writes, you customize.
            Get hired faster with professional templates trusted by recruiters.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            variants={fadeInUp}
          >
            <Button
              size="lg"
              className="px-8 py-6 text-lg group"
              onClick={() => router.push('/auth/signin')}
            >
              Start Building Free
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-6 text-lg"
              onClick={() => router.push('/resume/demo')}
            >
              View Sample
            </Button>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-gray-600"
            variants={fadeInUp}
          >
            {[
              'No credit card required',
              'Free forever',
              'Export to PDF',
              'ATS-optimized',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="max-w-5xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-white/60 backdrop-blur border"
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <div className="text-4xl font-black text-blue-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <Badge className="mb-4">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Everything You Need to Get Hired
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful AI tools and professional templates designed to help you
              stand out
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-2xl bg-white border hover:shadow-xl transition group"
                variants={scaleIn}
                whileHover={{ scale: 1.05, y: -8 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:bg-blue-600 transition">
                  <feature.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition" />
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <TemplateSection />

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6">
        <motion.div
          className="max-w-7xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <Badge className="mb-4">Testimonials</Badge>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Loved by Job Seekers Worldwide
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                className="p-6 rounded-2xl bg-white border"
                variants={scaleIn}
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-blue-50">
        <motion.div
          className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-white border-2 border-blue-100 shadow-xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-6">
            <Rocket className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Join 50,000+ professionals who got hired faster with AI-powered
            resumes
          </p>
          <Button
            size="lg"
            className="px-10 py-7 text-lg font-semibold bg-blue-600 hover:bg-blue-700"
            onClick={() => router.push('/auth/signin')}
          >
            Start Building Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <div className="flex justify-center gap-8 mt-8 text-sm text-gray-600">
            {['No credit card', 'Free forever', 'Export to PDF'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-600" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              ResumeCanvas
            </span>
            <Badge variant="secondary" className="text-xs">
              AI
            </Badge>
            <span>© 2025</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-600 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              Terms
            </a>
            <a href="#" className="hover:text-blue-600 transition">
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
