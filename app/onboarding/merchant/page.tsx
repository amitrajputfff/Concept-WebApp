'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute, useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MessageSquare, Zap, Smartphone, CheckCircle, ArrowRight, SkipForward, DollarSign } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Welcome',
    description: 'Meet your AI CFO agent',
    icon: MessageSquare,
    content: {
      heading: 'Welcome Maria! 🎉',
      subheading: 'Meet Clara, your personal CFO agent',
      features: [
        'Proactive funding when you need it',
        'No paperwork or credit checks',
        'Flexible daily repayment model',
        'Instant approval & same-day funds',
      ],
    },
  },
  {
    id: 2,
    title: 'How It Works',
    description: 'Simple, flexible, and transparent',
    icon: Zap,
    content: {
      heading: 'Smart Lending, Made Simple',
      subheading: 'How Propel works for Taco Rico',
      features: [
        'We monitor your business in real-time',
        'Clara alerts you to opportunities',
        'Accept offers with one tap',
        'Repay 8% of daily sales automatically',
      ],
    },
  },
  {
    id: 3,
    title: 'Quick Tour',
    description: 'Navigate your mobile dashboard',
    icon: Smartphone,
    content: {
      heading: 'Your Business Dashboard',
      subheading: 'Everything at your fingertips',
      features: [
        'Home - View alerts & notifications',
        'Activity - Track payments & sales',
        'Growth - Get AI-powered insights',
        'Chat with Clara anytime',
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
    localStorage.setItem('propel_onboarding_complete_merchant', 'true');
    router.push('/mobile');
  };

  const step = steps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-3 sm:p-4">
      {/* Mobile Phone Frame */}
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-slate-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSkip} className="text-slate-500">
              <SkipForward className="h-4 w-4 mr-1" />
              Skip
            </Button>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main Card */}
        <Card className="shadow-2xl border-2 overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-teal-600 to-emerald-600 p-6 text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <Badge variant="secondary" className="mx-auto mb-3 bg-white/20 text-white border-white/30">
              {step.title}
            </Badge>
            <h2 className="text-2xl font-bold text-center mb-2">{step.content.heading}</h2>
            <p className="text-teal-100 text-center text-sm">{step.content.subheading}</p>
          </div>

          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-2">
              {step.content.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-teal-50 border border-teal-100"
                >
                  <CheckCircle className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            {currentStep === steps.length - 1 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                <DollarSign className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-emerald-900">
                  You have a $30,000 Game Day Package waiting!
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              {currentStep > 0 && (
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              <Button onClick={handleNext} className="flex-1 bg-teal-600 hover:bg-teal-700" size="lg">
                {currentStep === steps.length - 1 ? (
                  <>
                    View Dashboard
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
            {user?.business} • {user?.location}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MerchantOnboardingPage() {
  return (
    <ProtectedRoute allowedRoles={['merchant']}>
      <OnboardingContent />
    </ProtectedRoute>
  );
}

