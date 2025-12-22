'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, User, Zap, TrendingUp, Shield, Sparkles, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const MOCK_CREDENTIALS = {
  lender: {
    email: 'jane@propelcapital.com',
    password: 'demo123',
    name: 'Jane Doe',
  },
  merchant: {
    email: 'maria@tacorico.com',
    password: 'demo123',
    name: 'Maria',
  },
};

export default function LoginPage() {
  const { user, login } = useAuth();
  const router = useRouter();
  const [lenderEmail, setLenderEmail] = useState('');
  const [lenderPassword, setLenderPassword] = useState('');
  const [merchantEmail, setMerchantEmail] = useState('');
  const [merchantPassword, setMerchantPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      if (user.role === 'lender') {
        router.push('/dashboard');
      } else if (user.role === 'merchant') {
        router.push('/mobile/onboarding');
      }
    }
  }, [user, router]);

  const handleLenderLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      lenderEmail === MOCK_CREDENTIALS.lender.email &&
      lenderPassword === MOCK_CREDENTIALS.lender.password
    ) {
      toast.success('Welcome back, Jane!');
      setTimeout(() => {
        login('lender');
        setIsLoading(false);
      }, 500);
    } else {
      toast.error('Invalid credentials. Try: jane@propelcapital.com / demo123');
      setIsLoading(false);
    }
  };

  const handleMerchantLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (
      merchantEmail === MOCK_CREDENTIALS.merchant.email &&
      merchantPassword === MOCK_CREDENTIALS.merchant.password
    ) {
      toast.success('Welcome back, Maria!');
      setTimeout(() => {
        login('merchant');
        setIsLoading(false);
      }, 500);
    } else {
      toast.error('Invalid credentials. Try: maria@tacorico.com / demo123');
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (type: 'lender' | 'merchant') => {
    if (type === 'lender') {
      setLenderEmail(MOCK_CREDENTIALS.lender.email);
      setLenderPassword(MOCK_CREDENTIALS.lender.password);
    } else {
      setMerchantEmail(MOCK_CREDENTIALS.merchant.email);
      setMerchantPassword(MOCK_CREDENTIALS.merchant.password);
    }
    toast.info('Demo credentials filled!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Propel Capital</h1>
          </div>
          <p className="text-lg text-slate-600 mb-2">Proactive Lending Intelligence</p>
          <Badge variant="outline" className="text-teal-700 border-teal-300 bg-teal-50">
            <Sparkles className="w-3 h-3 mr-1" />
            Demo Environment
          </Badge>
        </div>

        {/* Login Tabs */}
        <Card className="border-2 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Choose your role to access the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="lender" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="lender" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Lender
                </TabsTrigger>
                <TabsTrigger value="merchant" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Merchant
                </TabsTrigger>
              </TabsList>

              {/* Lender Login Form */}
              <TabsContent value="lender">
                <form onSubmit={handleLenderLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="lender-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lender-email"
                        type="email"
                        placeholder="jane@propelcapital.com"
                        value={lenderEmail}
                        onChange={(e) => setLenderEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lender-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lender-password"
                        type="password"
                        placeholder="Enter password"
                        value={lenderPassword}
                        onChange={(e) => setLenderPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In as Lender'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => fillDemoCredentials('lender')}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Fill Demo Credentials
                  </Button>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-4 text-sm">
                      <p className="font-semibold text-blue-900 mb-2">Demo Credentials:</p>
                      <p className="text-blue-700">Email: jane@propelcapital.com</p>
                      <p className="text-blue-700">Password: demo123</p>
                    </CardContent>
                  </Card>
                </form>
              </TabsContent>

              {/* Merchant Login Form */}
              <TabsContent value="merchant">
                <form onSubmit={handleMerchantLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="merchant-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="merchant-email"
                        type="email"
                        placeholder="maria@tacorico.com"
                        value={merchantEmail}
                        onChange={(e) => setMerchantEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="merchant-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="merchant-password"
                        type="password"
                        placeholder="Enter password"
                        value={merchantPassword}
                        onChange={(e) => setMerchantPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In as Merchant'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    size="sm"
                    onClick={() => fillDemoCredentials('merchant')}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Fill Demo Credentials
                  </Button>

                  <Card className="bg-teal-50 border-teal-200">
                    <CardContent className="pt-4 text-sm">
                      <p className="font-semibold text-teal-900 mb-2">Demo Credentials:</p>
                      <p className="text-teal-700">Email: maria@tacorico.com</p>
                      <p className="text-teal-700">Password: demo123</p>
                    </CardContent>
                  </Card>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-slate-500">
            Demo platform • Use credentials above to sign in
          </p>
          <p className="text-xs text-slate-400">
            Powered by LiaPlus AI • Propel Capital
          </p>
        </div>
      </div>
    </div>
  );
}

