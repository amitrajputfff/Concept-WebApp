'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Zap } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // Redirect based on role if already logged in
        if (user.role === 'lender') {
          router.push('/dashboard');
        } else if (user.role === 'merchant') {
          router.push('/mobile');
        }
      } else {
        // Redirect to login if not logged in
        router.push('/login');
      }
    }
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200 mx-auto mb-4 animate-pulse">
          <Zap className="w-10 h-10 text-white" />
        </div>
        <p className="text-sm text-slate-600 animate-pulse">Loading Propel Capital...</p>
      </div>
    </div>
  );
}
