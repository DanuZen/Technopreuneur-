"use client";

import React from "react";
import { GitCompare, BookOpenCheck, Target } from "lucide-react";

interface BentoFeatureCardsProps {
  onSelectFeature?: (target: "upload" | "wizard" | "matching") => void;
}

export function BentoFeatureCards({ onSelectFeature }: BentoFeatureCardsProps) {
  return (
    <section
      aria-label="Alur pemrosesan bertahap Pasbana AI"
      className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-4 w-full text-left"
    >
      {/* Block 1 (Col-span-7): Large Navy Block */}
      <button
        type="button"
        onClick={() => onSelectFeature?.("upload")}
        className="group md:col-span-7 w-full flex flex-col justify-between rounded-3xl bg-gradient-to-br from-[#0f2c56] via-[#14345f] to-[#0a1e3b] p-6 sm:p-8 text-white shadow-xl shadow-primary/20 hover:shadow-2xl transition-all duration-300 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white cursor-pointer"
      >
        <div className="flex items-center justify-between gap-3 w-full">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary text-white shadow-md shadow-secondary/30">
            <GitCompare className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-bold text-white font-mono">
            Tahap 1 • Fokus Berkas
          </span>
        </div>

        <div className="mt-8 space-y-3">
          <h2 className="font-heading text-lg sm:text-xl font-bold text-white">
            Ekstraksi Digital &amp; Blind Scoring Bebas Bias
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Memastikan layer teks digital resume terbaca sempurna oleh mesin ATS tanpa kendala tabel berlapis. Parameter foto, usia, dan gender disanitasi secara ketat demi objektivitas murni.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center rounded-full bg-white text-primary px-3.5 py-1.5 text-xs font-bold group-hover:bg-slate-100 transition-colors shadow-sm">
              <span>Mulai Unggah Berkas</span>
            </span>
          </div>
        </div>
      </button>

      {/* Stacked Blocks (Col-span-5): 2 Surface Cards */}
      <div className="md:col-span-5 flex flex-col gap-4">
        {/* Card 2: Tahap 2 */}
        <button
          type="button"
          onClick={() => onSelectFeature?.("wizard")}
          className="group flex flex-1 items-start gap-4 rounded-3xl bg-gradient-to-br from-blue-50/90 via-white to-indigo-50/40 p-5 text-left shadow-sm hover:shadow-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer w-full"
        >
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/25">
            <BookOpenCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <span className="inline-block rounded-md bg-blue-100 text-primary px-2.5 py-0.5 text-[11px] font-bold font-mono">
              Tahap 2 • Analisis 5 Dimensi
            </span>
            <h2 className="font-heading text-sm sm:text-base font-bold text-primary">
              Struktur, Kejelasan &amp; Dampak Terukur
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mengevaluasi penggunaan kata kerja aktif (action verbs) dan mengukur bobot kesiapan kerja secara instan.
            </p>
          </div>
        </button>

        {/* Card 3: Tahap 3 */}
        <button
          type="button"
          onClick={() => onSelectFeature?.("matching")}
          className="group flex flex-1 items-start gap-4 rounded-3xl bg-gradient-to-br from-rose-50/90 via-white to-red-50/40 p-5 text-left shadow-sm hover:shadow-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary cursor-pointer w-full"
        >
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-secondary text-white shadow-md shadow-secondary/25">
            <Target className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <span className="inline-block rounded-md bg-rose-100 text-secondary px-2.5 py-0.5 text-[11px] font-bold font-mono">
              Tahap 3 • Pencocokan Pas Bana
            </span>
            <h2 className="font-heading text-sm sm:text-base font-bold text-secondary">
              Pencocokan Presisi Dua Tahap
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Kueri kemiripan kosinus pgvector dilanjutkan evaluasi kualifikasi LLM untuk mendeteksi gap keahlian.
            </p>
          </div>
        </button>
      </div>
    </section>
  );
}

