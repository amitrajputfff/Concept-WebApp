'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export type UserRole = 'lender' | 'merchant' | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  business?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS = {
  lender: {
    id: 'lender-1',
    name: 'Jane Doe',
    role: 'lender' as UserRole,
    avatar: 'JD',
  },
  merchant: {
    id: 'merchant-1',
    name: 'Maria',
    role: 'merchant' as UserRole,
    avatar: 'M',
    business: 'Taco Rico',
    location: 'Austin, TX',
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('propel_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse stored user:', error);
      localStorage.removeItem('propel_user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (role: UserRole) => {
    if (!role) return;
    
    const mockUser = MOCK_USERS[role];
    setUser(mockUser);
    localStorage.setItem('propel_user', JSON.stringify(mockUser));

    // Check if onboarding is complete
    const onboardingKey = `propel_onboarding_complete_${role}`;
    const onboardingComplete = localStorage.getItem(onboardingKey);

    // Redirect based on role and onboarding status
    if (!onboardingComplete) {
      if (role === 'merchant') {
        // Redirect merchants to mobile onboarding
        router.push('/mobile/onboarding');
      } else {
        router.push(`/onboarding/${role}`);
      }
    } else {
      if (role === 'lender') {
        router.push('/dashboard');
      } else if (role === 'merchant') {
        router.push('/mobile');
      }
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('propel_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected route wrapper component
export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !allowedRoles.includes(user.role))) {
      router.push('/login');
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}

