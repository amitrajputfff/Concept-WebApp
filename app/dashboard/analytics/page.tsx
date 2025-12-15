'use client';

import { ProtectedRoute } from '@/lib/auth-context';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
              <Card>
                <CardHeader>
                  <CardTitle>Revenue vs Target</CardTitle>
                  <CardDescription>Monthly revenue performance against targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={revenueData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="revenue" fill="#0d9488" name="Actual Revenue" />
                      <Bar dataKey="target" fill="#cbd5e1" name="Target" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risk" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Risk Distribution</CardTitle>
                  <CardDescription>Breakdown of loans by risk score categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={riskDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.value}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {riskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="flex flex-col justify-center space-y-3">
                      {riskDistribution.map((item, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.value}% of portfolio</div>
                          </div>
                        </div>
                      ))}
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

