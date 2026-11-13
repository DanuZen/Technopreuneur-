"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  Briefcase,
  Target,
  RotateCcw,
  Printer,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Building2,
  MapPin,
  Clock,
  Layers,
  ArrowRight,
  UploadCloud,
  FileSpreadsheet,
} from "lucide-react";
import { api } from "@/lib/api";
import { CVAnalysisResult, JobItem } from "@/types";
import { AtsOnboardingWizard } from "@/components/dashboard/ats-onboarding-wizard";
import { AtsCvPreview } from "@/components/dashboard/ats-cv-preview";
import { CVDropzone } from "@/components/cv/cv-dropzone";
import { AmbientBackground } from "@/components/evaluate/ambient-background";
import { HeroGreeting } from "@/components/evaluate/hero-greeting";
import { QuickScenarioChips } from "@/components/evaluate/quick-scenario-chips";

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingMode, setOnboardingMode] = useState<"wizard" | "dropzone">("wizard");
  const [activeTab, setActiveTab] = useState<"dimensions" | "preview" | "jobs" | "upload">("dimensions");
  const [jobs, setJobs] = useState<JobItem[]>([]);

  useEffect(() => {
    const queryOnboarding = searchParams.get("onboarding") === "true";
    const current = api.getCurrentAnalysis();

    if (current) {
      setAnalysis(current);
      if (queryOnboarding) {
        router.replace("/evaluate?tab=questionnaire");
        return;
      }
      setIsOnboarding(false);
    } else {
      // Belum ada CV terunggah/dianalisis: otomatis arahkan ke rute evaluasi yang benar (/evaluate)
      router.replace("/evaluate");
      return;
    }

    // Load initial jobs
    api
      .getJobs()
      .then((data) => {
        if (data && data.length > 0) {
          setJobs(data);
        } else {
          setJobs(DEFAULT_RECOMMENDED_JOBS);
        }
      })
      .catch(() => {
        setJobs(DEFAULT_RECOMMENDED_JOBS);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams]);

  const handleOnboardingComplete = (result: CVAnalysisResult) => {
    api.saveAnalysis(result);
    setAnalysis(result);
    setIsOnboarding(false);
    setActiveTab("dimensions");
    router.replace("/dashboard");
  };

  const handleDropzoneComplete = (result: CVAnalysisResult) => {
    api.saveAnalysis(result);
    setAnalysis(result);
    setIsOnboarding(false);
    setActiveTab("dimensions");
    router.replace("/dashboard");
  };

  const handleResetToOnboarding = () => {
    setIsOnboarding(true);
    setOnboardingMode("wizard");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-600 font-medium font-mono">
          Memuat data analitik karir Anda...
        </p>
      </div>
    );
  }

  // Tampilan 1: Mode Onboarding (Bagi pengguna yang belum punya CV atau memilih onboarding ATS)
  if (isOnboarding || !analysis) {
    return (
      <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
        <AmbientBackground />

        <main className="relative z-10 max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-10 pt-6 pb-16 space-y-8 animate-fade-in-up">
          {/* Top Bar Link */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-primary transition bg-white/90 hover:bg-white px-3.5 py-1.5 rounded-full shadow-xs"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" aria-hidden="true" />
              <span>Kembali ke Beranda</span>
            </Link>

            <div className="inline-flex items-center gap-1.5 text-xs text-primary font-bold bg-blue-100/70 px-3.5 py-1.5 rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Mode Onboarding ATS</span>
            </div>
          </div>

          {/* Hero Greeting Component */}
          <div className="max-w-3xl mx-auto">
            <HeroGreeting />
          </div>

          {/* Floating Stage Card */}
          <div className="max-w-4xl mx-auto w-full">
            <div className="rounded-[32px] sm:rounded-[36px] clay-card p-5 sm:p-9 space-y-6 shadow-xl">
              {/* Dual-Mode Selector Pills */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#edf2f9] rounded-full max-w-md mx-auto shadow-[inset_0_2px_4px_rgba(15,44,86,0.06)]">
                <button
                  type="button"
                  onClick={() => setOnboardingMode("wizard")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold transition-all duration-200 ${
                    onboardingMode === "wizard"
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "text-primary hover:text-secondary font-semibold"
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
                  <span>Isi Formulir Terpandu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOnboardingMode("dropzone")}
                  className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-full text-xs font-bold transition-all duration-200 ${
                    onboardingMode === "dropzone"
                      ? "bg-primary text-white shadow-md shadow-primary/25"
                      : "text-primary hover:text-secondary font-semibold"
                  }`}
                >
                  <UploadCloud className="w-4 h-4" aria-hidden="true" />
                  <span>Unggah Berkas PDF/DOCX</span>
                </button>
              </div>

              {/* Content Body */}
              <div key={onboardingMode} className="pt-1 animate-fade-in-up">
                {onboardingMode === "wizard" ? (
                  <AtsOnboardingWizard onComplete={handleOnboardingComplete} />
                ) : (
                  <div className="p-4 sm:p-6 bg-white rounded-3xl shadow-sm space-y-4">
                    <div className="text-center space-y-1">
                      <h3 className="text-base font-bold text-primary">
                        Unggah Berkas CV Anda
                      </h3>
                      <p className="text-xs text-slate-600">
                        Format didukung: PDF atau DOCX (maksimal 5 MB).
                      </p>
                    </div>
                    <CVDropzone
                      autoRedirect={false}
                      onAnalysisComplete={handleDropzoneComplete}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Quick Scenario Chips */}
            <QuickScenarioChips
              onPilihSampel={async () => {
                const demoFile = new File(
                  ["Contoh Dokumen Resume Standar ATS 1-Kolom Wira Fikri"],
                  "CV_Wira_Fikri_ATS_Standard.pdf",
                  { type: "application/pdf" }
                );
                const result = await api.uploadCV(demoFile);
                handleDropzoneComplete(result);
              }}
              onPilihWizard={() => setOnboardingMode("wizard")}
              onPilihInfoATS={() => setOnboardingMode("dropzone")}
            />
          </div>
        </main>
      </div>
    );
  }

  // Tampilan 2: Candidate Dashboard Utama (Setelah CV diunggah atau onboarding tuntas)
  const score = analysis.overallScore || 88;
  const isHighReady = score >= 85;

  return (
    <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8 animate-fade-in-up">
      {/* CANDIDATE HEADER HERO CARD */}
      <section className="bg-gradient-to-br from-[#0f2c56] via-[#163861] to-[#0a1e3b] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div
          className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Profile Identity Details */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-sm shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                Format ATS Terverifikasi
              </span>
              <span className="text-xs text-slate-300 font-mono bg-white/10 px-2.5 py-0.5 rounded-full shadow-2xs">
                ID Dokumen: {analysis.cvId}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {analysis.profile.fullName}
              </h1>
              <p className="text-sm sm:text-base font-semibold text-slate-200 mt-0.5">
                {analysis.profile.headline || "Kandidat Profesional Muda"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
              {analysis.profile.contactEmail && (
                <span>Email: {analysis.profile.contactEmail}</span>
              )}
              <span>Lokasi: Indonesia</span>
              <span>
                Pendidikan: {analysis.profile.education?.[0]?.degree || "S1"}{" "}
                {analysis.profile.education?.[0]?.field || "Teknologi"}
              </span>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3 print:hidden">
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-primary text-xs font-bold rounded-full shadow-md transition flex items-center gap-1.5 min-h-[38px]"
              >
                <FileText className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
                <span>Lihat Dokumen CV ATS</span>
              </button>

              <button
                type="button"
                onClick={handleResetToOnboarding}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-full backdrop-blur-sm transition flex items-center gap-1.5 min-h-[38px] shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-300" aria-hidden="true" />
                <span>Ubah Data Onboarding</span>
              </button>
            </div>
          </div>

          {/* ATS Overall Score Metric Box */}
          <div className="flex items-center gap-4 sm:gap-6 bg-white/10 backdrop-blur-md p-5 sm:p-6 rounded-2xl shadow-inner">
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/15 border-4 border-emerald-400 shadow-lg">
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {score}
                </span>
                <span className="block text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-1.5 max-w-[200px]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-300 font-semibold">
                Skor Kesiapan ATS
              </span>
              <p className="text-sm font-bold text-emerald-300">
                {isHighReady ? "Sangat Kompetitif" : "Cukup Siap Kerja"}
              </p>
              <p className="text-xs text-slate-200 leading-snug">
                {isHighReady
                  ? "Struktur berkas siap dipindai sistem parser lowongan kerja tanpa hambatan."
                  : "Terapkan rekomendasi optimasi untuk memaksimalkan peluang panggilan wawancara."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD TAB NAVIGATION BAR (Clay Pill Segment) */}
      <nav aria-label="Bagian Analisis Dashboard" className="bg-[#edf2f9] p-1.5 rounded-2xl print:hidden shadow-[inset_0_2px_4px_rgba(15,44,86,0.06)]">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("dimensions")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === "dimensions"
                ? "bg-white text-primary shadow-xs font-bold"
                : "text-slate-600 hover:text-primary font-semibold"
            }`}
          >
            <Target className="w-4 h-4" aria-hidden="true" />
            <span>Skor &amp; 5 Dimensi ATS</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === "preview"
                ? "bg-white text-primary shadow-xs font-bold"
                : "text-slate-600 hover:text-primary font-semibold"
            }`}
          >
            <FileText className="w-4 h-4" aria-hidden="true" />
            <span>Dokumen CV ATS (Pratinjau)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("jobs")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === "jobs"
                ? "bg-white text-primary shadow-xs font-bold"
                : "text-slate-600 hover:text-primary font-semibold"
            }`}
          >
            <Briefcase className="w-4 h-4" aria-hidden="true" />
            <span>Lowongan Kerja Cocok</span>
            <span className="text-[10px] font-mono bg-blue-100 text-primary px-1.5 py-0.5 rounded-full font-bold">
              {jobs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm transition-all flex items-center gap-2 ${
              activeTab === "upload"
                ? "bg-white text-primary shadow-xs font-bold"
                : "text-slate-600 hover:text-primary font-semibold"
            }`}
          >
            <UploadCloud className="w-4 h-4" aria-hidden="true" />
            <span>Uji Berkas CV Lain</span>
          </button>
        </div>
      </nav>

      {/* TAB CONTENT 1: SKOR & 5 DIMENSI */}
      {activeTab === "dimensions" && (
        <section className="space-y-8 animate-fade-in-up">
          {/* 5 DIMENSIONS GRID */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <h2 className="text-lg font-bold text-slate-900">
                Peringkat 5 Dimensi Kualitas Resume
              </h2>
              <span className="text-xs text-slate-500 font-mono">
                Evaluasi Otomatis Berbasis Algoritma Heuristik &amp; Standar Parsing ATS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Dimensi 1: Struktur ATS (Navy / Blue) */}
              <div className="p-4 bg-gradient-to-br from-blue-50/90 via-indigo-50/40 to-white rounded-2xl shadow-sm space-y-2">
                <span className="text-[11px] font-mono uppercase text-primary font-bold">
                  1. Struktur ATS
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-primary">
                    {analysis.dimensions.structure}
                  </span>
                  <span className="text-xs text-primary/70 font-semibold">/ 100</span>
                </div>
                <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${analysis.dimensions.structure}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-700 leading-tight">
                  Format 1-kolom bersih bebas tabel rumit dan teks kotak tak terbaca.
                </p>
              </div>

              {/* Dimensi 2: Kejelasan Bahasa (Sky / Cyan) */}
              <div className="p-4 bg-gradient-to-br from-sky-50/90 via-cyan-50/40 to-white rounded-2xl shadow-sm space-y-2">
                <span className="text-[11px] font-mono uppercase text-sky-800 font-bold">
                  2. Kejelasan Bahasa
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-sky-900">
                    {analysis.dimensions.clarity}
                  </span>
                  <span className="text-xs text-sky-700 font-semibold">/ 100</span>
                </div>
                <div className="w-full bg-sky-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-sky-600 h-full rounded-full"
                    style={{ width: `${analysis.dimensions.clarity}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-700 leading-tight">
                  Kalimat aksi langsung, lugas, dan bebas kesalahan ejaan mendasar.
                </p>
              </div>

              {/* Dimensi 3: Dampak Terukur (Emerald / Teal) */}
              <div className="p-4 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white rounded-2xl shadow-sm space-y-2">
                <span className="text-[11px] font-mono uppercase text-emerald-800 font-bold">
                  3. Dampak Terukur
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-emerald-950">
                    {analysis.dimensions.measurableImpact}
                  </span>
                  <span className="text-xs text-emerald-700 font-semibold">/ 100</span>
                </div>
                <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${analysis.dimensions.measurableImpact}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-700 leading-tight">
                  Kuantifikasi hasil capaian kerja dengan angka dan persentase nyata.
                </p>
              </div>

              {/* Dimensi 4: Relevansi Skill (Crimson / Rose) */}
              <div className="p-4 bg-gradient-to-br from-rose-50/90 via-red-50/40 to-white rounded-2xl shadow-sm space-y-2">
                <span className="text-[11px] font-mono uppercase text-secondary font-bold">
                  4. Relevansi Skill
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-secondary">
                    {analysis.dimensions.skillRelevance}
                  </span>
                  <span className="text-xs text-secondary/70 font-semibold">/ 100</span>
                </div>
                <div className="w-full bg-rose-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-secondary h-full rounded-full"
                    style={{ width: `${analysis.dimensions.skillRelevance}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-700 leading-tight">
                  Kesesuaian kata kunci teknis dengan kebutuhan rekrutmen terkini.
                </p>
              </div>

              {/* Dimensi 5: Kelengkapan Profil (Amber / Orange) */}
              <div className="p-4 bg-gradient-to-br from-amber-50/90 via-yellow-50/40 to-white rounded-2xl shadow-sm space-y-2">
                <span className="text-[11px] font-mono uppercase text-amber-800 font-bold">
                  5. Kelengkapan Profil
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-amber-950">
                    {analysis.dimensions.completeness}
                  </span>
                  <span className="text-xs text-amber-700 font-semibold">/ 100</span>
                </div>
                <div className="w-full bg-amber-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-600 h-full rounded-full"
                    style={{ width: `${analysis.dimensions.completeness}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-700 leading-tight">
                  Kelengkapan data kontak resmi, riwayat pendidikan, dan portofolio.
                </p>
              </div>
            </div>
          </div>

          {/* STRENGTHS & RECOMMENDATIONS TWO-COLUMN CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths (Emerald Tinted) */}
            <div className="p-6 bg-gradient-to-br from-emerald-50/90 via-teal-50/40 to-white rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" aria-hidden="true" />
                <h3 className="text-sm font-bold text-emerald-950">
                  Kekuatan Utama Dokumen CV Anda
                </h3>
              </div>

              <ul className="space-y-3">
                {analysis.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations for Improvement (Amber Tinted) */}
            <div className="p-6 bg-gradient-to-br from-amber-50/90 via-orange-50/40 to-white rounded-3xl shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600" aria-hidden="true" />
                <h3 className="text-sm font-bold text-amber-950">
                  Peluang Optimasi &amp; Rekomendasi
                </h3>
              </div>

              <ul className="space-y-3">
                {analysis.recommendations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                    <ChevronRight className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* TAB CONTENT 2: DOKUMEN CV ATS PREVIEW */}
      {activeTab === "preview" && (
        <section className="space-y-4 animate-fade-in-up">
          <AtsCvPreview
            profile={analysis.profile}
            onEdit={handleResetToOnboarding}
          />
        </section>
      )}

      {/* TAB CONTENT 3: REKOMENDASI LOWONGAN COCOK */}
      {activeTab === "jobs" && (
        <section className="space-y-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Rekomendasi Lowongan Sesuai Profil
              </h2>
              <p className="text-xs text-slate-600">
                Pencocokan berbasis vektor keahlian teknis dan preferensi posisi yang Anda cantumkan.
              </p>
            </div>

            <Link
              href="/jobs"
              className="text-xs font-semibold text-slate-900 hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>Jelajahi Semua Lowongan</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => {
              const userTechSkills = analysis.profile.skills.technical || [];
              const matchedCount = job.requiredSkills.filter((req) =>
                userTechSkills.some((userSkill) =>
                  userSkill.toLowerCase().includes(req.toLowerCase()) ||
                  req.toLowerCase().includes(userSkill.toLowerCase())
                )
              ).length;
              const matchPercent = Math.max(
                70,
                Math.round((matchedCount / Math.max(job.requiredSkills.length, 1)) * 100)
              );

              return (
                <div
                  key={job.id}
                  className="p-5 bg-white rounded-2xl shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 shadow-2xs font-semibold">
                        {matchPercent}% Cocok
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {job.workType}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {job.companyName}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>
                      {job.salaryRange && (
                        <span>{job.salaryRange}</span>
                      )}
                    </div>

                    {/* Skill Badges */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400">
                        Skill Lowongan:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {job.requiredSkills.map((req, i) => {
                          const isMatched = userTechSkills.some((u) =>
                            u.toLowerCase().includes(req.toLowerCase()) ||
                            req.toLowerCase().includes(u.toLowerCase())
                          );
                          return (
                            <span
                              key={i}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                                isMatched
                                  ? "bg-emerald-50 text-emerald-700 shadow-2xs font-semibold"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {req}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    {job.externalUrl ? (
                      <a
                        href={job.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center gap-1.5 min-h-[36px]"
                      >
                        <span>Lamar di Sumber Asli</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        href={`/jobs`}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition flex items-center justify-center min-h-[36px]"
                      >
                        <span>Kirim Lamaran Profil</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB CONTENT 4: UJI BERKAS CV LAIN */}
      {activeTab === "upload" && (
        <section className="max-w-2xl mx-auto space-y-4 animate-fade-in-up">
          <div className="p-6 bg-white rounded-3xl shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-base font-bold text-slate-900">
                Uji atau Ganti Berkas CV Anda
              </h2>
              <p className="text-xs text-slate-600">
                Unggah variasi berkas baru untuk membandingkan skor 5 dimensi secara instan tanpa menghapus riwayat sebelumnya.
              </p>
            </div>

            <CVDropzone
              autoRedirect={false}
              onAnalysisComplete={handleDropzoneComplete}
            />
          </div>
        </section>
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

const DEFAULT_RECOMMENDED_JOBS: JobItem[] = [
  {
    id: "rec-1",
    title: "Junior Frontend Developer",
    companyName: "PT Teknologi Berdaya Nusantara",
    location: "Jakarta (Hybrid)",
    workType: "full-time",
    salaryRange: "Rp 6.000.000 - Rp 9.000.000",
    source: "internal",
    description: "Mencari fresh graduate dengan kemahiran React, TypeScript, dan Tailwind CSS.",
    requiredSkills: ["React", "TypeScript", "Tailwind CSS", "Git"],
    postedAt: "2026-11-10",
  },
  {
    id: "rec-2",
    title: "Web UI Engineer Intern",
    companyName: "PT Solusi Kreasi Bangsa",
    location: "Bandung (Remote)",
    workType: "internship",
    salaryRange: "Rp 3.500.000 (Uang Saku)",
    source: "internal",
    description: "Program magang intensif pengembangan antarmuka web modern dengan Next.js.",
    requiredSkills: ["React", "HTML/CSS", "JavaScript", "Responsive Layout"],
    postedAt: "2026-11-08",
  },
  {
    id: "rec-3",
    title: "Junior Web Developer",
    companyName: "PT Data Presisi Solusindo",
    location: "Surabaya",
    workType: "full-time",
    salaryRange: "Rp 6.500.000 - Rp 9.500.000",
    source: "jooble",
    externalUrl: "https://id.jooble.org",
    description: "Integrasi antarmuka web dengan REST API dan PostgreSQL.",
    requiredSkills: ["TypeScript", "Next.js", "REST API", "Git"],
    postedAt: "2026-11-09",
  },
];
