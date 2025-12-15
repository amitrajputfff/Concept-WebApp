'use client';

import * as React from 'react';
import {
  Activity,
  CheckCircle,
  ShieldCheck,
  BarChart3,
  LifeBuoy,
  Send,
  Zap,
  LogOut,
  User,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { useAuth } from '@/lib/auth-context';

const data = {
  navMain: [
    {
      title: 'Opportunity Radar',
      url: '/dashboard',
      icon: Activity,
    },
    {
      title: 'Active Loans',
      url: '/dashboard/loans',
      icon: CheckCircle,
    },
    {
      title: 'Risk Controls',
      url: '/dashboard/risk',
      icon: ShieldCheck,
    },
    {
      title: 'Analytics',
      url: '/dashboard/analytics',
      icon: BarChart3,
    },
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth();
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  
  // Get user name from localStorage if available
  const [displayName, setDisplayName] = React.useState(user?.name || 'Jane Doe');
  const [avatarInitials, setAvatarInitials] = React.useState(user?.avatar || 'JD');
  
  const updateProfileFromStorage = React.useCallback(() => {
    const savedProfile = localStorage.getItem('propel_account_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        if (profile.fullName) {
          setDisplayName(profile.fullName);
          // Get initials from full name
          const names = profile.fullName.split(' ');
          const initials = names.length > 1 
            ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
            : names[0].substring(0, 2).toUpperCase();
          setAvatarInitials(initials);
        }
      } catch (e) {
        // Ignore parse errors
      }
    }
  }, []);

  React.useEffect(() => {
    updateProfileFromStorage();
    
    // Listen for storage changes (when profile is updated from account page)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'propel_account_profile') {
        updateProfileFromStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event (for same-tab updates)
    const handleCustomStorage = () => {
      updateProfileFromStorage();
    };
    
    window.addEventListener('propel_profile_updated', handleCustomStorage);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('propel_profile_updated', handleCustomStorage);
    };
  }, [updateProfileFromStorage]);

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-teal-600 text-white">
                  <Zap className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Propel Capital</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Lending Intelligence
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Portfolio</SidebarGroupLabel>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.title}
                >
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard/account'}
                tooltip="Account Settings"
              >
                <a href="/dashboard/account">
                  <User />
                  <span>Account</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard/account" className="cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-teal-100 text-teal-700">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{displayName}</span>
                  <span className="truncate text-xs text-muted-foreground">Admin View</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={logout}>
              <LogOut />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

