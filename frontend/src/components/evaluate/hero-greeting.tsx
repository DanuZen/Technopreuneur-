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
      {/* Brand Logo Avatar / Badge (Compact) */}
      <div className="mb-2 sm:mb-2.5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#0f2c56] via-[#163861] to-[#0f2c56] p-2 shadow-lg shadow-primary/20 border border-white/20 flex items-center justify-center transition-transform hover:scale-105 duration-200">
          <Image
            src="/logo-app-white.webp"
            alt="Pasbana AI"
            width={34}
            height={34}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Speech Bubble Pill with Upward Pointer Tail (Compact) */}
      <div className="relative mb-2 sm:mb-2.5">
        <div className="relative inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-primary shadow-xs border border-blue-200">
          {/* Bubble chat pointer tail pointing up to logo avatar */}
          <div
            aria-hidden="true"
            className="absolute -top-1 left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-white border-t border-l border-blue-200"
          />
          <span className="relative z-10 flex items-center gap-1.5">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"
              aria-hidden="true"
            />
            <span className="tracking-tight text-[11px] sm:text-xs">
              Halo, <span className="font-bold text-secondary">{userName}</span>
            </span>
          </span>
        </div>
      </div>

      {/* Display Headline (Compact & Crisp) */}
      <h1 className="font-heading text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-primary leading-[1.2] max-w-2xl">
        Ukur. Temukan. <br className="hidden sm:inline" />
        <span className="text-secondary">Wujudkan Karir Impian.</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-1 sm:mt-1.5 text-xs text-slate-600 leading-normal max-w-lg hidden sm:block">
        Platform evaluasi CV 5 dimensi dan pencocokan lowongan kerja cerdas untuk fresh graduate berbasis filosofi pas bana.
      </p>
    </div>
  );
}

