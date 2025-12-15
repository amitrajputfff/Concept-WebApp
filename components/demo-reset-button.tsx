'use client';

import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function DemoResetButton() {
  const router = useRouter();

  const handleReset = () => {
    localStorage.removeItem('propel_user');
    toast.success('Demo reset! Redirecting to login...');
    setTimeout(() => {
      router.push('/login');
    }, 500);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleReset}
      className="text-slate-400 hover:text-slate-600"
    >
      <RotateCcw className="h-4 w-4 mr-1" />
      Reset Demo
    </Button>
  );
}

