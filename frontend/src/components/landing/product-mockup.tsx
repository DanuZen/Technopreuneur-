"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, FileText, Briefcase, Target, Shield, Sparkles } from "lucide-react";

export function ProductMockup() {
  const [activeTab, setActiveTab] = useState<"analysis" | "matching" | "skills">("analysis");

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
          Antarmuka Analisis &amp; Rekomendasi Presisi
        </h2>
        <p className="text-sm text-slate-600">
          Visualisasi real-time bagaimana Pasbana AI mengevaluasi resume Anda secara objektif dan memetakan lowongan kerja yang relevan.
        </p>
      </div>

      {/* Browser Window Frame with Minimal Margin & Hover Elevation */}
      <div className="rounded-3xl bg-white shadow-2xl shadow-primary/10 hover:shadow-primary/20 transition-all duration-500 overflow-hidden max-w-6xl mx-auto">
        {/* Browser Top Bar in Brand Navy */}
        <div className="bg-[#0f2c56] px-5 py-3.5 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ce2731] inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-sm" />
            <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-sm" />
            <span className="text-xs font-mono text-slate-300 ml-2 hidden sm:inline">
              pasbana.ai/dashboard/candidate
            </span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-[11px] font-medium text-white shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-beacon shrink-0" aria-hidden="true" />
            <span>Blind Scoring Aktif</span>
          </div>
        </div>

        {/* Dashboard Content Container */}
        <div className="p-5 sm:p-8 space-y-6 bg-gradient-to-br from-slate-50/70 via-blue-50/30 to-white">
          {/* Sub-nav inside dashboard */}
          <div className="flex items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("analysis")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs ${
                  activeTab === "analysis"
                    ? "bg-primary text-white"
                    : "text-primary hover:text-primary bg-white"
                }`}
              >
                Skor 5 Dimensi
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("matching")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs ${
                  activeTab === "matching"
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:text-primary bg-white"
                }`}
              >
                Rekomendasi Loker (92%)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("skills")}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shadow-xs ${
                  activeTab === "skills"
                    ? "bg-primary text-white"
                    : "text-slate-600 hover:text-primary bg-white"
                }`}
              >
                Analisis Gap Skill
              </button>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              ID Berkas: CV-2026-F09
            </span>
          </div>

          <div key={activeTab} className="animate-fade-in-up">
            {/* TAB 1: 5-DIMENSION ANALYSIS VIEW */}
            {activeTab === "analysis" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Radial / Score overview card */}
                <div className="bg-gradient-to-br from-[#0f2c56] via-[#163861] to-[#0f2c56] text-white p-5 rounded-2xl shadow-md flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-400/30 border-t-emerald-400 flex flex-col items-center justify-center shadow-inner">
                    <span className="text-2xl font-black text-white">88</span>
                    <span className="text-[9px] uppercase font-mono text-emerald-300 font-semibold">Skor ATS</span>
                  </div>
                  <div className="pt-2">
                    <span className="text-xs font-semibold text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full shadow-2xs">
                      Sangat Kompetitif
                    </span>
                    <p className="text-[11px] text-slate-200 mt-1">
                      Format terstruktur dan siap lolos screening ATS industri.
                    </p>
                  </div>
                </div>

                {/* Dimension breakdown bars */}
                <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-primary">
                    <span>Distribusi Kualitas 5 Dimensi</span>
                    <span className="text-[11px] text-slate-400 font-normal">Standar HR &amp; Recruiter</span>
                  </div>

                  <div className="space-y-2.5">
                    <MockupBar label="Struktur & Format ATS" score={94} color="bg-primary" />
                    <MockupBar label="Kejelasan Deskripsi Karir" score={85} color="bg-sky-500" />
                    <MockupBar label="Pencapaian Terukur (Action Verbs)" score={82} color="bg-emerald-500" />
                    <MockupBar label="Relevansi Skill Teknis" score={90} color="bg-[#ce2731]" />
                    <MockupBar label="Kelengkapan Informasi Kontak &amp; Edu" score={89} color="bg-amber-500" />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: MATCHING SAMPLE VIEW */}
            {activeTab === "matching" && (
              <div className="bg-white p-5 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">Junior Frontend Engineer</h3>
                      <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-mono font-medium shadow-2xs">
                        Pencocokan Dua Tahap
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">PT Solusi Teknologi Nusantara · Jakarta (Hybrid)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-600">92%</span>
                    <p className="text-[10px] text-slate-400 uppercase font-mono">Tingkat Kecocokan</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl shadow-xs text-xs text-slate-600 space-y-1">
                  <p className="font-semibold text-slate-800">Alasan Kesesuaian AI:</p>
                  <p>
                    Pengalaman Anda dalam proyek web Next.js dan Tailwind CSS memenuhi 4 dari 5 kualifikasi utama lowongan ini.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <span className="text-[11px] font-medium text-slate-500">Skill Cocok:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 shadow-2xs text-[11px]">React / Next.js</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 shadow-2xs text-[11px]">TypeScript</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 shadow-2xs text-[11px]">Tailwind CSS</span>
                </div>
              </div>
            )}

            {/* TAB 3: SKILLS GAP ANALYSIS */}
            {activeTab === "skills" && (
              <div className="bg-white p-5 rounded-2xl shadow-sm space-y-3">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider font-mono">
                  Identifikasi Kesenjangan Keahlian (Skills Gap)
                </h3>
                <p className="text-xs text-slate-600">
                  AI mendeteksi beberapa keahlian yang sering dicari oleh perusahaan di bidang impian Anda tetapi belum tertera di CV:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-xl bg-amber-50/70 shadow-xs space-y-1">
                    <span className="text-xs font-bold text-amber-900">State Management (Zustand / Redux)</span>
                    <p className="text-[11px] text-amber-800">
                      Sangat dianjurkan untuk ditambahkan jika pernah menggunakannya pada proyek akhir kuliah.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50/70 shadow-xs space-y-1">
                    <span className="text-xs font-bold text-blue-900">Unit Testing (Jest / Vitest)</span>
                    <p className="text-[11px] text-blue-800">
                      Nilai tambah penting untuk posisi developer entry-level modern.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MockupBar({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="font-mono font-bold text-slate-900">{score}%</span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}

