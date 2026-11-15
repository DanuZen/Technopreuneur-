"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  isVisible?: boolean;
  message?: string;
  subMessage?: string;
  duration?: number;
  variant?: "fade" | "slide";
  onFinish?: () => void;
}

export function SplashScreen({
  isVisible = true,
  duration = 1000,
  onFinish,
}: SplashScreenProps) {
  const [show, setShow] = useState(isVisible);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setFade(true);
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }

    setShow(true);
    setFade(false);

    const finishTimer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        setShow(false);
        if (onFinish) onFinish();
      }, 380);
    }, duration);

    return () => clearTimeout(finishTimer);
  }, [isVisible, duration, onFinish]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0f2c56] text-white overflow-hidden transition-all ${
        fade ? "splash-fade-out" : "splash-fade-in"
      }`}
    >
      <div className="relative z-10 flex items-center gap-4 sm:gap-5 px-6 max-w-md mx-auto">
        {/* Logo di Kiri */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 shrink-0 animate-float-slow">
          <Image
            src="/logo-white.webp"
            alt="Logo Pasbana"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Nama & Tagline di Kanan */}
        <div className="space-y-1.5 text-left animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-black tracking-wider text-white leading-none uppercase">
            PASBANA
          </h1>
          <p className="text-[11px] sm:text-xs font-bold text-white/80 uppercase tracking-[0.22em]">
            KARIR YANG PAS BANA
          </p>
        </div>
      </div>
    </div>
  );
}
