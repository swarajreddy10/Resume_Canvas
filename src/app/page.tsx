'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Sparkles, Zap, Shield, Chrome, ArrowRight, Check } from 'lucide-react';

export default function HomePage() {
  const [showSignIn, setShowSignIn] = useState(false);

  const handleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Sign-in failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text text-transparent tracking-tight">
            CareerCanvas
          </span>
          <Button
            onClick={() => setShowSignIn(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Resume Builder
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Build Your Dream
            <span className="text-blue-600 block">Career</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Create professional resumes with AI assistance. Get hired faster
            with ATS-optimized templates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              onClick={() => setShowSignIn(true)}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
            >
              Start Building Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-gray-300"
              onClick={() => setShowSignIn(true)}
            >
              View Templates
            </Button>
          </div>
          <div className="flex items-center justify-center space-x-12 text-sm text-gray-500">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-2" />
              Free Forever
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-2" />
              No Credit Card
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-600 mr-2" />
              ATS Optimized
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose CareerCanvas?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create professional resumes that get
              results
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 bg-white p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-blue-600" />
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl mb-3">
                  AI-Powered Content
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Generate professional bullet points and descriptions with
                  advanced AI
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 bg-white p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl mb-3">ATS Optimized</CardTitle>
                <CardDescription className="text-gray-600">
                  Pass applicant tracking systems with keyword optimization
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 bg-white p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <CardHeader className="p-0">
                <CardTitle className="text-xl mb-3">Secure & Private</CardTitle>
                <CardDescription className="text-gray-600">
                  Your data is protected with enterprise-grade security
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of professionals building better careers
          </p>
          <Button
            onClick={() => setShowSignIn(true)}
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg"
          >
            Start Building Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight mb-4 md:mb-0">
              CareerCanvas
            </span>
            <p className="text-sm text-gray-500">
              © 2024 CareerCanvas. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Sign In Dialog */}
      <Dialog open={showSignIn} onOpenChange={setShowSignIn}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              CareerCanvas
            </DialogTitle>
            <DialogDescription className="text-lg font-medium text-gray-900">
              Welcome Back
            </DialogDescription>
            <DialogDescription className="text-gray-600">
              Sign in to start building your professional resume
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Button
              onClick={handleSignIn}
              className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300"
              size="lg"
            >
              <Chrome className="w-5 h-5 mr-3" />
              Continue with Google
            </Button>
            <div className="text-center text-sm text-gray-500">
              Free forever • No credit card required
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
