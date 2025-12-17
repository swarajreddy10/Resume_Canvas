'use client';

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, ArrowLeft, Chrome, Shield, Zap } from 'lucide-react';

export default function SignInPage() {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ResumeCanvas
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome to ResumeCanvas
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Sign in to start building your professional resume with
                AI-powered tools
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={handleGoogleSignIn}
                className="w-full bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
                size="lg"
              >
                <Chrome className="w-5 h-5 mr-3" />
                Continue with Google
              </Button>

              <div className="space-y-4 pt-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="w-4 h-4 mr-2 text-green-600" />
                  <span>Secure authentication with Google OAuth</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Zap className="w-4 h-4 mr-2 text-blue-600" />
                  <span>Get started in less than 30 seconds</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-4">
              What you&apos;ll get access to:
            </p>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex items-center justify-center space-x-2 text-gray-700">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span>AI-powered resume content generation</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-700">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>Professional templates and ATS optimization</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-gray-700">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span>Job application tracking and interview prep</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
