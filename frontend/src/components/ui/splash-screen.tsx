"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if user has already seen the splash screen in current session
    const searchParams = new URLSearchParams(window.location.search);
    const forceShow = searchParams.get("splash") === "true";
    const hasSeen = sessionStorage.getItem("cm_has_seen_splash");

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if ((hasSeen && !forceShow) || prefersReducedMotion) {
      return;
    }

    setMounted(true);
    document.body.style.overflow = "hidden";

    // Fallback timer: ensure splash dismisses even if autoplay stalls
    const fallbackTimer = setTimeout(() => {
      dismissSplash();
    }, 4500);

    return () => {
      clearTimeout(fallbackTimer);
      document.body.style.overflow = "";
    };
  }, []);

  const dismissSplash = () => {
    setFading(true);
    sessionStorage.setItem("cm_has_seen_splash", "true");
    setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = "";
    }, 500);
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Animasi Pembuka CareerMatch AI"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Video Background / Center Display */}
      <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
        <video
          ref={videoRef}
          src="/splash-screen.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={dismissSplash}
          onError={dismissSplash}
          className="w-full h-full object-cover sm:object-contain max-h-screen"
        />

        {/* Skip Action Button */}
        <div className="absolute bottom-6 right-6 z-10">
          <button
            type="button"
            onClick={dismissSplash}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 backdrop-blur-md text-white text-xs font-semibold border border-white/20 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-h-[44px]"
            aria-label="Lewati animasi splash screen"
          >
            <span>Lewati</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

