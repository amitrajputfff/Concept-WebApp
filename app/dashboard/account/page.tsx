'use client';

import { useState } from 'react';
import { ProtectedRoute, useAuth } from '@/lib/auth-context';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  MapPin, 
  Shield, 
  Bell, 
  Lock,
  CreditCard,
  Key,
  Globe,
  Eye,
  EyeOff,
  CheckCircle,
  Sparkles,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

function AccountContent() {
  const { user } = useAuth();
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    fullName: 'Jane Doe',
    email: 'jane.doe@propelcapital.com',
    phone: '+1 (555) 123-4567',
    jobTitle: 'Senior Credit Analyst',
    department: 'Underwriting',
    location: 'New York, NY',
    bio: 'Experienced lending professional specializing in AI-driven credit assessment and merchant financing.',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    weeklyReports: true,
    merchantUpdates: true,
    riskAlerts: true,
    systemUpdates: false,
  });

  // Security settings
  const [security, setSecurity] = useState({
    twoFactorEnabled: true,
    sessionTimeout: '30',
    loginAlerts: true,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Profile updated successfully!');
    setIsSaving(false);
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Notification preferences saved!');
    setIsSaving(false);
  };

  const handleSaveSecurity = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Security settings updated!');
    setIsSaving(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Account Settings</h1>
              <p className="text-slate-500 mt-2">Manage your profile, preferences, and security</p>
            </div>
            <Badge className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white">
              <Shield size={14} className="mr-1" />
              Admin Access
            </Badge>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid lg:grid-cols-4">
              <TabsTrigger value="profile">
                <User size={16} className="mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell size={16} className="mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock size={16} className="mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="api">
                <Key size={16} className="mr-2" />
                API Access
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="text-teal-600" size={24} />
                    Personal Information
                  </CardTitle>
                  <CardDescription>Update your personal details and profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-2xl font-bold">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">Profile Photo</h3>
                      <p className="text-sm text-slate-500 mb-3">Update your profile picture</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">Change Photo</Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profile.fullName}
                        onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobTitle">Job Title</Label>
                      <Input
                        id="jobTitle"
                        value={profile.jobTitle}
                        onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select value={profile.department} onValueChange={(value) => setProfile({ ...profile, department: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Underwriting">Underwriting</SelectItem>
                          <SelectItem value="Risk Management">Risk Management</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Executive">Executive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Save size={16} className="mr-2" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Organization Info */}
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="text-slate-600" size={20} />
                    Organization
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-500">Company</div>
                    <div className="font-semibold text-slate-900">Propel Capital</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Member Since</div>
                    <div className="font-semibold text-slate-900">January 2024</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Role</div>
                    <div className="font-semibold text-slate-900">Admin</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-500">Team</div>
                    <div className="font-semibold text-slate-900">Lending Operations</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="text-teal-600" size={24} />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose how you want to receive updates and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">Email Alerts</h4>
                        <p className="text-sm text-slate-500">Receive important updates via email</p>
                      </div>
                      <Switch
                        checked={notifications.emailAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">Push Notifications</h4>
                        <p className="text-sm text-slate-500">Get real-time push notifications</p>
                      </div>
                      <Switch
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">Weekly Reports</h4>
                        <p className="text-sm text-slate-500">Receive weekly performance summaries</p>
                      </div>
                      <Switch
                        checked={notifications.weeklyReports}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">Merchant Updates</h4>
                        <p className="text-sm text-slate-500">Notifications about merchant activity</p>
                      </div>
                      <Switch
                        checked={notifications.merchantUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, merchantUpdates: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 bg-red-50">
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-900 flex items-center gap-2">
                          <Shield size={16} />
                          Risk Alerts
                        </h4>
                        <p className="text-sm text-red-700">Critical risk notifications (recommended)</p>
                      </div>
                      <Switch
                        checked={notifications.riskAlerts}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, riskAlerts: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">System Updates</h4>
                        <p className="text-sm text-slate-500">Maintenance and system announcements</p>
                      </div>
                      <Switch
                        checked={notifications.systemUpdates}
                        onCheckedChange={(checked) => setNotifications({ ...notifications, systemUpdates: checked })}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveNotifications}
                      disabled={isSaving}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Save size={16} className="mr-2" />
                      {isSaving ? 'Saving...' : 'Save Preferences'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="text-teal-600" size={24} />
                    Security Settings
                  </CardTitle>
                  <CardDescription>Manage your password and security preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Password Change */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900">Change Password</h4>
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" placeholder="••••••••" />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" placeholder="••••••••" />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" placeholder="••••••••" />
                      </div>
                      <Button variant="outline" className="w-fit">Update Password</Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Two-Factor Authentication */}
                  <div className="flex items-start justify-between p-4 rounded-lg border border-emerald-200 bg-emerald-50">
                    <div className="flex-1">
                      <h4 className="font-semibold text-emerald-900 flex items-center gap-2">
                        <CheckCircle size={18} />
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm text-emerald-700 mt-1">
                        Extra security layer for your account
                      </p>
                    </div>
                    <Switch
                      checked={security.twoFactorEnabled}
                      onCheckedChange={(checked) => setSecurity({ ...security, twoFactorEnabled: checked })}
                    />
                  </div>

                  {/* Session Timeout */}
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Session Timeout</Label>
                    <Select 
                      value={security.sessionTimeout} 
                      onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Login Alerts */}
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">Login Alerts</h4>
                      <p className="text-sm text-slate-500">Get notified of new login attempts</p>
                    </div>
                    <Switch
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) => setSecurity({ ...security, loginAlerts: checked })}
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSaveSecurity}
                      disabled={isSaving}
                      className="bg-teal-600 hover:bg-teal-700"
                    >
                      <Save size={16} className="mr-2" />
                      {isSaving ? 'Saving...' : 'Save Security Settings'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Sessions</CardTitle>
                  <CardDescription>Manage devices where you're currently logged in</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <Globe className="text-teal-600" size={20} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">Chrome on macOS</div>
                        <div className="text-sm text-slate-500">New York, NY • Current Session</div>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Access Tab */}
            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="text-teal-600" size={24} />
                    API Access
                  </CardTitle>
                  <CardDescription>Manage your API keys for Propel Capital integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* API Key Display */}
                  <div className="space-y-4">
                    <div>
                      <Label>Production API Key</Label>
                      <div className="flex gap-2 mt-2">
                        <div className="flex-1 relative">
                          <Input
                            readOnly
                            value={showApiKey ? 'pk_live_1234567890abcdefghijklmnopqrst' : '••••••••••••••••••••••••••••••'}
                            className="font-mono text-sm"
                          />
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                        <Button variant="outline" onClick={() => {
                          navigator.clipboard.writeText('pk_live_1234567890abcdefghijklmnopqrst');
                          toast.success('API key copied to clipboard');
                        }}>
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label>Test API Key</Label>
                      <div className="flex gap-2 mt-2">
                        <Input
                          readOnly
                          value="pk_test_abcdefghijklmnopqrstuvwxyz123"
                          className="font-mono text-sm"
                        />
                        <Button variant="outline" onClick={() => {
                          navigator.clipboard.writeText('pk_test_abcdefghijklmnopqrstuvwxyz123');
                          toast.success('Test API key copied');
                        }}>
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <div className="flex gap-2">
                        <Shield className="text-amber-600 shrink-0" size={20} />
                        <div className="text-sm">
                          <p className="font-semibold text-amber-900">Keep your API keys secure</p>
                          <p className="text-amber-700 mt-1">Never share your API keys or commit them to version control. Rotate keys regularly for security.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* API Documentation */}
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">API Documentation</h4>
                    <div className="grid gap-3">
                      <Button variant="outline" className="justify-start">
                        <Sparkles size={16} className="mr-2" />
                        View API Documentation
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <CreditCard size={16} className="mr-2" />
                        Webhook Setup Guide
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      Regenerate API Keys
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute allowedRoles={['lender']}>
      <AccountContent />
    </ProtectedRoute>
  );
}

