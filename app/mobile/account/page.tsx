'use client';

import { ProtectedRoute, useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, 
  User, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Settings, 
  Shield, 
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  Edit
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

function AccountContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [businessDetails, setBusinessDetails] = useState<any>(null);

  useEffect(() => {
    // Load business details from localStorage
    const stored = localStorage.getItem('propel_business_details');
    if (stored) {
      try {
        setBusinessDetails(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse business details', e);
      }
    }
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Phone Frame - Responsive: Full screen on mobile, frame on desktop */}
      <div className="w-full h-full sm:w-[390px] sm:h-[844px] sm:max-h-[90vh] bg-black sm:rounded-[3rem] shadow-2xl relative sm:border-[12px] border-slate-900">
        {/* Dynamic Island / Notch - Only on desktop */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20"></div>

        {/* Screen Content */}
        <div className="w-full h-full bg-slate-50 sm:rounded-[2rem] overflow-hidden relative flex flex-col min-h-0 sm:pt-10">
          {/* Header */}
          <div className="bg-white border-b sticky top-0 z-10">
            <div className="p-4 flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push('/mobile')}>
                <ChevronLeft size={24} />
              </Button>
              <div className="flex-1">
                <h1 className="font-bold text-base sm:text-lg">Account</h1>
                <p className="text-xs text-muted-foreground">Manage your profile & settings</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Profile Card */}
            <Card className="bg-gradient-to-br from-teal-600 to-emerald-600 text-white border-0">
              <CardContent className="pt-6 pb-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-2xl font-bold">
                    {user?.name?.charAt(0) || 'M'}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">{user?.name || 'Maria'}</h2>
                    <p className="text-teal-100 text-sm">{user?.business || businessDetails?.businessName || 'Taco Rico'}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => {/* Edit profile */}}
                  >
                    <Edit size={20} />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
                  <div>
                    <div className="text-teal-100 text-xs mb-1">Role</div>
                    <div className="font-semibold">Merchant</div>
                  </div>
                  <div>
                    <div className="text-teal-100 text-xs mb-1">Status</div>
                    <div className="font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-emerald-300 rounded-full"></span>
                      Active
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Business Information</h3>
                  <Button variant="ghost" size="sm" className="text-teal-600">
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">Business Name</div>
                      <div className="font-medium text-slate-900">
                        {businessDetails?.businessName || user?.business || 'Taco Rico'}
                      </div>
                    </div>
                  </div>
                  {businessDetails?.legalName && (
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs text-slate-500 mb-1">Legal Name</div>
                        <div className="font-medium text-slate-900">{businessDetails.legalName}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1">Location</div>
                      <div className="font-medium text-slate-900">
                        {businessDetails?.location || user?.location || 'Austin, TX'}
                      </div>
                    </div>
                  </div>
                  {businessDetails?.monthlyRevenue && (
                    <div className="flex items-start gap-3">
                      <CreditCard className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div className="flex-1">
                        <div className="text-xs text-slate-500 mb-1">Monthly Revenue</div>
                        <div className="font-medium text-slate-900">{businessDetails.monthlyRevenue}</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings Section */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Settings</div>
              
              <Card>
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => {/* Navigate to notifications */}}
                  >
                    <Bell size={20} className="text-slate-600" />
                    <span className="flex-1 text-left">Notifications</span>
                    <ChevronLeft size={16} className="text-slate-400 rotate-180" />
                  </Button>
                  <Separator />
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => {/* Navigate to security */}}
                  >
                    <Shield size={20} className="text-slate-600" />
                    <span className="flex-1 text-left">Security & Privacy</span>
                    <ChevronLeft size={16} className="text-slate-400 rotate-180" />
                  </Button>
                  <Separator />
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => {/* Navigate to payment methods */}}
                  >
                    <CreditCard size={20} className="text-slate-600" />
                    <span className="flex-1 text-left">Payment Methods</span>
                    <ChevronLeft size={16} className="text-slate-400 rotate-180" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Support Section */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">Support</div>
              
              <Card>
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 h-12"
                    onClick={() => {/* Navigate to help */}}
                  >
                    <HelpCircle size={20} className="text-slate-600" />
                    <span className="flex-1 text-left">Help & Support</span>
                    <ChevronLeft size={16} className="text-slate-400 rotate-180" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Logout Button */}
            <Card className="border-red-100">
              <CardContent className="p-0">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                  <span className="flex-1 text-left font-semibold">Log Out</span>
                </Button>
              </CardContent>
            </Card>

            {/* App Version */}
            <div className="text-center text-xs text-slate-400 py-4">
              Propel Capital v3.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <ProtectedRoute allowedRoles={['merchant']}>
      <AccountContent />
    </ProtectedRoute>
  );
}

