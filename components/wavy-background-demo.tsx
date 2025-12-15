'use client';

import { WavyBackground } from './ui/wavy-background';

export function WavyBackgroundDemo() {
  return (
    <WavyBackground className="max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <p className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
          Hero waves, simplified
        </p>
        <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto">
          Canvas-free, performant glow layers that keep the spotlight on your message.
        </p>
      </div>
    </WavyBackground>
  );
}

