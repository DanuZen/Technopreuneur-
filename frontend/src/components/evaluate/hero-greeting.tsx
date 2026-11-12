"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export function HeroGreeting() {
  const [userName, setUserName] = useState<string>("Talenta Muda");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("cm_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.name) {
          setUserName(parsed.name);
        }
      }
    } catch {
      // ignore JSON parse error
    }
  }, []);

  return (
    <div className="flex flex-col items-center text-center w-full select-none">
      {/* Brand Logo Avatar / Badge */}
      <div className="mb-3.5 sm:mb-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#0f2c56] via-[#163861] to-[#0f2c56] p-2.5 shadow-xl shadow-primary/25 border-2 border-white/20 flex items-center justify-center transition-transform hover:scale-105 duration-300">
          <Image
            src="/logo-app-white.webp"
            alt="Pasbana AI"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Speech Bubble Pill with Upward Pointer Tail */}
      <div className="relative mb-3.5 sm:mb-4">
        <div className="relative inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-primary shadow-md border border-blue-200">
          {/* Bubble chat pointer tail pointing up to logo avatar */}
          <div
            aria-hidden="true"
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rotate-45 bg-white border-t border-l border-blue-200"
          />
          <span className="relative z-10 flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"
              aria-hidden="true"
            />
            <span className="tracking-tight">
              Halo, <span className="font-bold text-secondary">{userName}</span>
            </span>
          </span>
        </div>
      </div>

      {/* Big Display Headline */}
      <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-[1.15] max-w-3xl">
        Ukur. Temukan. <br />
        <span className="text-secondary">Wujudkan Karir Impian.</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-[64ch]">
        Platform evaluasi CV objektif 5 dimensi dan pencocokan lowongan kerja cerdas untuk fresh graduate dan talenta muda berbasis filosofi pas bana.
      </p>
    </div>
  );
}

