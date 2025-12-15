'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/lib/auth-context';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ShieldCheck, Bell, Save } from 'lucide-react';
import { toast } from 'sonner';

function RiskControlsContent() {
  const [autoApproval, setAutoApproval] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [minRiskScore, setMinRiskScore] = useState([75]);
  const [maxLoanAmount, setMaxLoanAmount] = useState('50000');

  const handleSave = () => {
    toast.success('Risk settings saved successfully');
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Risk Controls</h1>
              <p className="text-muted-foreground">Configure lending parameters and approval rules</p>
            </div>
            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>

          <div className="grid gap-6">
            {/* Auto-Approval Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-teal-600" />
                  <CardTitle>Auto-Approval Rules</CardTitle>
                </div>
                <CardDescription>Configure automatic loan approval criteria</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="auto-approval">Enable Auto-Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically approve loans that meet risk criteria
                    </p>
                  </div>
                  <Switch
                    id="auto-approval"
                    checked={autoApproval}
                    onCheckedChange={setAutoApproval}
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Minimum Risk Score: {minRiskScore[0]}</Label>
                    <Slider
                      value={minRiskScore}
                      onValueChange={setMinRiskScore}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Only approve businesses with a risk score of {minRiskScore[0]} or higher
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-amount">Maximum Auto-Approval Amount</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">$</span>
                      <Input
                        id="max-amount"
                        type="number"
                        value={maxLoanAmount}
                        onChange={(e) => setMaxLoanAmount(e.target.value)}
                        className="max-w-xs"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Loans above this amount require manual review
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-teal-600" />
                  <CardTitle>Notification Preferences</CardTitle>
                </div>
                <CardDescription>Manage how you receive alerts and updates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notif">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email alerts for new opportunities
                    </p>
                  </div>
                  <Switch
                    id="email-notif"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notif">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get instant alerts on your device
                    </p>
                  </div>
                  <Switch id="push-notif" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-report">Weekly Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Summary of portfolio performance
                    </p>
                  </div>
                  <Switch id="weekly-report" defaultChecked />
                </div>
              </CardContent>
            </Card>

            {/* Risk Thresholds */}
            <Card>
              <CardHeader>
                <CardTitle>Risk Thresholds</CardTitle>
                <CardDescription>Define risk tolerance levels for different scenarios</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Event-Based Lending</Label>
                    <Input type="number" placeholder="85" defaultValue="85" />
                    <p className="text-xs text-muted-foreground">Min. score for event opportunities</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Inventory Financing</Label>
                    <Input type="number" placeholder="80" defaultValue="80" />
                    <p className="text-xs text-muted-foreground">Min. score for inventory loans</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Working Capital</Label>
                    <Input type="number" placeholder="75" defaultValue="75" />
                    <p className="text-xs text-muted-foreground">Min. score for general funding</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Emergency Funding</Label>
                    <Input type="number" placeholder="70" defaultValue="70" />
                    <p className="text-xs text-muted-foreground">Min. score for urgent requests</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function RiskControlsPage() {
  return (
    <ProtectedRoute allowedRoles={['lender']}>
      <RiskControlsContent />
    </ProtectedRoute>
  );
}

