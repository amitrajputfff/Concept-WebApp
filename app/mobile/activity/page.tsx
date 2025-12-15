'use client';

import { ProtectedRoute, useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

const transactions = [
  { id: 1, date: '2024-12-15', type: 'payment', amount: 240, balance: 25200, sales: 3000 },
  { id: 2, date: '2024-12-14', type: 'payment', amount: 280, balance: 25440, sales: 3500 },
  { id: 3, date: '2024-12-13', type: 'payment', amount: 320, balance: 25720, sales: 4000 },
  { id: 4, date: '2024-12-12', type: 'payment', amount: 200, balance: 26040, sales: 2500 },
  { id: 5, date: '2024-12-11', type: 'payment', amount: 360, balance: 26240, sales: 4500 },
];

const upcomingPayments = [
  { date: '2024-12-16', estimated: 264, sales: 3300 },
  { date: '2024-12-17', estimated: 280, sales: 3500 },
  { date: '2024-12-18', estimated: 1568, sales: 19600 }, // Game Day
];

function ActivityContent() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Phone Frame - Responsive: Full screen on mobile, frame on desktop */}
      <div className="w-full h-full sm:w-[390px] sm:h-[844px] sm:max-h-[90vh] bg-black sm:rounded-[3rem] shadow-2xl relative sm:border-[12px] border-slate-900">
        {/* Dynamic Island / Notch - Only on desktop */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20"></div>

        {/* Screen Content */}
        <div className="w-full h-full bg-slate-50 sm:rounded-[2rem] overflow-hidden relative">
          {/* Header */}
          <div className="bg-white border-b sticky top-0 z-10">
        <div className="p-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push('/mobile')}>
            <ChevronLeft size={24} />
          </Button>
          <div className="flex-1">
            <h1 className="font-bold text-base sm:text-lg">Activity</h1>
            <p className="text-xs text-muted-foreground">{user?.business}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-4">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="text-sm text-teal-100 mb-1">Current Loan Balance</div>
            <div className="text-3xl font-bold mb-4">$25,200</div>
            <div className="flex justify-between text-sm">
              <div>
                <div className="text-teal-100">Original Amount</div>
                <div className="font-semibold">$30,000</div>
              </div>
              <div className="text-right">
                <div className="text-teal-100">Remaining</div>
                <div className="font-semibold">84%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">Payment History</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-3 mt-4">
            <div className="text-sm font-medium text-muted-foreground px-1">Recent Payments</div>
            {transactions.map((tx) => (
              <Card key={tx.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <TrendingDown className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="font-semibold">Daily Payment</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600">-${tx.amount}</div>
                      <div className="text-xs text-muted-foreground">${tx.sales} sales</div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>New Balance</span>
                    <span className="font-medium">${tx.balance.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-3 mt-4">
            <div className="text-sm font-medium text-muted-foreground px-1">Projected Payments</div>
            {upcomingPayments.map((payment, i) => (
              <Card key={i} className={payment.sales > 10000 ? 'border-teal-200 bg-teal-50' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          payment.sales > 10000 ? 'bg-teal-600' : 'bg-slate-100'
                        }`}
                      >
                        <Calendar
                          className={`h-5 w-5 ${
                            payment.sales > 10000 ? 'text-white' : 'text-slate-600'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-semibold">
                          {new Date(payment.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                        <div className="text-xs text-muted-foreground">Estimated payment</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">~${payment.estimated}</div>
                      <div className="text-xs text-muted-foreground">${payment.sales} projected</div>
                    </div>
                  </div>
                  {payment.sales > 10000 && (
                    <Badge className="w-full justify-center bg-teal-600 hover:bg-teal-700">
                      Game Day - High Volume Expected
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium mb-3">7-Day Summary</div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Total Paid</div>
                <div className="text-lg font-bold text-emerald-600">$1,400</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Avg. Daily</div>
                <div className="text-lg font-bold">$280</div>
              </div>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActivityPage() {
  return (
    <ProtectedRoute allowedRoles={['merchant']}>
      <ActivityContent />
    </ProtectedRoute>
  );
}

