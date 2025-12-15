'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/lib/auth-context';
import { generateRiskMemo } from '@/lib/ai';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
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
  Loader2,
  FileText,
  ThumbsUp,
  ThumbsDown,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';

// --- MOCK DATA ---
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

// --- HELPER COMPONENTS ---
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

// --- MAIN CONTENT ---
function DashboardContent() {
  const [selectedBusiness, setSelectedBusiness] = useState('taco-rico');
  const [aiMemo, setAiMemo] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showContext, setShowContext] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

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
      setIsApproved(false); // Reset approval status when new memo is generated
      toast.success('Risk memo generated successfully');
    } catch (error) {
      toast.error('Failed to generate memo');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveFunding = async () => {
    if (!aiMemo) {
      toast.error('Please generate a risk memo first');
      return;
    }

    setIsApproving(true);
    const currentBusiness = mockBusinesses.find((b) => b.id === selectedBusiness);
    
    try {
      // Simulate API call to approve funding
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsApproved(true);
      toast.success(`Funding approved for ${currentBusiness?.name}!`, {
        description: 'Loan documents have been sent for signature.',
        duration: 5000,
      });
    } catch (error) {
      toast.error('Failed to approve funding');
      console.error(error);
    } finally {
      setIsApproving(false);
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
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <ContextModal isOpen={showContext} onClose={() => setShowContext(false)} />
        
        {/* Header - Fixed at top */}
        <div className="sticky top-0 z-10 shrink-0 bg-background border-b">
          <SiteHeader onContextClick={() => setShowContext(true)} />
        </div>

        {/* Main Workspace - Fills remaining height, no window scroll */}
        <div className="flex flex-1 flex-col min-h-0 overflow-hidden bg-slate-50/50">
          <div className="flex-1 h-full p-4 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 h-full">
                
                {/* --- LEFT SIDE: Business List (Scrollable) --- */}
                <div className="lg:col-span-4 flex flex-col h-full overflow-hidden">
                  {/* List Header - Fixed */}
                  <div className="flex items-center justify-between pb-4 shrink-0 px-1">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">Opportunity Pipeline</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Ranked by AI match score</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {mockBusinesses.length} Active
                    </Badge>
                  </div>
                  
                  {/* Cards Container - Scrollable Area */}
                  <div className="flex-1 overflow-y-auto px-2 py-2 space-y-4 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                    {mockBusinesses.map((biz, idx) => (
                      <Card
                        key={biz.id}
                        onClick={() => {
                          setSelectedBusiness(biz.id);
                          setAiMemo(null);
                          setIsApproved(false);
                          toast.success(`Viewing ${biz.name}`);
                        }}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-lg relative ${
                          selectedBusiness === biz.id
                            ? 'border-teal-500 bg-teal-50/50 shadow-md ring-1 ring-teal-500/20'
                            : 'border-slate-200 hover:border-teal-300 bg-white'
                        }`}
                      >
                        {/* Rank Badge */}
                        <div className={`absolute -left-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm z-10 ${
                          idx === 0 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' :
                          idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-700' :
                          idx === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white' :
                          'bg-slate-200 text-slate-600'
                        }`}>
                          {idx + 1}
                        </div>
                        <CardHeader className="pb-3 pt-4">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1">
                              <CardTitle className="text-base font-bold flex items-center gap-2 flex-wrap">
                                {biz.name}
                                {biz.matchScore && biz.matchScore >= 95 && (
                                  <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white border-0 shadow-sm text-[10px] px-1.5 h-5">
                                    <Sparkles size={10} className="mr-1" />
                                    Match
                                  </Badge>
                                )}
                              </CardTitle>
                              {biz.location && (
                                <CardDescription className="mt-1 text-xs">{biz.location} • {biz.industry}</CardDescription>
                              )}
                            </div>
                            {biz.riskScore && (
                              <div className="flex flex-col items-end">
                                <Badge variant="outline" className={`font-mono ${
                                  biz.riskScore > 85 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                                  'bg-slate-50 text-slate-700'
                                }`}>
                                  {biz.riskScore}
                                </Badge>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-4">
                          {biz.id === 'taco-rico' && biz.alert ? (
                            <div className="bg-red-50/50 border border-red-100 rounded-lg p-3">
                              <div className="flex items-center gap-2 text-red-700 font-semibold text-xs mb-1">
                                <TrendingUp size={14} /> {biz.alert}
                              </div>
                              <p className="text-xs text-slate-600 leading-relaxed">
                                {biz.alertDescription}
                              </p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <div className="text-slate-500 text-[10px] uppercase tracking-wider font-medium">Rev/Mo</div>
                                <div className="font-semibold text-slate-900">{biz.revenue}</div>
                              </div>
                              <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                <div className="text-slate-500 text-[10px] uppercase tracking-wider font-medium">Ticket</div>
                                <div className="font-semibold text-slate-900">{biz.avgTicket}</div>
                              </div>
                            </div>
                          )}
                           <div className="flex gap-1.5 flex-wrap pt-1">
                            {biz.integrations?.map((int) => (
                              <Badge key={int} variant="secondary" className="text-[10px] px-1.5 h-5 bg-slate-100 text-slate-600 hover:bg-slate-200">
                                {int}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* --- RIGHT SIDE: Chart & Action Panel --- */}
                <div className="lg:col-span-8 h-full flex flex-col gap-4 overflow-hidden">
                   {business && business.riskScore && (
                    <>
                      {/* Top: Chart Section (Approx 60% height) */}
                      <div className="flex-[3] min-h-0 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden relative">
                         <div className="absolute inset-0">
                           <ChartAreaInteractive 
                             businessId={business.id} 
                             businessName={business.name} 
                           />
                         </div>
                      </div>

                      {/* Bottom: Analysis & Action Panel (Approx 40% height) */}
                      <Card className="flex-[2] min-h-0 flex flex-col shadow-sm border-slate-200 bg-white overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50 shrink-0">
                          <div className="flex items-center gap-2">
                             <div className="bg-teal-100 p-1 rounded-md text-teal-700">
                               <FileText size={18} />
                             </div>
                             <div>
                               <h3 className="font-semibold text-sm text-slate-900">AI Risk Analysis</h3>
                               <p className="text-xs text-slate-500">Real-time assessment for underwriter review</p>
                             </div>
                          </div>
                          <div className="flex gap-2">
                             {!aiMemo ? (
                               <Button 
                                 size="sm" 
                                 onClick={handleGenerateMemo}
                                 disabled={isGenerating}
                                 className="bg-teal-600 hover:bg-teal-700 text-white shadow-sm"
                               >
                                 {isGenerating ? (
                                   <>
                                     <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                                     Analyzing...
                                   </>
                                 ) : (
                                   <>
                                     <Sparkles className="mr-2 h-3 w-3" />
                                     Generate Memo
                                   </>
                                 )}
                               </Button>
                             ) : (
                               <>
                                 {isApproved ? (
                                   <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-md">
                                     <CheckCircle className="h-4 w-4 text-emerald-600" />
                                     <span className="text-sm font-medium text-emerald-700">Funding Approved</span>
                                   </div>
                                 ) : (
                                   <>
                                     <Button 
                                       variant="outline" 
                                       size="sm" 
                                       className="text-red-600 hover:bg-red-50 border-red-200"
                                       disabled={isApproving}
                                     >
                                       <ThumbsDown size={14} className="mr-1" /> Reject
                                     </Button>
                                     <Button 
                                       size="sm" 
                                       onClick={handleApproveFunding}
                                       disabled={isApproving}
                                       className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                     >
                                       {isApproving ? (
                                         <>
                                           <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                                           Processing...
                                         </>
                                       ) : (
                                         <>
                                           Approve Funding <ArrowRight size={14} className="ml-1" />
                                         </>
                                       )}
                                     </Button>
                                   </>
                                 )}
                               </>
                             )}
                          </div>
                        </div>
                        
                        {/* Scrollable Content Area */}
                        <ScrollArea className="flex-1 min-h-0">
                          <div className="p-4">
                            {!aiMemo ? (
                              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-70 min-h-[120px] px-4">
                                <div className="bg-slate-100 p-3 rounded-full">
                                  <Sparkles className="h-6 w-6 text-slate-400" />
                                </div>
                                <div className="max-w-sm space-y-2">
                                  <p className="text-sm font-medium text-slate-900">No Assessment Generated</p>
                                  <p className="text-xs text-slate-500 leading-relaxed">
                                    Click <strong>"Generate Memo"</strong> above to run a live AI analysis on {business.name}'s transaction data, risk factors, and business metrics.
                                  </p>
                                  <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-left">
                                    <p className="text-xs font-semibold text-slate-700">What happens next:</p>
                                    <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                                      <li>AI analyzes real-time transaction patterns and risk indicators</li>
                                      <li>Generates a comprehensive risk assessment memo</li>
                                      <li>Provides funding recommendation with confidence score</li>
                                      <li>Enables <strong className="text-emerald-600">Approve Funding</strong> button for loan processing</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="prose prose-sm prose-slate max-w-none">
                                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                                    {aiMemo}
                                  </div>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between pt-2 pb-2">
                                  <p className="text-xs text-slate-500">Confidence Score: <span className="text-emerald-600 font-bold">94%</span></p>
                                </div>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </Card>
                    </>
                  )}
                </div>
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