import Link from "next/link";
import { ArrowRight, FileSpreadsheet, CheckCircle2, Sparkles, Shield, Compass } from "lucide-react";
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
        <div className="space-y-5 max-w-4xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span>Platform Evaluasi CV &amp; Bimbingan Karir Cerdas</span>
          </div>

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
            className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-[#163861] text-white text-sm font-semibold rounded-full shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2 min-h-[46px] group"
          >
            <span>Evaluasi CV Saya</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
          </Link>

          <Link
            href="/evaluate?tab=questionnaire"
            className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-primary border border-slate-200 text-sm font-semibold rounded-full shadow-sm transition-all flex items-center justify-center gap-2 min-h-[46px]"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#ce2731]" aria-hidden="true" />
            <span>Saya Belum Punya CV</span>
          </Link>
        </div>

        {/* TRUST HIGHLIGHT BADGES */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span className="font-medium">Format ATS Terverifikasi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span className="font-medium">Analisis 5 Dimensi Objektif</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span className="font-medium">Privasi Kepatuhan UU PDP</span>
          </div>
        </div>

        {/* ECOSYSTEM / TECH BADGES (Truthful technical replacement for fake logos) */}
        <div className="pt-8 border-t border-slate-100 max-w-4xl mx-auto">
          <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3">
            Infrastruktur Berbasis Ekosistem Terbuka &amp; Kepatuhan Hukum
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 font-mono text-[11px] transition-colors">
              Next.js 14 App Router
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 font-mono text-[11px] transition-colors">
              FastAPI AI Service
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 font-mono text-[11px] transition-colors">
              PostgreSQL pgvector
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 font-mono text-[11px] transition-colors">
              Jooble Publisher API
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 font-mono text-[11px] transition-colors">
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
