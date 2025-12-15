'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type WavyBackgroundProps = {
  children?: React.ReactNode;
  className?: string;
};

/**
 * Minimal wavy/halo background that keeps focus on the content.
 * Uses soft blurs + slow drift to avoid busy visuals.
 */
export function WavyBackground({ children, className }: WavyBackgroundProps) {
  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-3xl bg-slate-900 text-white shadow-xl',
        'border border-white/5',
        className,
      )}
    >
      {/* Glow layers */}
      <div className="absolute inset-0">
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-teal-400/25 blur-[90px] animate-drift-slow" />
        <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-emerald-400/20 blur-[80px] animate-drift" />
        <div className="absolute left-1/2 bottom-[-6rem] h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-400/25 blur-[110px] animate-drift-slower" />
      </div>

      {/* Soft wave overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.18),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.18),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(59,130,246,0.12),transparent_32%)] animate-wave" />
      </div>

      <div className="relative px-6 py-16 sm:px-10 sm:py-20 md:px-16 md:py-24">
        {children}
      </div>
    </div>
  );
}

