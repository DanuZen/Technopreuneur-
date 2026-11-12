"use client";

import { useState, useEffect, useRef } from "react";

export function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Splash screen diputar setiap kali halaman dimuat ulang / masuk
    setMounted(true);
    document.body.style.overflow = "hidden";

    // Pastikan video mulai diputar
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Jika autoplay diblokir browser, segera alihkan ke halaman utama
        dismissSplash();
      });
    }

    // Safety fallback timer sesuai durasi video (~3.92s + toleransi)
    const fallbackTimer = setTimeout(() => {
      dismissSplash();
    }, 4200);

    return () => {
      clearTimeout(fallbackTimer);
      document.body.style.overflow = "";
    };
  }, []);

  const dismissSplash = () => {
    setFading(true);
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
      className={`fixed inset-0 w-screen h-screen z-[9999] overflow-hidden bg-black transition-opacity duration-500 ease-out select-none pointer-events-none ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src="/splash-screen.webm"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={dismissSplash}
        onError={dismissSplash}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/splash-screen.webm" type="video/webm" />
      </video>
    </div>
  );
}
