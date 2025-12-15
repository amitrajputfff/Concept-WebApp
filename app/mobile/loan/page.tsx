'use client';

import { ProtectedRoute, useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Calendar, DollarSign, TrendingDown, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const loanDetails = {
  original: 30000,
  balance: 25200,
  disbursed: '2024-09-15',
  rate: '8%',
  estimatedCompletion: '2024-12-06',
  paymentsMode: 31,
  totalPaid: 4800,
};

const recentPayments = [
  { date: '2024-12-15', amount: 240, balance: 25200 },
  { date: '2024-12-14', amount: 280, balance: 25440 },
  { date: '2024-12-13', amount: 320, balance: 25720 },
  { date: '2024-12-12', amount: 200, balance: 26040 },
  { date: '2024-12-11', amount: 360, balance: 26240 },
];

function LoanContent() {
  const router = useRouter();
  const { user } = useAuth();

  const progressPercentage = ((loanDetails.totalPaid / loanDetails.original) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50 max-w-[600px] mx-auto">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/mobile')}>
            <ChevronLeft size={24} />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-base sm:text-lg truncate">Loan Details</h1>
            <p className="text-xs text-muted-foreground truncate">{user?.business}</p>
          </div>
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shrink-0">Active</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-4">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="text-sm text-teal-100 mb-1">Current Balance</div>
            <div className="text-4xl font-bold mb-6">${loanDetails.balance.toLocaleString()}</div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-teal-100">Progress</span>
                <span className="font-semibold">{progressPercentage}% paid</span>
              </div>
              <Progress value={parseFloat(progressPercentage)} className="h-2 bg-teal-800" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-teal-100">Total Paid</div>
                <div className="font-semibold">${loanDetails.totalPaid.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-teal-100">Remaining</div>
                <div className="font-semibold">${loanDetails.balance.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loan Info */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Original Amount</span>
              </div>
              <span className="font-semibold">${loanDetails.original.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Disbursed</span>
              </div>
              <span className="font-semibold">
                {new Date(loanDetails.disbursed).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Daily Rate</span>
              </div>
              <span className="font-semibold">{loanDetails.rate} of sales</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Est. Completion</span>
              </div>
              <span className="font-semibold">
                {new Date(loanDetails.estimatedCompletion).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Recent Payments</h2>
            <Button variant="ghost" size="sm" onClick={() => router.push('/mobile/activity')}>
              View All
            </Button>
          </div>

          <div className="space-y-2">
            {recentPayments.map((payment, i) => (
              <Card key={i}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Balance: ${payment.balance.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">-${payment.amount}</div>
                      <Badge variant="outline" className="text-xs">
                        Paid
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <Card className="bg-teal-50 border-teal-200">
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-2">Questions about your loan?</div>
            <p className="text-xs text-muted-foreground mb-3">
              Chat with Clara anytime for payment details, balance updates, or financing options.
            </p>
            <Button className="w-full" variant="outline">
              Chat with Clara
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoanPage() {
  return (
    <ProtectedRoute allowedRoles={['merchant']}>
      <LoanContent />
    </ProtectedRoute>
  );
}

