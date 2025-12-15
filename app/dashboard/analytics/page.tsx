'use client';

import { ProtectedRoute } from '@/lib/auth-context';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { TrendingUp, DollarSign, BarChart3, Target } from 'lucide-react';

const revenueData = [
  { month: 'Jul', revenue: 45000, target: 50000 },
  { month: 'Aug', revenue: 52000, target: 50000 },
  { month: 'Sep', revenue: 58000, target: 55000 },
  { month: 'Oct', revenue: 63000, target: 60000 },
  { month: 'Nov', revenue: 71000, target: 65000 },
  { month: 'Dec', revenue: 78000, target: 70000 },
];

const riskDistribution = [
  { name: 'Excellent (90-100)', value: 35, color: '#10b981' },
  { name: 'Good (80-89)', value: 45, color: '#0d9488' },
  { name: 'Fair (70-79)', value: 15, color: '#f59e0b' },
  { name: 'Review (60-69)', value: 5, color: '#ef4444' },
];

function AnalyticsContent() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics & Insights</h1>
            <p className="text-muted-foreground">Portfolio performance and business metrics</p>
          </div>

          {/* KPI Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$367K</div>
                <p className="text-xs text-emerald-600">+12.5% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. ROI</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">385%</div>
                <p className="text-xs text-emerald-600">Above target of 350%</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-muted-foreground">15 of 16 this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1.2M</div>
                <p className="text-xs text-emerald-600">+8.2% growth</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="revenue" className="space-y-4">
            <TabsList>
              <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
              <TabsTrigger value="risk">Risk Distribution</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="revenue" className="space-y-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-teal-600" />
                    Revenue vs Target
                  </CardTitle>
                  <CardDescription>Monthly revenue performance against targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={380}>
                    <BarChart 
                      data={revenueData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.9} />
                          <stop offset="100%" stopColor="#0d9488" stopOpacity={0.9} />
                        </linearGradient>
                        <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#cbd5e1" stopOpacity={0.8} />
                          <stop offset="100%" stopColor="#94a3b8" stopOpacity={0.8} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="#e2e8f0" 
                        opacity={0.5}
                        vertical={false}
                      />
                      <XAxis 
                        dataKey="month" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                        tickMargin={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        tickMargin={8}
                        width={70}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const revenue = payload.find(p => p.dataKey === 'revenue')?.value as number;
                            const target = payload.find(p => p.dataKey === 'target')?.value as number;
                            const difference = revenue - target;
                            const percentDiff = ((difference / target) * 100).toFixed(1);
                            
                            return (
                              <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-4 min-w-[220px]">
                                <p className="font-bold text-slate-900 mb-3 text-sm">{label}</p>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                      <div className="w-3 h-3 bg-teal-500 rounded-sm"></div>
                                      <span className="text-xs text-slate-600 font-medium">Actual</span>
                                    </div>
                                    <span className="font-bold text-teal-700">${revenue.toLocaleString()}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2">
                                      <div className="w-3 h-3 bg-slate-400 rounded-sm"></div>
                                      <span className="text-xs text-slate-600 font-medium">Target</span>
                                    </div>
                                    <span className="font-bold text-slate-700">${target.toLocaleString()}</span>
                                  </div>
                                  <div className="pt-2 mt-2 border-t border-slate-200">
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-slate-500">Variance</span>
                                      <span className={`font-bold ${difference >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {difference >= 0 ? '+' : ''}${difference.toLocaleString()} ({percentDiff}%)
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                        cursor={{ fill: 'rgba(20, 184, 166, 0.1)' }}
                      />
                      <Legend 
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="square"
                        formatter={(value) => <span className="text-sm text-slate-600">{value}</span>}
                      />
                      <Bar 
                        dataKey="revenue" 
                        fill="url(#colorRevenue)" 
                        name="Actual Revenue"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={60}
                      />
                      <Bar 
                        dataKey="target" 
                        fill="url(#colorTarget)" 
                        name="Target"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={60}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-teal-600" />
                    Portfolio Risk Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of loans by risk score categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-8">
                    <ResponsiveContainer width="100%" height={320}>
                      <PieChart>
                        <defs>
                          {riskDistribution.map((entry, index) => (
                            <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                              <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                            </linearGradient>
                          ))}
                        </defs>
                        <Pie
                          data={riskDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) => 
                            `${value}%`
                          }
                          outerRadius={100}
                          innerRadius={40}
                          fill="#8884d8"
                          dataKey="value"
                          stroke="#fff"
                          strokeWidth={3}
                        >
                          {riskDistribution.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={`url(#gradient-${index})`}
                              style={{ 
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                                transition: 'all 0.3s ease',
                              }}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0];
                              return (
                                <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-3">
                                  <p className="font-bold text-slate-900 mb-1 text-sm">{data.name}</p>
                                  <p className="text-lg font-bold" style={{ color: data.payload.color }}>
                                    {data.value}%
                                  </p>
                                  <p className="text-xs text-slate-500 mt-1">
                                    {Math.round(((data.value as number) / 100) * 16)} of 16 loans
                                  </p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="flex flex-col justify-center space-y-4">
                      {riskDistribution.map((item, index) => {
                        const loanCount = Math.round((item.value / 100) * 16);
                        return (
                          <div 
                            key={index} 
                            className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
                          >
                            <div
                              className="w-5 h-5 rounded-md shadow-sm"
                              style={{ 
                                backgroundColor: item.color,
                                background: `linear-gradient(135deg, ${item.color} 0%, ${item.color}dd 100%)`
                              }}
                            ></div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-slate-900">{item.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-600">{item.value}% of portfolio</span>
                                <span className="text-xs text-slate-400">•</span>
                                <span className="text-xs text-slate-500">{loanCount} loans</span>
                              </div>
                            </div>
                            <div className="text-lg font-bold" style={{ color: item.color }}>
                              {item.value}%
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Sectors</CardTitle>
                    <CardDescription>Best ROI by industry</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { sector: 'Food & Beverage', roi: '420%', loans: 8 },
                        { sector: 'Retail', roi: '385%', loans: 5 },
                        { sector: 'Services', roi: '350%', loans: 3 },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <div>
                            <div className="font-medium">{item.sector}</div>
                            <div className="text-xs text-muted-foreground">{item.loans} active loans</div>
                          </div>
                          <div className="text-emerald-600 font-bold">{item.roi}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Wins</CardTitle>
                    <CardDescription>Successful loan outcomes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { merchant: 'Taco Rico', impact: '+$12K revenue protected' },
                        { merchant: 'Downtown Coffee', impact: '+$8K expansion funded' },
                        { merchant: 'Tech Supply', impact: '+$15K inventory boost' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg border border-teal-100">
                          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {item.merchant.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{item.merchant}</div>
                            <div className="text-xs text-teal-700">{item.impact}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['lender']}>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}

