'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/lib/auth-context';
import { generateRiskMemo } from '@/lib/ai';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { SectionCards } from '@/components/section-cards';
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import {
  CheckCircle,
  TrendingUp,
  AlertCircle,
  Zap,
  Sparkles,
  Loader,
} from 'lucide-react';
import { toast } from 'sonner';

const mockBusinesses = [
  {
    id: 'taco-rico',
    name: 'Taco Rico',
    location: 'Austin, TX',
    industry: 'Restaurant (Mexican)',
    riskScore: 86,
    matchScore: 98,
    alert: 'Game Day Alert',
    alertDescription: 'Inventory (Wings) low @ 40%. Projected 280% demand spike this Saturday (Sep 18).',
    integrations: ['Plaid', 'Square'],
    revenue: '$45k/mo',
    avgTicket: '$28',
    opportunity: 'Critical timing window',
    urgency: 'high',
  },
  { 
    id: 'tech-1', 
    name: 'TechSupply Co',
    location: 'Seattle, WA',
    industry: 'B2B Supplies',
    riskScore: 91,
    matchScore: 95,
    status: 'Strong',
    integrations: ['Plaid', 'Stripe'],
    revenue: '$125k/mo',
    avgTicket: '$450',
    opportunity: 'Large order financing',
    urgency: 'medium',
  },
  { 
    id: 'bistro-1', 
    name: 'River North Bistro',
    location: 'Chicago, IL',
    industry: 'Fine Dining',
    riskScore: 82,
    matchScore: 89,
    status: 'Growing',
    integrations: ['Toast', 'Plaid'],
    revenue: '$68k/mo',
    avgTicket: '$95',
    opportunity: 'Equipment upgrade',
    urgency: 'medium',
  },
  { 
    id: 'coffee-1', 
    name: 'Downtown Coffee Roasters',
    location: 'Denver, CO',
    industry: 'Coffee Shop',
    riskScore: 78,
    matchScore: 82,
    status: 'Stable',
    integrations: ['Clover', 'QuickBooks'],
    revenue: '$32k/mo',
    avgTicket: '$12',
    opportunity: 'Location expansion',
    urgency: 'low',
  },
];

function ContextModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-[60vw] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            The Opportunity: <span className="text-teal-600">Merchant Growth Partner</span>
          </DialogTitle>
          <DialogDescription>
            Transforming Mastercard from Infrastructure to Intelligent Partner
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-teal-50 border-teal-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-teal-800">
                    <Zap size={20} /> The Idea
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    What if lending wasn't something merchants had to seek out, but an{' '}
                    <strong>intelligent, proactive service</strong> that anticipated their needs?
                  </p>
                  <ul className="list-disc ml-4 text-sm text-slate-600 space-y-1">
                    <li>Real-time monitoring (POS, Inventory, IoT)</li>
                    <li>Proactive offers ("Great week! We can advance $12k")</li>
                    <li>One tap approval → Funds in minutes</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp size={20} /> Why Mastercard?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    Mastercard holds a goldmine of real-time transaction intelligence.
                  </p>
                  <ul className="list-disc ml-4 text-sm text-slate-600 space-y-1">
                    <li><strong>Revenue Upside:</strong> More liquidity = More transactions</li>
                    <li><strong>Stickiness:</strong> Deep merchant loyalty & competitive moat</li>
                    <li>
                      <strong>Repositioning:</strong> Infrastructure → <span className="font-semibold text-teal-600">Growth Partner</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Demo Scenario: "Taco Rico"</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="border-l-4 border-teal-500 pl-4 space-y-2 text-slate-600">
                  <p><strong>Context:</strong> Wednesday, Sept 15. Big Game this Saturday.</p>
                  <p><strong>The Trigger:</strong> Inventory (Wings) at 40%. Demand spike of 280% predicted.</p>
                  <p><strong>The Risk:</strong> $12,000 revenue at risk. (Prior loss: $8,000).</p>
                  <p><strong>The Solution:</strong> $30,000 instant working capital. 8% daily repayment.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}


function DashboardContent() {
  const [selectedBusiness, setSelectedBusiness] = useState('taco-rico');
  const [aiMemo, setAiMemo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showContext, setShowContext] = useState(false);

  const handleGenerateMemo = async () => {
    setIsGenerating(true);
    const currentBusiness = mockBusinesses.find((b) => b.id === selectedBusiness);
    toast.info(`Generating AI risk assessment for ${currentBusiness?.name}...`);
    
    try {
      let context = '';
      let loanAmount = 30000;
      
      if (selectedBusiness === 'taco-rico') {
        context = 'Big Game Saturday (Sept 18). Inventory low (40%), Obligations ($33k) vs Cash ($30k). Projected upside: $12,000 revenue protected.';
      } else if (selectedBusiness === 'coffee-1') {
        context = 'Stable growth. Looking to expand to second location. Strong morning rush, opportunity to capture evening market with extended hours.';
        loanAmount = 25000;
      } else if (selectedBusiness === 'tech-1') {
        context = 'Strong B2B relationships. Bulk order from major client expected. Need inventory financing to fulfill $80k order.';
        loanAmount = 50000;
      } else if (selectedBusiness === 'bistro-1') {
        context = 'Upscale dining, seasonal menu changes. Opportunity to expand wine selection and upgrade kitchen equipment for efficiency.';
        loanAmount = 35000;
      }
      
      const result = await generateRiskMemo({
        name: currentBusiness?.name || 'Business',
        riskScore: currentBusiness?.riskScore || 75,
        loanAmount,
        roi: 350,
        context,
      });
      
      setAiMemo(result);
      toast.success('Risk memo generated successfully');
    } catch (error) {
      toast.error('Failed to generate memo');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const business = mockBusinesses.find((b) => b.id === selectedBusiness);

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '16rem',
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <ContextModal isOpen={showContext} onClose={() => setShowContext(false)} />
        
        <SiteHeader onContextClick={() => setShowContext(true)} />

        <div className="flex flex-1 flex-col h-screen overflow-hidden">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 shrink-0">
            <SectionCards businessId={selectedBusiness} />
          </div>

          <div className="flex-1 min-h-0 px-3 sm:px-4 lg:px-6 pb-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full">
                {/* Business List */}
                <div className="lg:col-span-4 flex flex-col h-full">
                  {/* Header - Fixed */}
                  <div className="flex items-center justify-between pb-4 shrink-0">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Opportunity Pipeline</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Ranked by AI match score</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {mockBusinesses.length} Active
                    </Badge>
                  </div>
                  
                  {/* Scrollable Cards Container */}
                  <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                    {/* Business Cards */}
                    {mockBusinesses.map((biz, idx) => (
                  <Card
                    key={biz.id}
                    onClick={() => {
                      setSelectedBusiness(biz.id);
                      setAiMemo(null); // Clear previous memo
                      toast.success(`Viewing ${biz.name}`);
                    }}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 relative ${
                      selectedBusiness === biz.id
                        ? 'border-teal-500 bg-teal-50/50 shadow-md ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:border-teal-300'
                    }`}
                  >
                    {/* Rank Badge */}
                    <div className={`absolute -left-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                      idx === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                      idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700' :
                      idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                      'bg-slate-200 text-slate-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                            {biz.name}
                            {biz.matchScore && biz.matchScore >= 95 && (
                              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md">
                                <Sparkles size={12} className="mr-1" />
                                Best Match
                              </Badge>
                            )}
                            {biz.urgency === 'high' && (
                              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                <AlertCircle size={12} className="mr-1" />
                                Urgent
                              </Badge>
                            )}
                          </CardTitle>
                          {biz.location && (
                            <CardDescription className="mt-1">{biz.location} • {biz.industry}</CardDescription>
                          )}
                        </div>
                        {biz.riskScore && (
                          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shrink-0">
                            {biz.riskScore}
                          </Badge>
                        )}
                      </div>
                      {biz.opportunity && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-teal-600 font-medium">
                          <Zap size={12} />
                          {biz.opportunity}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex gap-2 flex-wrap">
                        {biz.integrations?.map((int) => (
                          <Badge key={int} variant="outline" className="text-xs">
                            <CheckCircle size={12} className="text-teal-500 mr-1" />
                            {int}
                          </Badge>
                        ))}
                      </div>
                      
                      {biz.id === 'taco-rico' && biz.alert ? (
                        <Card className="bg-white border-teal-100 shadow-sm">
                          <CardContent className="pt-3">
                            <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1">
                              <TrendingUp size={16} /> {biz.alert}
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              {biz.alertDescription}
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-50 p-2 rounded">
                            <div className="text-slate-500">Revenue</div>
                            <div className="font-semibold text-slate-900">{biz.revenue}</div>
                          </div>
                          <div className="bg-slate-50 p-2 rounded">
                            <div className="text-slate-500">Avg Ticket</div>
                            <div className="font-semibold text-slate-900">{biz.avgTicket}</div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                    ))}
                  </div>
                </div>

                {/* Detail View */}
                {business && business.riskScore && (
                  <div className="lg:col-span-8 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl flex items-center gap-2 flex-wrap">
                            {business.name}
                            {business.matchScore && business.matchScore >= 95 && (
                              <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-md">
                                <Sparkles size={14} className="mr-1" />
                                Best Match
                              </Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-1 flex items-center gap-2 flex-wrap">
                            <span>{business.location} • {business.industry}</span>
                            <span className="text-slate-300">•</span>
                            <span className="flex items-center gap-1">
                              <span className="text-emerald-600 font-semibold">Score: {business.riskScore}</span>
                              {business.matchScore && (
                                <span className="text-amber-600 font-semibold">• Match: {business.matchScore}%</span>
                              )}
                            </span>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">
                            {business.status || 'APPROVE'}
                          </Badge>
                          <span className="hidden sm:inline text-slate-300">|</span>
                          <span className="text-sm font-medium text-slate-600">AI Confidence: 96%</span>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      {/* Chart */}
                      <ChartAreaInteractive businessId={business.id} businessName={business.name} />

                      {/* AI Risk Memo */}
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-4">
                          {!aiMemo ? (
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                              <div className="flex gap-3 items-start">
                                <AlertCircle className="text-blue-600 mt-0.5 shrink-0" size={20} />
                                <div>
                                  <h4 className="font-bold text-blue-800 text-sm mb-2">Detection Logic (Sept 15)</h4>
                                  <div className="text-sm text-blue-700 space-y-1">
                                    <p>• Bank Balance: $30,000</p>
                                    <p>• Obligations: $33,000 (Payroll/Supplier)</p>
                                    <p>• Inventory: Wings @ 40%</p>
                                    <p className="font-semibold">• Context: Sep 18 Game Day</p>
                                  </div>
                                </div>
                              </div>
                              <Button
                                onClick={handleGenerateMemo}
                                disabled={isGenerating}
                                size="sm"
                                variant="outline"
                                className="bg-white hover:bg-blue-100 text-blue-700 border-blue-200 shrink-0"
                              >
                                {isGenerating ? (
                                  <Loader size={14} className="animate-spin mr-2" />
                                ) : (
                                  <Sparkles size={14} className="mr-2" />
                                )}
                                Generate Risk Memo
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2 animate-in fade-in duration-500">
                              <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
                                  <Sparkles size={16} className="text-blue-600" />
                                  Azure AI Risk Assessment
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setAiMemo(null)}
                                  className="text-blue-500 hover:text-blue-700 h-auto p-1"
                                >
                                  Reset
                                </Button>
                              </div>
                              <div className="text-sm text-blue-900 bg-white/50 p-3 rounded border border-blue-100 whitespace-pre-line leading-relaxed font-medium">
                                {aiMemo}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute allowedRoles={['lender']}>
      <DashboardContent />
    </ProtectedRoute>
  );
}

