"use client";

import { useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-rose-500 flex items-center justify-center z-50">
      <div className="text-center animate-pulse">
        <div className="flex items-center justify-center mb-6">
          <Sparkles className="w-24 h-24 text-white drop-shadow-2xl animate-spin" style={{ animationDuration: '3s' }} />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          Aura BeautyIA
        </h1>
        <p className="text-xl text-white/90 font-light">
          Transforme sua beleza com IA
        </p>
      </div>
    </div>
  );
}
