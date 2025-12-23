'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute, useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle, Building2, MapPin, Users, DollarSign, Settings, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Logo component with fallback
function ProviderLogo({ logo, label, size = 'md' }: { logo: string; label: string; size?: 'sm' | 'md' | 'lg' }) {
  const [imgError, setImgError] = useState(false);
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };
  const paddingClasses = {
    sm: 'p-0.5',
    md: 'p-1',
    lg: 'p-1.5',
  };

  if (imgError) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center font-bold text-teal-700 border border-teal-200`}>
        {label.charAt(0)}
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200`}>
      <img
        src={logo}
        alt={`${label} logo`}
        className={`w-full h-full object-contain ${paddingClasses[size]}`}
        onError={() => setImgError(true)}
      />
    </div>
  );
}

type Category = 'banking' | 'pos' | 'accounting' | 'identity';

type ProviderOption = {
  value: string;
  label: string;
  logo: string;
  description: string;
  fields: {
    label: string;
    placeholder: string;
    type?: 'text' | 'email' | 'password' | 'number';
  }[];
};

const providerOptions: Record<Category, ProviderOption[]> = {
  banking: [
    {
      value: 'plaid',
      label: 'Plaid',
      logo: '/plaid.png',
      description: 'Fast bank connections',
      fields: [
        { label: 'Plaid Public Token', placeholder: 'demo-public-token-xyz', type: 'text' },
        { label: 'Environment', placeholder: 'sandbox or production', type: 'text' },
        { label: 'Client ID', placeholder: 'your-client-id', type: 'text' },
        { label: 'Secret Key', placeholder: 'your-secret-key', type: 'password' },
      ],
    },
    {
      value: 'mx',
      label: 'MX',
      logo: '/mx.png',
      description: 'Coverage-focused aggregator',
      fields: [
        { label: 'MX Client GUID', placeholder: 'mx-sandbox-guid-123', type: 'text' },
        { label: 'API Key', placeholder: 'your-api-key', type: 'text' },
        { label: 'User GUID', placeholder: 'user-guid-456', type: 'text' },
        { label: 'Member GUID', placeholder: 'member-guid-789', type: 'text' },
      ],
    },
    {
      value: 'finicity',
      label: 'Finicity',
      logo: '/fincity.png',
      description: 'Open banking rails',
      fields: [
        { label: 'Finicity Partner ID', placeholder: 'partner-id-12345', type: 'text' },
        { label: 'App Key', placeholder: 'your-app-key', type: 'text' },
        { label: 'App Secret', placeholder: 'your-app-secret', type: 'password' },
        { label: 'Customer ID', placeholder: 'customer-id-678', type: 'text' },
      ],
    },
  ],
  pos: [
    {
      value: 'square',
      label: 'Square',
      logo: '/Square.png',
      description: 'POS + payments',
      fields: [
        { label: 'Square Location ID', placeholder: 'loc_12ABC', type: 'text' },
        { label: 'Application ID', placeholder: 'sq0idp-xxxxx', type: 'text' },
        { label: 'Access Token', placeholder: 'EAAAxxxxx', type: 'text' },
        { label: 'Environment', placeholder: 'sandbox or production', type: 'text' },
      ],
    },
    {
      value: 'toast',
      label: 'Toast',
      logo: '/toast.png',
      description: 'Restaurant POS',
      fields: [
        { label: 'Toast Restaurant ID', placeholder: 'toast-venue-992', type: 'text' },
        { label: 'API Key', placeholder: 'your-api-key', type: 'text' },
        { label: 'Location ID', placeholder: 'location-id-123', type: 'text' },
        { label: 'Merchant ID', placeholder: 'merchant-id-456', type: 'text' },
      ],
    },
    {
      value: 'clover',
      label: 'Clover',
      logo: '/clover.png',
      description: 'Payments hardware',
      fields: [
        { label: 'Clover Merchant ID', placeholder: 'clover-merchant-552', type: 'text' },
        { label: 'App ID', placeholder: 'your-app-id', type: 'text' },
        { label: 'Access Token', placeholder: 'access-token-xxx', type: 'text' },
        { label: 'API Token', placeholder: 'api-token-xxx', type: 'text' },
      ],
    },
    {
      value: 'shopify',
      label: 'Shopify',
      logo: '/shopify.png',
      description: 'E-commerce platform',
      fields: [
        { label: 'Shopify Shop Domain', placeholder: 'tacorico.myshopify.com', type: 'text' },
        { label: 'API Key', placeholder: 'your-api-key', type: 'text' },
        { label: 'API Secret', placeholder: 'your-api-secret', type: 'password' },
        { label: 'Access Token', placeholder: 'shpat_xxxxx', type: 'text' },
      ],
    },
  ],
  accounting: [
    {
      value: 'quickbooks',
      label: 'QuickBooks',
      logo: '/quickbook.png',
      description: 'Core ledger + cashflow',
      fields: [
        { label: 'QuickBooks Company ID', placeholder: 'qb-company-8831', type: 'text' },
        { label: 'Client ID', placeholder: 'your-client-id', type: 'text' },
        { label: 'Client Secret', placeholder: 'your-client-secret', type: 'password' },
        { label: 'Realm ID', placeholder: 'realm-id-123', type: 'text' },
      ],
    },
    {
      value: 'xero',
      label: 'Xero',
      logo: '/xero.png',
      description: 'Cloud-first accounting',
      fields: [
        { label: 'Xero Organisation ID', placeholder: 'xero-org-4411', type: 'text' },
        { label: 'Client ID', placeholder: 'your-client-id', type: 'text' },
        { label: 'Client Secret', placeholder: 'your-client-secret', type: 'password' },
        { label: 'Tenant ID', placeholder: 'tenant-id-456', type: 'text' },
      ],
    },
    {
      value: 'freshbooks',
      label: 'FreshBooks',
      logo: '/freshbooks.png',
      description: 'Invoices and expenses',
      fields: [
        { label: 'FreshBooks Firm ID', placeholder: 'freshbooks-firm-1022', type: 'text' },
        { label: 'Client ID', placeholder: 'your-client-id', type: 'text' },
        { label: 'Client Secret', placeholder: 'your-client-secret', type: 'password' },
        { label: 'Access Token', placeholder: 'access-token-xxx', type: 'text' },
      ],
    },
    {
      value: 'zoho',
      label: 'ZOHO',
      logo: '/zoho.png',
      description: 'ZOHO Books suite',
      fields: [
        { label: 'ZOHO Books Org ID', placeholder: 'zoho-org-3301', type: 'text' },
        { label: 'Client ID', placeholder: 'your-client-id', type: 'text' },
        { label: 'Client Secret', placeholder: 'your-client-secret', type: 'password' },
        { label: 'Organization ID', placeholder: 'org-id-789', type: 'text' },
      ],
    },
  ],
  identity: [
    {
      value: 'fico',
      label: 'FICO',
      logo: '/fico.png',
      description: 'SBSS & risk signals',
      fields: [
        { label: 'FICO SBSS ID', placeholder: 'sbss-9012', type: 'text' },
        { label: 'API Key', placeholder: 'your-api-key', type: 'text' },
        { label: 'Account ID', placeholder: 'account-id-123', type: 'text' },
        { label: 'Business ID', placeholder: 'business-id-456', type: 'text' },
      ],
    },
    {
      value: 'dnb',
      label: 'Dun & Bradstreet',
      logo: '/dun and bradstreet.png',
      description: 'Trade lines & PAYDEX',
      fields: [
        { label: 'DUNS Number', placeholder: '08-123-4567', type: 'text' },
        { label: 'API Key', placeholder: 'your-api-key', type: 'text' },
        { label: 'User ID', placeholder: 'user-id-789', type: 'text' },
        { label: 'Password', placeholder: 'your-password', type: 'password' },
      ],
    },
    {
      value: 'experian',
      label: 'Experian',
      logo: '/experian.png',
      description: 'Business bureau data',
      fields: [
        { label: 'Experian BIN / Member ID', placeholder: 'exp-merchant-778', type: 'text' },
        { label: 'User ID', placeholder: 'user-id-123', type: 'text' },
        { label: 'Password', placeholder: 'your-password', type: 'password' },
        { label: 'Subscriber Code', placeholder: 'subscriber-code-456', type: 'text' },
      ],
    },
    {
      value: 'equifax',
      label: 'Equifax',
      logo: '/equifax.png',
      description: 'Credit + fraud checks',
      fields: [
        { label: 'Equifax Merchant ID', placeholder: 'eqfx-merchant-310', type: 'text' },
        { label: 'API Key', placeholder: 'your-api-key', type: 'text' },
        { label: 'User ID', placeholder: 'user-id-123', type: 'text' },
        { label: 'Password', placeholder: 'your-password', type: 'password' },
      ],
    },
  ],
};

const categoryLabels: Record<Category, string> = {
  banking: 'Banking Data',
  pos: 'POS Systems',
  accounting: 'Accounting Software',
  identity: 'Business Identity & Public Records',
};

const steps = [
  { title: 'Welcome', key: 'welcome' },
  { title: 'Business Details', key: 'business' },
  { title: 'Connect Services', key: 'services' },
  { title: 'Review', key: 'review' },
];

function MobileOnboardingContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [businessDetails, setBusinessDetails] = useState({
    businessName: '',
    legalName: '',
    location: '',
    monthlyRevenue: '',
    employees: '',
    businessType: '',
  });
  const [connections, setConnections] = useState<Record<Category, { provider: string; fields: Record<string, string> }>>({
    banking: { provider: '', fields: {} },
    pos: { provider: '', fields: {} },
    accounting: { provider: '', fields: {} },
    identity: { provider: '', fields: {} },
  });
  const [selectedProvider, setSelectedProvider] = useState<{ category: Category; provider: string } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);

  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = () => {
    if (step === 0) {
      // Welcome step - just continue
      setStep(1);
    } else if (step === 1) {
      // Validate business details
      if (!businessDetails.businessName || !businessDetails.location) {
        toast.error('Please fill in required fields');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      // Validate at least one connection
      const hasConnection = Object.values(connections).some((c) => c.provider && Object.keys(c.fields).length > 0);
      if (!hasConnection) {
        toast.error('Please connect at least one service');
        return;
      }
      setStep(3);
    } else {
      // Complete onboarding
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const completeOnboarding = () => {
    localStorage.setItem('propel_onboarding_complete_merchant', 'true');
    localStorage.setItem('propel_business_details', JSON.stringify(businessDetails));
    localStorage.setItem('propel_connections', JSON.stringify(connections));
    toast.success('Onboarding complete!');
    router.push('/mobile');
  };

  const handleConnectionChange = (category: Category, provider: string) => {
    setSelectedProvider({ category, provider });
    setConnections((prev) => ({
      ...prev,
      [category]: {
        provider,
        fields: {},
      },
    }));
  };

  const handleProviderFieldChange = (category: Category, fieldLabel: string, value: string) => {
    setConnections((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        fields: {
          ...prev[category].fields,
          [fieldLabel]: value,
        },
      },
    }));
  };

  const handleProviderDetailBack = () => {
    setSelectedProvider(null);
  };

  const handleProviderDetailSave = () => {
    if (!selectedProvider) return;
    const provider = providerOptions[selectedProvider.category].find((p) => p.value === selectedProvider.provider);
    if (!provider) return;

    // Validate all fields are filled
    const allFieldsFilled = provider.fields.every((field) => {
      const value = connections[selectedProvider.category].fields[field.label];
      return value && value.trim() !== '';
    });

    if (!allFieldsFilled) {
      toast.error('Please fill in all fields');
      return;
    }

    // Start verification process
    setIsVerifying(true);
    setVerificationComplete(false);

    // Simulate verification process
    setTimeout(() => {
      setVerificationComplete(true);
      setTimeout(() => {
        setIsVerifying(false);
        setVerificationComplete(false);
        setSelectedProvider(null);
        toast.success(`${provider.label} connected successfully!`);
      }, 1500);
    }, 2500);
  };

  const handleFillDemoCredentials = () => {
    if (!selectedProvider) return;
    const provider = providerOptions[selectedProvider.category].find((p) => p.value === selectedProvider.provider);
    if (!provider) return;

    const demoFields: Record<string, string> = {};
    provider.fields.forEach((field) => {
      demoFields[field.label] = field.placeholder;
    });

    setConnections((prev) => ({
      ...prev,
      [selectedProvider.category]: {
        ...prev[selectedProvider.category],
        fields: demoFields,
      },
    }));

    toast.success('Demo credentials filled!');
  };

  const selectedOption = (category: Category) =>
    providerOptions[category].find((option) => option.value === connections[category]?.provider);

  const renderWelcome = () => (
    <div className="px-6 py-4 space-y-6">
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Welcome, {user?.name}!</h2>
        <p className="text-slate-600">
          Let's set up your business profile and connect your services to get started with Propel Capital.
        </p>
      </div>

      <Card className="bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200">
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-teal-700">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-semibold">Quick Setup</span>
            </div>
            <p className="text-sm text-slate-700">
              This will only take a few minutes. We'll collect your business information and connect your services.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {steps.slice(1).map((s, idx) => (
          <div key={s.key} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              {idx + 1}
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">{s.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBusinessDetails = () => (
    <div className="px-6 py-4 space-y-4">
      <div className="space-y-1 mb-4">
        <h2 className="text-xl font-bold text-slate-900">Business Information</h2>
        <p className="text-sm text-slate-600">Tell us about your business</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business-name" className="text-slate-700">
            Business Name <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              id="business-name"
              value={businessDetails.businessName}
              onChange={(e) => setBusinessDetails({ ...businessDetails, businessName: e.target.value })}
              placeholder="Taco Rico"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="legal-name" className="text-slate-700">
            Legal Entity Name
          </Label>
          <Input
            id="legal-name"
            value={businessDetails.legalName}
            onChange={(e) => setBusinessDetails({ ...businessDetails, legalName: e.target.value })}
            placeholder="Taco Rico LLC"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-slate-700">
            Location <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <Input
              id="location"
              value={businessDetails.location}
              onChange={(e) => setBusinessDetails({ ...businessDetails, location: e.target.value })}
              placeholder="Austin, TX"
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="business-type" className="text-slate-700">
            Business Type
          </Label>
          <Input
            id="business-type"
            value={businessDetails.businessType}
            onChange={(e) => setBusinessDetails({ ...businessDetails, businessType: e.target.value })}
            placeholder="Restaurant / Retail / Service"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="revenue" className="text-slate-700">
              Monthly Revenue
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="revenue"
                value={businessDetails.monthlyRevenue}
                onChange={(e) => setBusinessDetails({ ...businessDetails, monthlyRevenue: e.target.value })}
                placeholder="$120,000"
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employees" className="text-slate-700">
              Employees
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                id="employees"
                value={businessDetails.employees}
                onChange={(e) => setBusinessDetails({ ...businessDetails, employees: e.target.value })}
                placeholder="18"
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServices = () => (
    <div className="px-6 py-4 space-y-4">
      <div className="space-y-1 mb-4">
        <h2 className="text-xl font-bold text-slate-900">Connect Your Services</h2>
        <p className="text-sm text-slate-600">Choose providers to connect</p>
      </div>

      <div className="space-y-4">
        {(Object.keys(providerOptions) as Category[]).map((category) => {
          const selected = selectedOption(category);
          return (
            <Card key={category} className="border-slate-200">
              <CardContent className="pt-4 space-y-3">
                <div className="space-y-1">
                  <Label className="text-sm font-semibold text-slate-900">{categoryLabels[category]}</Label>
                  <p className="text-xs text-slate-500">Select a provider</p>
                </div>

                <Select
                  value={connections[category]?.provider || ''}
                  onValueChange={(value) => handleConnectionChange(category, value)}
                >
                  <SelectTrigger className="w-full h-auto py-3">
                    {selected ? (
                      <div className="flex items-center gap-3 w-full">
                        <ProviderLogo logo={selected.logo} label={selected.label} size="md" />
                        <span className="text-sm font-semibold text-slate-900">{selected.label}</span>
                      </div>
                    ) : (
                      <SelectValue placeholder={`Select ${categoryLabels[category]}`} />
                    )}
                  </SelectTrigger>
                  <SelectContent>
                    {providerOptions[category].map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2 py-1">
                          <ProviderLogo logo={option.logo} label={option.label} size="sm" />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">{option.label}</p>
                            <p className="text-xs text-slate-500">{option.description}</p>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selected && connections[category]?.provider && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {Object.keys(connections[category].fields).length === selected.fields.length ? (
                        <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {Object.keys(connections[category].fields).length} of {selected.fields.length} fields filled
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnectionChange(category, connections[category].provider)}
                      className="text-xs"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderProviderDetail = () => {
    if (!selectedProvider) return null;

    const provider = providerOptions[selectedProvider.category].find(
      (p) => p.value === selectedProvider.provider
    );
    if (!provider) return null;

    return (
      <div className="px-6 py-4 space-y-4">
        <div className="space-y-1 mb-4">
          <div className="flex items-center gap-3 mb-2">
            <ProviderLogo logo={provider.logo} label={provider.label} size="lg" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">{provider.label}</h2>
              <p className="text-sm text-slate-600">{categoryLabels[selectedProvider.category]}</p>
            </div>
          </div>
          <p className="text-sm text-slate-500">Enter your connection details</p>
        </div>

        <div className="space-y-4">
          {provider.fields.map((field, index) => {
            const fieldValue = connections[selectedProvider.category]?.fields[field.label] || '';
            const isFilled = fieldValue.trim() !== '';
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor={`${selectedProvider.category}-${selectedProvider.provider}-${index}`} className="text-slate-700">
                    {field.label}
                  </Label>
                  {isFilled && (
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                  )}
                </div>
                <Input
                  id={`${selectedProvider.category}-${selectedProvider.provider}-${index}`}
                  type={field.type || 'text'}
                  value={fieldValue}
                  onChange={(e) => handleProviderFieldChange(selectedProvider.category, field.label, e.target.value)}
                  placeholder={field.placeholder}
                  className={isFilled ? 'border-emerald-200 bg-emerald-50/50' : ''}
                />
              </div>
            );
          })}
        </div>

        <Button
          variant="outline"
          onClick={handleFillDemoCredentials}
          className="w-full border-teal-200 text-teal-700 hover:bg-teal-50"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Fill Demo Credentials
        </Button>
      </div>
    );
  };

  const renderReview = () => (
    <div className="px-6 py-4 space-y-4">
      <div className="space-y-1 mb-4">
        <h2 className="text-xl font-bold text-slate-900">Review & Confirm</h2>
        <p className="text-sm text-slate-600">Review your information before continuing</p>
      </div>

      <Card>
        <CardContent className="pt-4 space-y-3">
          <div className="space-y-2">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Business Details</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Business Name</span>
                <span className="font-semibold text-slate-900">{businessDetails.businessName}</span>
              </div>
              {businessDetails.legalName && (
                <div className="flex justify-between">
                  <span className="text-slate-600">Legal Name</span>
                  <span className="font-semibold text-slate-900">{businessDetails.legalName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-600">Location</span>
                <span className="font-semibold text-slate-900">{businessDetails.location}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 space-y-3">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">Connected Services</p>
          {(Object.keys(connections) as Category[]).map((category) => {
            const selected = selectedOption(category);
            if (!selected) return null;
            const fieldsCount = Object.keys(connections[category]?.fields || {}).length;
            const isVerified = fieldsCount === selected.fields.length;
            return (
              <div key={category} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ProviderLogo logo={selected.logo} label={selected.label} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{selected.label}</p>
                    <p className="text-xs text-slate-500">{categoryLabels[category]}</p>
                  </div>
                </div>
                {isVerified ? (
                  <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    {fieldsCount > 0 ? `${fieldsCount} fields` : 'Not configured'}
                  </Badge>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-emerald-900">Ready to go!</p>
              <p className="text-xs text-emerald-700">
                Your business profile is set up. You'll be redirected to the mobile app.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderVerification = () => {
    const provider = selectedProvider
      ? providerOptions[selectedProvider.category].find((p) => p.value === selectedProvider.provider)
      : null;

    return (
      <div className="px-6 py-4 flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="w-24 h-24 rounded-full bg-teal-100 flex items-center justify-center">
          {verificationComplete ? (
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          ) : (
            <Loader2 className="w-12 h-12 text-teal-600 animate-spin" />
          )}
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            {verificationComplete ? 'Verified!' : 'Verifying your details...'}
          </h2>
          {provider && (
            <p className="text-slate-600">
              {verificationComplete
                ? `${provider.label} has been successfully connected`
                : `Please wait while we verify your ${provider.label} connection`}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    // Show verification screen if verifying
    if (isVerifying || verificationComplete) {
      return renderVerification();
    }

    // Show provider detail screen if a provider is selected
    if (selectedProvider) {
      return renderProviderDetail();
    }

    switch (step) {
      case 0:
        return renderWelcome();
      case 1:
        return renderBusinessDetails();
      case 2:
        return renderServices();
      case 3:
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      {/* Phone Frame */}
      <div className="w-full h-full sm:w-[390px] sm:h-[844px] sm:max-h-[90vh] bg-black sm:rounded-[3rem] shadow-2xl relative sm:border-[12px] border-slate-900">
        {/* Dynamic Island / Notch */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-20"></div>

        {/* Screen Content */}
        <div className="w-full h-full bg-white sm:rounded-[2rem] overflow-hidden relative sm:pt-10 flex flex-col">
          {/* Header */}
          <div className="bg-teal-600 p-6 pb-4 rounded-b-[2rem] shadow-lg">
            <div className="flex items-center justify-between mb-4">
              {(step > 0 || selectedProvider) && !isVerifying && !verificationComplete ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={selectedProvider ? handleProviderDetailBack : handleBack}
                  className="text-white hover:bg-teal-700"
                >
                  <ChevronLeft size={24} />
                </Button>
              ) : (
                <div className="w-10"></div>
              )}
              <div className="flex-1 text-center">
                <h1 className="text-lg font-bold text-white">
                  {isVerifying || verificationComplete
                    ? 'Verifying'
                    : selectedProvider
                    ? 'Provider Details'
                    : 'Onboarding'}
                </h1>
                <p className="text-xs text-teal-100">
                  {isVerifying || verificationComplete
                    ? 'Please wait...'
                    : selectedProvider
                    ? 'Enter connection details'
                    : `Step ${step + 1} of ${steps.length}`}
                </p>
              </div>
              <div className="w-10"></div>
            </div>
            {!selectedProvider && !isVerifying && !verificationComplete && <Progress value={progress} className="h-2 bg-teal-700" />}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto pb-20">{renderStepContent()}</div>

          {/* Bottom Navigation */}
          {(isVerifying || verificationComplete) ? null : (
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
              {selectedProvider ? (
                <Button
                  onClick={handleProviderDetailSave}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  size="lg"
                >
                  Save & Continue
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="w-full bg-teal-600 hover:bg-teal-700"
                  size="lg"
                >
                  {step === steps.length - 1 ? (
                    <>
                      Complete Setup
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  ) : (
                    <>
                      Continue
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MobileOnboardingPage() {
  return (
    <ProtectedRoute allowedRoles={['merchant']}>
      <MobileOnboardingContent />
    </ProtectedRoute>
  );
}

