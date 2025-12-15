'use client';

import { ProtectedRoute, useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, TrendingUp, Lightbulb, Target, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const salesData = [
  { day: 'Mon', sales: 3200 },
  { day: 'Tue', sales: 2800 },
  { day: 'Wed', sales: 3600 },
  { day: 'Thu', sales: 3900 },
  { day: 'Fri', sales: 4500 },
  { day: 'Sat', sales: 5200 },
  { day: 'Sun', sales: 4800 },
];

const insights = [
  {
    title: 'Game Day Opportunity',
    description: 'Saturday shows 280% spike potential. Your funding is perfectly timed!',
    impact: 'high',
    icon: Target,
  },
  {
    title: 'Weekend Performance',
    description: 'Weekend sales consistently 40% above weekday average',
    impact: 'medium',
    icon: TrendingUp,
  },
  {
    title: 'Inventory Optimization',
    description: 'Consider stocking up wings on Thursdays for weekend demand',
    impact: 'medium',
    icon: Lightbulb,
  },
];

function GrowthContent() {
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
            <h1 className="font-bold text-base sm:text-lg">Growth Insights</h1>
            <p className="text-xs text-muted-foreground">{user?.business}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 space-y-4">
        {/* Growth Summary */}
        <Card className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5" />
              <div className="text-sm">AI-Powered Insights</div>
            </div>
            <div className="text-2xl font-bold mb-1">Your Business is Growing!</div>
            <div className="text-emerald-100 text-sm">
              Revenue up 23% this month with Propel funding
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="insights" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-3 mt-4">
            <div className="text-sm font-medium text-muted-foreground px-1">
              Recommendations for Taco Rico
            </div>
            {insights.map((insight, i) => {
              const Icon = insight.icon;
              return (
                <Card key={i} className={insight.impact === 'high' ? 'border-teal-200 bg-teal-50' : ''}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          insight.impact === 'high' ? 'bg-teal-600' : 'bg-slate-100'
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            insight.impact === 'high' ? 'text-white' : 'text-slate-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-semibold">{insight.title}</div>
                          {insight.impact === 'high' && (
                            <Badge className="bg-teal-600 hover:bg-teal-700">High Impact</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">{insight.description}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="trends" className="space-y-3 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">7-Day Sales Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={salesData}>
                    <XAxis
                      dataKey="day"
                      tick={{ fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        opacity: 1,
                      }}
                      labelStyle={{ color: '#0f172a', fontWeight: 600 }}
                      itemStyle={{ color: '#0d9488', fontWeight: 700 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#0d9488"
                      strokeWidth={2}
                      dot={{ fill: '#0d9488' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Avg. Daily Sales</div>
                    <div className="text-2xl font-bold">$4,007</div>
                    <div className="text-xs text-emerald-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3" />
                      +15% vs last week
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Best Day</div>
                    <div className="text-2xl font-bold">Saturday</div>
                    <div className="text-xs text-muted-foreground mt-1">$5,200 average</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Funding Impact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Funding Impact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <div>
                <div className="text-sm font-medium">Revenue Protected</div>
                <div className="text-xs text-muted-foreground">From Game Day funding</div>
              </div>
              <div className="text-xl font-bold text-emerald-600">+$12,000</div>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div>
                <div className="text-sm font-medium">ROI</div>
                <div className="text-xs text-muted-foreground">Return on investment</div>
              </div>
              <div className="text-xl font-bold">400%</div>
            </div>

            <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
              <div>
                <div className="text-sm font-medium">Cost of Capital</div>
                <div className="text-xs text-muted-foreground">Total interest paid</div>
              </div>
              <div className="text-xl font-bold text-teal-700">$2,400</div>
            </div>
          </CardContent>
        </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GrowthPage() {
  return (
    <ProtectedRoute allowedRoles={['merchant']}>
      <GrowthContent />
    </ProtectedRoute>
  );
}

