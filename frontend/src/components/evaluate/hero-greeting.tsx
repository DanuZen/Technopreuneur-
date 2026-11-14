"use client";

import React from "react";
import Image from "next/image";

export function HeroGreeting() {
  return (
    <div className="flex flex-col items-center text-center w-full select-none">
      {/* Mascot Companion */}
      <div className="w-14 h-16 sm:w-16 sm:h-20 relative mb-1.5 drop-shadow-md animate-float">
        <Image
          src="/mascot/mascot-idea.webp"
          alt="Maskot Pendamping Evaluasi Pasbana AI"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Display Headline */}
      <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-primary leading-[1.18] max-w-2xl">
        Ukur. Temukan. <br className="hidden sm:inline" />
        <span className="text-secondary">Wujudkan Karir Impian.</span>
      </h1>

      {/* Subtitle */}
      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-slate-600 leading-normal max-w-xl">
        Platform evaluasi CV 5 dimensi dan pencocokan lowongan kerja cerdas untuk fresh graduate dan talenta muda berbasis filosofi pas bana.
      </p>
    </div>
  );
}

