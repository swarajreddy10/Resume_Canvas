'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  FileText,
  User,
  Briefcase,
  Target,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: 'Welcome to ResumeCanvas',
    description: "Let's get you set up with a professional resume in minutes",
    icon: <Sparkles className="w-6 h-6" />,
  },
  {
    id: 2,
    title: 'Tell us about yourself',
    description: 'Basic information to personalize your experience',
    icon: <User className="w-6 h-6" />,
  },
  {
    id: 3,
    title: 'Your career goals',
    description: 'Help us tailor recommendations for your industry',
    icon: <Target className="w-6 h-6" />,
  },
  {
    id: 4,
    title: 'Ready to build',
    description: "You're all set! Let's create your first resume",
    icon: <FileText className="w-6 h-6" />,
  },
];

interface OnboardingData {
  firstName: string;
  lastName: string;
  jobTitle: string;
  industry: string;
  experience: string;
}

interface UserOnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export default function UserOnboarding({ onComplete }: UserOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    jobTitle: '',
    industry: '',
    experience: '',
  });

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isStepComplete = () => {
    switch (currentStep) {
      case 1:
        return true;
      case 2:
        return formData.firstName && formData.lastName;
      case 3:
        return formData.jobTitle && formData.industry;
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }
                `}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                    w-16 h-1 mx-2
                    ${currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}
                  `}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center">
            Step {currentStep} of {steps.length}
          </p>
        </div>

        {/* Content Card */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
              {steps[currentStep - 1].icon}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              {steps[currentStep - 1].description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step 1: Welcome */}
            {currentStep === 1 && (
              <div className="text-center space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <FileText className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 mb-1">
                      AI-Powered
                    </h3>
                    <p className="text-sm text-gray-600">
                      Smart content generation
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 mb-1">
                      ATS Optimized
                    </h3>
                    <p className="text-sm text-gray-600">
                      Pass applicant tracking systems
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <Briefcase className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Professional
                    </h3>
                    <p className="text-sm text-gray-600">
                      Expert-designed templates
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Personal Info */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange('firstName', e.target.value)
                      }
                      placeholder="John"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange('lastName', e.target.value)
                      }
                      placeholder="Doe"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Career Info */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="jobTitle">Current/Target Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleInputChange('jobTitle', e.target.value)
                    }
                    placeholder="Software Engineer"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) =>
                      handleInputChange('industry', e.target.value)
                    }
                    placeholder="Technology"
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Ready */}
            {currentStep === 4 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    You&apos;re all set, {formData.firstName}!
                  </h3>
                  <p className="text-gray-600">
                    Ready to create your first professional resume with AI
                    assistance.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={!isStepComplete()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {currentStep === steps.length ? 'Start Building' : 'Continue'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
