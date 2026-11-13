import Link from "next/link";
import { FileSpreadsheet, CheckCircle2 } from "lucide-react";
import { ProductMockup } from "@/components/landing/product-mockup";
import { InteractiveWorkflow } from "@/components/landing/interactive-workflow";
import { PrinciplesGrid } from "@/components/landing/principles-grid";
import { FeaturesBento } from "@/components/landing/features-bento";
import { DarkCtaBanner } from "@/components/landing/dark-cta-banner";

export default function Home() {
  return (
    <div className="space-y-24 pb-20">
      {/* HERO SECTION (Focused purely on Landing Page & Value Proposition) */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-[1360px] mx-auto space-y-10 text-center">
        {/* Subtle animated background mesh matching reference */}
        <div
          className="absolute inset-0 -top-16 -z-10 mx-auto max-w-5xl h-[460px] opacity-40 blur-3xl pointer-events-none animate-hero-mesh"
          style={{
            background: "radial-gradient(circle at 50% 30%, rgba(15, 44, 86, 0.16) 0%, rgba(206, 39, 49, 0.08) 50%, transparent 80%)",
          }}
          aria-hidden="true"
        />

        {/* Hero Title & Subtitle */}
        <div className="space-y-4 max-w-4xl mx-auto animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary leading-[1.12]">
            Ukur. Temukan. <br className="hidden sm:inline" />
            <span className="text-[#ce2731]">Wujudkan Karir Impian.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Platform evaluasi CV objektif 5 dimensi dan pencocokan lowongan kerja cerdas untuk fresh graduate dan talenta muda berbasis AI dan standar industri ATS.
          </p>
        </div>

        {/* HERO CALL-TO-ACTION BUTTONS */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto animate-fade-in-up">
          <Link
            href="/evaluate"
            className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-[#163861] text-white text-sm font-semibold rounded-full shadow-lg shadow-primary/25 transition-all flex items-center justify-center min-h-[46px]"
          >
            <span>Evaluasi CV Saya</span>
          </Link>

          <Link
            href="/evaluate?tab=questionnaire"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-primary text-sm font-semibold rounded-full shadow-sm transition-all flex items-center justify-center gap-2 min-h-[46px]"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#ce2731]" aria-hidden="true" />
            <span>Saya Belum Punya CV</span>
          </Link>
        </div>

        {/* TRUST HIGHLIGHT BADGES */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700">
          <div className="flex items-center gap-2 bg-emerald-50/90 px-3.5 py-1.5 rounded-full shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span className="font-semibold text-emerald-900">Format ATS Terverifikasi</span>
          </div>
          <div className="flex items-center gap-2 bg-blue-50/90 px-3.5 py-1.5 rounded-full shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="font-semibold text-primary">Analisis 5 Dimensi Objektif</span>
          </div>
          <div className="flex items-center gap-2 bg-rose-50/90 px-3.5 py-1.5 rounded-full shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-secondary" aria-hidden="true" />
            <span className="font-semibold text-secondary">Privasi Kepatuhan UU PDP</span>
          </div>
        </div>

        {/* 3 HERO VALUE CARDS (Colorful Brand Pillars) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4 text-left">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0f2c56] to-[#163861] text-white shadow-lg flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-blue-200 font-bold">Pilar 1</span>
              <h3 className="text-sm font-bold text-white">Standar ATS 1-Kolom</h3>
              <p className="text-xs text-slate-200 leading-relaxed">
                Optimasi tata letak berkas digital agar 100% terbaca sistem filter recruiter.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-mono text-blue-200 flex items-center justify-between">
              <span>Akurasi Parsing</span>
              <span className="font-bold text-white">99.2%</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-[#ce2731] to-[#a31b23] text-white shadow-lg flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-rose-200 font-bold">Pilar 2</span>
              <h3 className="text-sm font-bold text-white">Pencocokan Pas Bana</h3>
              <p className="text-xs text-rose-100 leading-relaxed">
                Pencocokan semantik cerdas mempertemukan kompetensi Anda dengan lowongan yang paling cocok.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-mono text-rose-200 flex items-center justify-between">
              <span>Two-Stage Match</span>
              <span className="font-bold text-white">pgvector + LLM</span>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-800 text-white shadow-lg flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-200 font-bold">Pilar 3</span>
              <h3 className="text-sm font-bold text-white">100% Bebas Biaya</h3>
              <p className="text-xs text-emerald-100 leading-relaxed">
                Seluruh fitur evaluasi resume dan bimbingan karir dapat diakses gratis tanpa langganan.
              </p>
            </div>
            <div className="pt-3 text-[11px] font-mono text-emerald-200 flex items-center justify-between">
              <span>Arsitektur</span>
              <span className="font-bold text-white">Zero Budget (Rp 0)</span>
            </div>
          </div>
        </div>

        {/* ECOSYSTEM / TECH BADGES (Truthful technical replacement for fake logos) */}
        <div className="pt-8 max-w-4xl mx-auto">
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3 font-semibold">
            Infrastruktur Berbasis Ekosistem Terbuka &amp; Kepatuhan Hukum
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-700">
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50/90 hover:bg-blue-100/90 font-mono text-[11px] text-primary font-medium transition-colors shadow-2xs">
              Next.js 14 App Router
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-rose-50/90 hover:bg-rose-100/90 font-mono text-[11px] text-secondary font-medium transition-colors shadow-2xs">
              FastAPI AI Service
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-blue-50/90 hover:bg-blue-100/90 font-mono text-[11px] text-primary font-medium transition-colors shadow-2xs">
              PostgreSQL pgvector
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50/90 hover:bg-emerald-100/90 font-mono text-[11px] text-emerald-800 font-medium transition-colors shadow-2xs">
              Jooble Publisher API
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-amber-50/90 hover:bg-amber-100/90 font-mono text-[11px] text-amber-900 font-medium transition-colors shadow-2xs">
              UU PDP No. 27/2022
            </span>
          </div>
        </div>
      </section>

      {/* PRODUCT MOCKUP / APP PREVIEW (Matching "For building and beyond") */}
      <section className="px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
        <ProductMockup />
      </section>

      {/* INTERACTIVE WORKFLOW TABS (Matching "Every team gets smarter with X-Ai") */}
      <section className="px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
        <InteractiveWorkflow />
      </section>

      {/* 5-DIMENSIONS CRITERIA (Matching "Real Stories" slot) */}
      <section className="px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
        <PrinciplesGrid />
      </section>

      {/* ARCHITECTURE & ETHICS BENTO (Matching "Smarter Help for a Smoother Day") */}
      <section className="px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
        <FeaturesBento />
      </section>

      {/* PRE-FOOTER DARK ACCENT BANNER (Matching "Ready to Supercharge Your Productivity?") */}
      <section className="px-4 sm:px-6 lg:px-10 max-w-[1400px] mx-auto">
        <DarkCtaBanner />
      </section>
    </div>
  );
}
