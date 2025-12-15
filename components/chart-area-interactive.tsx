'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ChartProps {
  businessId?: string;
  businessName?: string;
}

const chartDataMap: Record<string, { data: any[]; description: string; uplift: string }> = {
  'taco-rico': {
    description: 'Saturday shows 280% spike with Game Day funding',
    uplift: '+$12.6k potential',
    data: [
      { day: 'Mon', sales: 4000, projected: 4200 },
      { day: 'Tue', sales: 3500, projected: 3800 },
      { day: 'Wed', sales: 4800, projected: 5000 },
      { day: 'Thu', sales: 5100, projected: 6000 },
      { day: 'Fri', sales: 6000, projected: 8500 },
      { day: 'Sat', sales: 7000, projected: 19600 }, // Game Day 280% spike!
      { day: 'Sun', sales: 6500, projected: 14000 },
    ],
  },
  'coffee-1': {
    description: 'Evening hours + second location expansion',
    uplift: '+$8.2k potential',
    data: [
      { day: 'Mon', sales: 2800, projected: 3400 },
      { day: 'Tue', sales: 2600, projected: 3200 },
      { day: 'Wed', sales: 3100, projected: 3800 },
      { day: 'Thu', sales: 3300, projected: 4100 },
      { day: 'Fri', sales: 3800, projected: 5200 },
      { day: 'Sat', sales: 4200, projected: 5800 },
      { day: 'Sun', sales: 3900, projected: 5400 },
    ],
  },
  'tech-1': {
    description: 'Bulk order fulfillment with inventory financing',
    uplift: '+$28k potential',
    data: [
      { day: 'Mon', sales: 18000, projected: 22000 },
      { day: 'Tue', sales: 16000, projected: 19000 },
      { day: 'Wed', sales: 20000, projected: 28000 },
      { day: 'Thu', sales: 19000, projected: 32000 }, // Bulk order delivery
      { day: 'Fri', sales: 21000, projected: 35000 },
      { day: 'Sat', sales: 12000, projected: 15000 },
      { day: 'Sun', sales: 10000, projected: 12000 },
    ],
  },
  'bistro-1': {
    description: 'Wine selection & kitchen equipment upgrade',
    uplift: '+$15.5k potential',
    data: [
      { day: 'Mon', sales: 5500, projected: 6800 },
      { day: 'Tue', sales: 5200, projected: 6500 },
      { day: 'Wed', sales: 6800, projected: 8500 },
      { day: 'Thu', sales: 7200, projected: 9800 },
      { day: 'Fri', sales: 9500, projected: 13200 }, // Weekend fine dining
      { day: 'Sat', sales: 10200, projected: 14800 },
      { day: 'Sun', sales: 8800, projected: 12000 },
    ],
  },
};

export function ChartAreaInteractive({ businessId = 'taco-rico', businessName = 'Taco Rico' }: ChartProps) {
  const chartConfig = chartDataMap[businessId] || chartDataMap['taco-rico'];
  const chartData = chartConfig.data;
  
  return (
    <Card className="h-full flex flex-col border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50">
      <CardHeader className="shrink-0 pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-teal-600" />
              Revenue Projection
              <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {chartConfig.uplift}
              </span>
            </CardTitle>
            <CardDescription className="mt-1.5">{chartConfig.description}</CardDescription>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-md">
              <span className="w-3 h-3 bg-slate-400 rounded-sm shadow-sm"></span>
              <span className="text-slate-600 font-medium">Standard</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 bg-teal-50 rounded-md border border-teal-200">
              <span className="w-3 h-3 bg-gradient-to-br from-teal-500 to-teal-600 rounded-sm shadow-sm"></span>
              <span className="text-teal-700 font-medium">With Funding</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 p-4 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart 
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#0d9488" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cbd5e1" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#e2e8f0" 
              opacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              dy={10}
              tickMargin={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              tickMargin={8}
              width={60}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const sales = payload[0]?.value as number;
                  const projected = payload[1]?.value as number;
                  const difference = projected - sales;
                  const percentIncrease = ((difference / sales) * 100).toFixed(0);
                  
                  return (
                    <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-4 min-w-[200px]">
                      <p className="font-bold text-slate-900 mb-3 text-sm">{label}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-slate-400 rounded-sm"></div>
                            <span className="text-xs text-slate-600 font-medium">Standard</span>
                          </div>
                          <span className="font-bold text-slate-900">${sales.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-teal-500 rounded-sm"></div>
                            <span className="text-xs text-teal-700 font-medium">With Funding</span>
                          </div>
                          <span className="font-bold text-teal-700">${projected.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">Potential Gain</span>
                            <span className="font-bold text-emerald-600">+${difference.toLocaleString()} ({percentIncrease}%)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ stroke: '#0d9488', strokeWidth: 2, strokeDasharray: '5 5' }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#94a3b8"
              strokeWidth={2.5}
              fill="url(#colorSales)"
              fillOpacity={0.6}
              name="Standard Trend"
              dot={{ fill: '#cbd5e1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#94a3b8', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="#14b8a6"
              strokeWidth={3.5}
              fill="url(#colorProjected)"
              name="With Funding"
              dot={{ fill: '#0d9488', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, stroke: '#14b8a6', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

