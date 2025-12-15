import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, DollarSign, Zap, Target } from 'lucide-react';

interface SectionCardsProps {
  businessId?: string;
}

const businessMetrics: Record<string, { revenue: string; roi: string; package: string; context: string; netBenefit: string }> = {
  'taco-rico': {
    revenue: '$12,000+',
    context: 'Previous loss: $8,000',
    roi: '400%',
    netBenefit: '$9,600 Net Benefit',
    package: '$30,000',
  },
  'tech-1': {
    revenue: '$28,000+',
    context: 'Bulk order opportunity',
    roi: '360%',
    netBenefit: '$18,000 Net Benefit',
    package: '$50,000',
  },
  'bistro-1': {
    revenue: '$15,500+',
    context: 'Equipment efficiency gain',
    roi: '342%',
    netBenefit: '$12,000 Net Benefit',
    package: '$35,000',
  },
  'coffee-1': {
    revenue: '$8,200+',
    context: 'Evening market capture',
    roi: '328%',
    netBenefit: '$6,000 Net Benefit',
    package: '$25,000',
  },
};

export function SectionCards({ businessId = 'taco-rico' }: SectionCardsProps) {
  const metrics = businessMetrics[businessId] || businessMetrics['taco-rico'];
  const isGameDay = businessId === 'taco-rico';
  
  return (
    <div className="grid gap-3 sm:gap-4 px-3 sm:px-4 md:grid-cols-3 lg:px-6">
      <Card className="bg-emerald-50/50 border-emerald-200">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-emerald-600/80 truncate">Revenue Potential</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-700 mt-1">{metrics.revenue}</p>
              <p className="text-xs text-emerald-600 mt-1">{metrics.context}</p>
            </div>
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-50">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-slate-500 truncate">ROI Calculation</p>
              <p className="text-xl sm:text-2xl font-bold text-slate-800 mt-1">{metrics.roi}</p>
              <p className="text-xs text-slate-400 mt-1">{metrics.netBenefit}</p>
            </div>
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-slate-600 shrink-0" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-teal-900 to-teal-800 text-white border-0 shadow-lg shadow-teal-900/20">
        <CardContent className="pt-4 sm:pt-6">
          <div className="flex items-center justify-between space-x-2">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-teal-200 truncate">
                {isGameDay ? 'Game Day Package' : 'Recommended Package'}
              </p>
              <p className="text-xl sm:text-2xl font-bold mt-1">{metrics.package}</p>
              <p className="text-xs text-teal-300 mt-1">8% Daily Sales Split</p>
            </div>
            {isGameDay ? (
              <Zap className="h-6 w-6 sm:h-8 sm:w-8 text-teal-300 shrink-0" />
            ) : (
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-teal-300 shrink-0" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

