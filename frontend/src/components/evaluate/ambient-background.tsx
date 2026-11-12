"use client";

import React from "react";

export function AmbientBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none"
    >
      <div className="absolute inset-0 opacity-45">
        <svg
          className="h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <defs>
            <radialGradient id="eval-gradien-kiri" cx="15%" cy="25%" r="55%">
              <stop offset="0%" stopColor="#0f2c56" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0f2c56" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="eval-gradien-kanan" cx="85%" cy="30%" r="55%">
              <stop offset="0%" stopColor="#ce2731" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#ce2731" stopOpacity="0" />
            </radialGradient>
            <pattern
              id="eval-pola-titik"
              x="0"
              y="0"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.2" fill="#0f2c56" fillOpacity="0.08" />
            </pattern>
          </defs>

          {/* Grid pattern */}
          <rect width="100%" height="100%" fill="url(#eval-pola-titik)" />

          {/* Ambient radial gradients */}
          <rect width="100%" height="100%" fill="url(#eval-gradien-kiri)" />
          <rect width="100%" height="100%" fill="url(#eval-gradien-kanan)" />

          {/* Semantic dashed curves representing ATS parsing & AI matching */}
          <path
            d="M 60 200 Q 220 160 300 250 T 480 230"
            stroke="#0f2c56"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeOpacity="0.16"
          />
          <path
            d="M 1150 140 Q 1280 210 1420 180 T 1600 290"
            stroke="#ce2731"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            strokeOpacity="0.18"
          />
          <path
            d="M 120 720 Q 240 640 360 700"
            stroke="#0f2c56"
            strokeWidth="1.2"
            strokeDasharray="3 5"
            strokeOpacity="0.12"
          />
          <path
            d="M 1180 680 Q 1320 760 1460 710"
            stroke="#ce2731"
            strokeWidth="1.2"
            strokeDasharray="3 5"
            strokeOpacity="0.14"
          />

          {/* Node cluster dots */}
          <circle cx="60" cy="200" r="4" fill="#0f2c56" fillOpacity="0.25" />
          <circle cx="300" cy="250" r="3.5" fill="#ce2731" fillOpacity="0.3" />
          <circle cx="480" cy="230" r="4.5" fill="#0f2c56" fillOpacity="0.2" />
          <circle cx="1150" cy="140" r="4" fill="#ce2731" fillOpacity="0.3" />
          <circle cx="1420" cy="180" r="3" fill="#0f2c56" fillOpacity="0.25" />
          <circle cx="1600" cy="290" r="5" fill="#ce2731" fillOpacity="0.25" />
        </svg>
      </div>
    </div>
  );
}

