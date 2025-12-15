'use client';

import { Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface SiteHeaderProps {
  onContextClick?: () => void;
}

export function SiteHeader({ onContextClick }: SiteHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex-1">
          <h1 className="text-sm font-semibold">Opportunity Radar</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Parse.AI Engine: Scanning 1,204 active connections...
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3">
        {onContextClick && (
          <Button variant="ghost" size="sm" onClick={onContextClick}>
            <Info className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Context</span>
          </Button>
        )}
        <Badge variant="outline" className="bg-teal-50 border-teal-200 text-teal-700">
          <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse mr-2"></span>
          <span className="hidden sm:inline">Active</span>
        </Badge>
      </div>
    </header>
  );
}

