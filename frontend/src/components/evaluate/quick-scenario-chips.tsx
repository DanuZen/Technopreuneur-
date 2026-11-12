"use client";

import React from "react";
import { FileCheck, Sparkles, ShieldCheck, FileSpreadsheet } from "lucide-react";

interface QuickScenarioChipsProps {
  onPilihSampel: () => void;
  onPilihWizard: () => void;
  onPilihInfoATS?: () => void;
  sedangMemproses?: boolean;
}

export function QuickScenarioChips({
  onPilihSampel,
  onPilihWizard,
  onPilihInfoATS,
  sedangMemproses = false,
}: QuickScenarioChipsProps) {
  return (
    <section
      aria-label="Pintasan pengujian skenario CV"
      className="mt-2.5 sm:mt-3 w-full"
    >
      <div className="flex flex-wrap items-center justify-center gap-2">
        {/* Chip 1: Primary Navy Solid button to test instant ATS CV */}
        <button
          type="button"
          disabled={sedangMemproses}
          onClick={onPilihSampel}
          className="inline-flex min-h-[36px] items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0f2c56] to-[#163861] text-white text-xs font-bold shadow-xs hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
          title="Uji langsung dengan berkas contoh resume standar ATS"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" aria-hidden="true" />
          <span>Uji Berkas Contoh ATS</span>
          <span className="px-1.5 py-0.5 rounded bg-white/20 text-white text-[9px] font-mono font-bold">
            Demo
          </span>
        </button>

        {/* Chip 2: Quick Wizard Switcher */}
        <button
          type="button"
          disabled={sedangMemproses}
          onClick={onPilihWizard}
          className="inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50/70 text-primary border border-blue-200/90 text-xs font-semibold shadow-2xs hover:border-primary hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-secondary shrink-0" aria-hidden="true" />
          <span>Kuesioner Terpandu</span>
          <span className="px-1.5 py-0.5 rounded bg-rose-50 text-secondary border border-rose-200 text-[9px] font-mono font-bold">
            Wizard
          </span>
        </button>

        {/* Chip 3: ATS Format Info */}
        <button
          type="button"
          disabled={sedangMemproses}
          onClick={onPilihInfoATS}
          className="inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium shadow-2xs hover:border-slate-300 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50"
        >
          <FileCheck className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
          <span>Format Ramah ATS</span>
        </button>

        {/* Chip 4: Privacy UU PDP */}
        <div className="inline-flex min-h-[36px] items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 text-slate-700 border border-slate-200 text-xs font-medium shadow-2xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>UU PDP 2022</span>
          <span className="px-1 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-mono font-semibold">
            Masking
          </span>
        </div>
      </div>
    </section>
  );
}

