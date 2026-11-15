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
  message = "Memuat Pasbana AI...",
  subMessage = "Menyiapkan ruang evaluasi CV & karir Anda",
  duration = 1000,
  onFinish,
}: SplashScreenProps) {
  const [show, setShow] = useState(isVisible);
  const [fade, setFade] = useState(false);
  const [progressActive, setProgressActive] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setFade(true);
      setProgressActive(false);
      const timer = setTimeout(() => setShow(false), 500);
      return () => clearTimeout(timer);
    }

    setShow(true);
    setFade(false);
    setProgressActive(false);

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setProgressActive(true));
    });

    const finishTimer = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        setShow(false);
        if (onFinish) onFinish();
      }, 380);
    }, duration);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(finishTimer);
    };
  }, [isVisible, duration, onFinish]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1f3d] via-[#0f2c56] to-[#163c73] text-white overflow-hidden transition-all ${
        fade ? "splash-fade-out" : "splash-fade-in"
      }`}
    >
      {/* Soft Ambient Glow Orbs */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-28 -right-28 w-96 h-96 rounded-full bg-[#ce2731]/25 blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.07)_0%,transparent_62%)]" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-6 max-w-md mx-auto">
        {/* Aligned Brand Lockup */}
        <div className="flex items-center gap-5 sm:gap-6">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 drop-shadow-[0_20px_38px_rgba(0,0,0,0.35)]">
            <Image
              src="/logo-white.webp"
              alt="Logo Pasbana"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col justify-center space-y-2 text-left animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl font-black tracking-[0.06em] text-white leading-none uppercase">
              PASBANA
            </h1>
            <div className="w-full flex items-center justify-between gap-2.5">
              <span className="w-5 h-1 rounded-full bg-[#ce2731] shrink-0" />
              <p className="text-[10px] sm:text-[11px] font-bold text-white/85 uppercase tracking-[0.14em] leading-none whitespace-nowrap">
                KARIR YANG PAS BANA
              </p>
            </div>
          </div>
        </div>

        {/* Animated Progress Bar & Status Message */}
        <div className="w-60 sm:w-68 space-y-2.5 animate-fade-in-up delay-100">
          <div className="w-full h-1.5 rounded-full bg-white/15 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#ce2731] via-[#ff4d58] to-white transition-all ease-out"
              style={{
                width: progressActive ? "100%" : "8%",
                transitionDuration: `${duration}ms`,
              }}
            />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs sm:text-sm font-bold text-white/95 tracking-wide">
              {message}
            </p>
            {subMessage && (
              <p className="text-[11px] text-white/65 font-medium">
                {subMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
