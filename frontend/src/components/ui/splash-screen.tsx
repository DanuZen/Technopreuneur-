"use client";

import React, { useEffect, useRef, useState } from "react";

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
  message,
  subMessage,
  duration,
  onFinish,
}: SplashScreenProps) {
  const [show, setShow] = useState(isVisible);
  const [fade, setFade] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const dismiss = React.useCallback(() => {
    setFade(true);
    setTimeout(() => {
      setShow(false);
      if (onFinish) onFinish();
    }, 380);
  }, [onFinish]);

  useEffect(() => {
    if (!isVisible) {
      setFade(true);
      const timer = setTimeout(() => setShow(false), 450);
      return () => clearTimeout(timer);
    }

    setShow(true);
    setFade(false);

    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Fallback jika autoplay diblokir
      });
    }

    const effectiveDuration = duration ?? 4200;
    const finishTimer = setTimeout(() => {
      dismiss();
    }, effectiveDuration);

    return () => {
      clearTimeout(finishTimer);
    };
  }, [isVisible, duration, dismiss]);

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Splash Screen Pasbana"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#eceef0] text-[#0f2c56] overflow-hidden transition-opacity duration-500 ease-out select-none ${
        fade ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center">
        {/* Compact Centered Video Splash */}
        <div className="w-[240px] sm:w-[300px] md:w-[340px] aspect-video overflow-hidden rounded-2xl">
          <video
            ref={videoRef}
            src="/splash-screen.webm"
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => {
              if (!duration) dismiss();
            }}
            onError={dismiss}
            className="w-full h-full object-contain mix-blend-multiply"
          >
            <source src="/splash-screen.webm" type="video/webm" />
          </video>
        </div>

        {(message || subMessage) && (
          <div className="mt-4 space-y-0.5 animate-fade-in-up">
            {message && (
              <p className="text-xs sm:text-sm font-bold text-[#0f2c56]">
                {message}
              </p>
            )}
            {subMessage && (
              <p className="text-[11px] text-slate-500 font-medium">
                {subMessage}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
