'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/lib/auth-context';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Search, Download, Eye, DollarSign, TrendingUp, Clock, Calendar, Percent, FileText, CheckCircle, Activity } from 'lucide-react';
import { toast } from 'sonner';

interface Loan {
  id: string;
  merchant: string;
  location: string;
  amount: number;
  disbursed: string;
  balance: number;
  status: string;
  dailyRate: string;
  nextPayment: string;
  totalRepaid?: number;
  daysActive?: number;
  avgDailyPayment?: number;
  projectedCompletion?: string;
  riskScore?: number;
  paymentHistory?: Array<{ date: string; amount: number }>;
}

const mockLoans: Loan[] = [
  {
    id: 'L-001',
    merchant: 'Taco Rico',
    location: 'Austin, TX',
    amount: 30000,
    disbursed: '2024-09-15',
    balance: 25200,
    status: 'active',
    dailyRate: '8%',
    nextPayment: '2024-12-16',
    totalRepaid: 4800,
    daysActive: 92,
    avgDailyPayment: 52,
    projectedCompletion: '2025-01-20',
    riskScore: 86,
    paymentHistory: [
      { date: '2024-12-14', amount: 48 },
      { date: '2024-12-13', amount: 52 },
      { date: '2024-12-12', amount: 64 },
      { date: '2024-12-11', amount: 56 },
      { date: '2024-12-10', amount: 72 },
    ],
  },
  {
    id: 'L-002',
    merchant: 'Downtown Coffee',
    location: 'Portland, OR',
    amount: 15000,
    disbursed: '2024-08-20',
    balance: 8400,
    status: 'active',
    dailyRate: '6%',
    nextPayment: '2024-12-16',
    totalRepaid: 6600,
    daysActive: 117,
    avgDailyPayment: 56,
    projectedCompletion: '2024-12-28',
    riskScore: 78,
    paymentHistory: [
      { date: '2024-12-14', amount: 54 },
      { date: '2024-12-13', amount: 58 },
      { date: '2024-12-12', amount: 52 },
      { date: '2024-12-11', amount: 62 },
      { date: '2024-12-10', amount: 68 },
    ],
  },
  {
    id: 'L-003',
    merchant: 'Tech Supply Co',
    location: 'San Jose, CA',
    amount: 50000,
    disbursed: '2024-07-10',
    balance: 0,
    status: 'completed',
    dailyRate: '7%',
    nextPayment: '-',
    totalRepaid: 53500,
    daysActive: 156,
    avgDailyPayment: 343,
    projectedCompletion: '2024-12-01',
    riskScore: 91,
    paymentHistory: [
      { date: '2024-11-30', amount: 340 },
      { date: '2024-11-29', amount: 350 },
      { date: '2024-11-28', amount: 360 },
      { date: '2024-11-27', amount: 320 },
      { date: '2024-11-26', amount: 380 },
    ],
  },
];

function LoansContent() {
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const activeLoans = mockLoans.filter((l) => l.status === 'active');
  const totalOutstanding = activeLoans.reduce((sum, loan) => sum + loan.balance, 0);
  const totalDisbursed = mockLoans.reduce((sum, loan) => sum + loan.amount, 0);

  const handleViewLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setViewDialogOpen(true);
    toast.success(`Viewing ${loan.merchant} loan details`);
  };

  const repaymentProgress = selectedLoan 
    ? ((selectedLoan.totalRepaid || 0) / (selectedLoan.amount + (selectedLoan.totalRepaid || 0) - selectedLoan.balance)) * 100
    : 0;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeLoans.length}</div>
                <p className="text-xs text-muted-foreground">Currently funding</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalOutstanding.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Across all active loans</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${totalDisbursed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Lifetime funding</p>
              </CardContent>
            </Card>
          </div>

          {/* Loan Detail Modal */}
          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="!max-w-[60vw] max-h-[90vh] overflow-y-auto">
              {selectedLoan && (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      <FileText className="text-teal-600" size={28} />
                      Loan Details: {selectedLoan.id}
                    </DialogTitle>
                    <DialogDescription>
                      Complete loan information and repayment tracking
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Merchant Info */}
                    <Card className="bg-slate-50">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Merchant Information</CardTitle>
                      </CardHeader>
                      <CardContent className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-slate-500">Business Name</div>
                          <div className="font-semibold text-slate-900">{selectedLoan.merchant}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">Location</div>
                          <div className="font-semibold text-slate-900">{selectedLoan.location}</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">Risk Score</div>
                          <div className="font-semibold text-emerald-600">{selectedLoan.riskScore}/100</div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-500">Status</div>
                          <Badge className={selectedLoan.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}>
                            {selectedLoan.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Loan Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                            <DollarSign size={14} />
                            Original Amount
                          </div>
                          <div className="text-2xl font-bold text-slate-900">
                            ${selectedLoan.amount.toLocaleString()}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                            <TrendingUp size={14} />
                            Total Repaid
                          </div>
                          <div className="text-2xl font-bold text-emerald-600">
                            ${selectedLoan.totalRepaid?.toLocaleString()}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                            <Activity size={14} />
                            Balance
                          </div>
                          <div className="text-2xl font-bold text-slate-900">
                            ${selectedLoan.balance.toLocaleString()}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                            <Percent size={14} />
                            Daily Rate
                          </div>
                          <div className="text-2xl font-bold text-teal-600">
                            {selectedLoan.dailyRate}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Repayment Progress */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center justify-between">
                          <span>Repayment Progress</span>
                          <span className="text-sm font-normal text-slate-500">
                            {Math.round(repaymentProgress)}% Complete
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Progress value={repaymentProgress} className="h-3" />
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <div className="text-slate-500">Days Active</div>
                            <div className="font-semibold">{selectedLoan.daysActive} days</div>
                          </div>
                          <div>
                            <div className="text-slate-500">Avg Daily Payment</div>
                            <div className="font-semibold">${selectedLoan.avgDailyPayment}</div>
                          </div>
                          <div>
                            <div className="text-slate-500">Projected Completion</div>
                            <div className="font-semibold">
                              {selectedLoan.status === 'completed' ? 'Completed' : selectedLoan.projectedCompletion}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recent Payment History */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Calendar className="text-teal-600" size={20} />
                          Recent Payment History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedLoan.paymentHistory?.map((payment, idx) => (
                            <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="text-emerald-500" size={18} />
                                <div>
                                  <div className="font-medium text-slate-900">
                                    ${payment.amount.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-slate-500">{payment.date}</div>
                                </div>
                              </div>
                              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                Processed
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Loan Terms */}
                    <Card className="bg-teal-50 border-teal-200">
                      <CardHeader>
                        <CardTitle className="text-lg">Loan Terms</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Disbursement Date:</span>
                          <span className="font-semibold">{selectedLoan.disbursed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Repayment Model:</span>
                          <span className="font-semibold">{selectedLoan.dailyRate} of Daily Sales</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Next Payment:</span>
                          <span className="font-semibold">{selectedLoan.nextPayment}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Collection Method:</span>
                          <span className="font-semibold">Auto-Collected via POS</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Loans Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Active Loans</CardTitle>
                  <CardDescription>Track all funded merchants and repayment status</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search merchants..." className="pl-8 w-[200px]" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Merchant</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLoans.map((loan) => (
                    <TableRow key={loan.id}>
                      <TableCell className="font-medium">{loan.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{loan.merchant}</div>
                          <div className="text-xs text-muted-foreground">{loan.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>${loan.amount.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">
                        ${loan.balance.toLocaleString()}
                      </TableCell>
                      <TableCell>{loan.dailyRate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={loan.status === 'active' ? 'default' : 'secondary'}
                          className={
                            loan.status === 'active'
                              ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'
                              : ''
                          }
                        >
                          {loan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewLoan(loan)}
                          className="hover:bg-teal-50 hover:text-teal-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function LoansPage() {
  return (
    <ProtectedRoute allowedRoles={['lender']}>
      <LoansContent />
    </ProtectedRoute>
  );
}

