'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              Revenue Projection
              <span className="text-sm font-semibold text-emerald-600">{chartConfig.uplift}</span>
            </CardTitle>
            <CardDescription>{chartConfig.description}</CardDescription>
          </div>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-slate-300 rounded-sm"></span>
              <span className="text-muted-foreground">Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-teal-500 rounded-sm"></span>
              <span className="text-muted-foreground">With Funding</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                backgroundColor: 'white',
                opacity: 1,
                padding: '12px',
              }}
              labelStyle={{ 
                color: '#0f172a', 
                fontWeight: 700,
                marginBottom: '8px',
                fontSize: '14px',
              }}
              formatter={(value: any, name: string) => {
                return [`$${value}`, name];
              }}
              itemStyle={{ fontWeight: 600, fontSize: '13px' }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#cbd5e1"
              strokeWidth={2}
              fill="transparent"
              name="Standard Trend"
            />
            <Area
              type="monotone"
              dataKey="projected"
              stroke="#0d9488"
              strokeWidth={3}
              fill="url(#colorProjected)"
              name="With Funding"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

