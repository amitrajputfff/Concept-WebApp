'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute, useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, TrendingUp, ShieldCheck, CheckCircle, ArrowRight, SkipForward } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Welcome to Propel Capital',
    description: 'Your AI-powered lending intelligence platform',
    icon: Zap,
    content: {
      heading: 'Hello Jane! 👋',
      subheading: 'Let\'s get you started with Propel Capital',
      features: [
        'AI-powered opportunity detection',
        'Real-time merchant monitoring',
        'Instant risk assessment',
        'Automated approval workflows',
      ],
    },
  },
  {
    id: 2,
    title: 'Feature Tour',
    description: 'Discover powerful tools at your fingertips',
    icon: TrendingUp,
    content: {
      heading: 'Parse.AI Intelligence',
      subheading: 'How we detect lending opportunities',
      features: [
        'Real-time transaction monitoring',
        'Inventory & cash flow analysis',
        'Event-based opportunity detection',
        'Predictive revenue modeling',
      ],
    },
  },
  {
    id: 3,
    title: 'Dashboard Walkthrough',
    description: 'Navigate your lending portfolio with ease',
    icon: ShieldCheck,
    content: {
      heading: 'Your Command Center',
      subheading: 'Everything you need in one place',
      features: [
        'Opportunity Radar - Find high-value deals',
        'Active Loans - Track all financing',
        'Risk Controls - Set your parameters',
        'Analytics - Measure performance',
      ],
    },
  },
];

function OnboardingContent() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const { user } = useAuth();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    localStorage.setItem('propel_onboarding_complete_lender', 'true');
    router.push('/dashboard');
  };

  const step = steps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-slate-500">
              <SkipForward className="h-4 w-4 mr-1" />
              Skip Tour
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-200">
              <Icon className="w-10 h-10 text-white" />
            </div>
            <Badge variant="outline" className="mx-auto mb-3">
              {step.title}
            </Badge>
            <CardTitle className="text-3xl mb-2">{step.content.heading}</CardTitle>
            <CardDescription className="text-base">{step.content.subheading}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid gap-3">
              {step.content.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <CheckCircle className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button onClick={handleNext} className="flex-1" size="lg">
                {currentStep === steps.length - 1 ? (
                  <>
                    Get Started
                    <CheckCircle className="ml-2 h-5 w-5" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* User Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500">
            Logged in as <span className="font-semibold">{user?.name}</span> • Propel Capital Admin
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LenderOnboardingPage() {
  return (
    <ProtectedRoute allowedRoles={['lender']}>
      <OnboardingContent />
    </ProtectedRoute>
  );
}

