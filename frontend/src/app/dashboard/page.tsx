"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  FileText,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  MapPin,
  ArrowLeft,
  UploadCloud,
  FileSpreadsheet,
  AlertTriangle,
  Layers,
  TrendingUp,
  Wrench,
  BookOpen,
  Award,
  ArrowUpRight,
} from "lucide-react";
import { api } from "@/lib/api";
import { CVAnalysisResult, JobItem } from "@/types";
import { AtsOnboardingWizard } from "@/components/dashboard/ats-onboarding-wizard";
import { AtsCvPreview } from "@/components/dashboard/ats-cv-preview";
import { CVDropzone } from "@/components/cv/cv-dropzone";

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
    const tabParam = searchParams.get("tab");
    const current = api.getCurrentAnalysis();

    if (queryOnboarding) {
      router.replace("/onboarding");
      return;
    }

    if (
      tabParam === "dimensions" ||
      tabParam === "preview" ||
      tabParam === "jobs" ||
      tabParam === "upload"
    ) {
      setActiveTab(tabParam);
    } else {
      setActiveTab("dimensions");
    }

    if (current) {
      setAnalysis(current);
    }
    setIsOnboarding(false);

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
  }, [searchParams, router]);

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
    router.push("/onboarding");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#0f2c56] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-[#0f2c56] font-bold font-mono">
          Memuat data analitik karir Anda...
        </p>
      </div>
    );
  }

  const handleLoadSampleAnalysis = async () => {
    setLoading(true);
    try {
      const demoFile = new File(
        ["Demo CV Wira Fikri ATS Standard"],
        "CV_Wira_Fikri_ATS_Standard.pdf",
        { type: "application/pdf" }
      );
      const result = await api.uploadCV(demoFile);
      api.saveAnalysis(result);
      setAnalysis(result);
    } finally {
      setLoading(false);
    }
  };

  // Tampilan 1: Mode Onboarding (Bagi pengguna yang mengubah data onboarding)
  if (isOnboarding) {
    return (
      <div className="min-h-full w-full px-4 sm:px-6 lg:px-8 py-6">
        <main className="max-w-5xl w-full mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsOnboarding(false)}
              className="inline-flex items-center gap-2 text-xs font-bold text-[#0f2c56] hover:text-white bg-white hover:bg-[#0f2c56] px-4 py-2 rounded-full border border-slate-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Kembali ke Dashboard</span>
            </button>

            <div className="inline-flex items-center gap-1.5 text-xs text-white font-bold bg-[#0f2c56] px-3.5 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#ce2731]" />
              <span>Mode Pembaruan Data ATS</span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ce2731]">
                  Pembaruan Profil
                </span>
                <h2 className="text-xl font-extrabold text-[#0f2c56]">
                  Perbarui Dokumen atau Kuesioner CV ATS
                </h2>
              </div>

              <div className="inline-flex p-1 bg-slate-100 border border-slate-200 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setOnboardingMode("wizard")}
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    onboardingMode === "wizard"
                      ? "bg-[#0f2c56] text-white"
                      : "text-slate-600 hover:text-[#0f2c56]"
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
                  <span>Isi Formulir Terpandu</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOnboardingMode("dropzone")}
                  className={`flex items-center gap-2 py-2 px-3.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    onboardingMode === "dropzone"
                      ? "bg-[#ce2731] text-white"
                      : "text-slate-600 hover:text-[#0f2c56]"
                  }`}
                >
                  <UploadCloud className="w-4 h-4" aria-hidden="true" />
                  <span>Unggah Berkas PDF/DOCX</span>
                </button>
              </div>
            </div>

            <div key={onboardingMode}>
              {onboardingMode === "wizard" ? (
                <AtsOnboardingWizard onComplete={handleOnboardingComplete} />
              ) : (
                <CVDropzone
                  autoRedirect={false}
                  onAnalysisComplete={handleDropzoneComplete}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!analysis) {
    const emptyTitle =
      activeTab === "preview"
        ? "Dokumen CV Standar ATS Belum Tersedia"
        : activeTab === "jobs"
        ? "Rekomendasi Lowongan Kerja"
        : "Belum Ada Hasil Evaluasi CV";

    const emptyDesc =
      activeTab === "preview"
        ? "Unggah CV Anda di halaman Evaluasi CV atau susun melalui Onboarding CV ATS untuk melihat pratinjau dokumen standar ATS."
        : activeTab === "jobs"
        ? "Unggah CV Anda terlebih dahulu agar sistem dapat menghitung persentase kecocokan keahlian dengan lowongan kerja di bawah ini."
        : "Unggah berkas CV Anda atau buat CV dari nol melalui kuesioner Onboarding untuk melihat skor ATS 5 dimensi.";

    return (
      <main className="min-h-full max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f2c56] text-white text-[11px] font-bold uppercase tracking-wider">
              {activeTab === "preview"
                ? "Dokumen CV ATS"
                : activeTab === "jobs"
                ? "Lowongan Cocok"
                : "Dashboard Skor ATS"}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f2c56] font-heading">
              {emptyTitle}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">{emptyDesc}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/evaluate"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#0f2c56] text-white text-xs font-bold transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Evaluasi CV</span>
            </Link>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-[#0f2c56] text-[#0f2c56] hover:text-white text-xs font-bold transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Onboarding CV ATS</span>
            </Link>
            <button
              type="button"
              onClick={handleLoadSampleAnalysis}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#0f2c56] text-[#0f2c56] hover:bg-[#0f2c56] hover:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Muat Sampel CV Demo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {activeTab === "jobs" && jobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#0f2c56] text-white font-bold">
                      Terbuka
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-md bg-slate-100 text-[#0f2c56] font-bold">
                      {job.workType}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#0f2c56] line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-semibold mt-0.5">
                      {job.companyName}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#ce2731]" />
                      {job.location}
                    </span>
                    {job.salaryRange && <span>{job.salaryRange}</span>}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {job.requiredSkills.map((req, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-600"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
                <Link
                  href={`/apply?jobId=${job.id}&title=${encodeURIComponent(job.title)}&company=${encodeURIComponent(job.companyName)}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors"
                >
                  <span>Lihat Detail & Lamar</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    );
  }

  // Tampilan 2: Candidate Dashboard Utama (100% Solid Colors)
  const score = analysis.overallScore || 88;
  const isHighReady = score >= 85;

  const dimensionCards = [
    {
      num: "01",
      title: "Struktur ATS",
      score: analysis.dimensions.structure,
      desc: "Format 1-kolom bersih bebas tabel rumit dan teks kotak tak terbaca.",
      icon: Layers,
    },
    {
      num: "02",
      title: "Kejelasan Bahasa",
      score: analysis.dimensions.clarity,
      desc: "Kalimat aksi langsung, lugas, dan bebas kesalahan ejaan mendasar.",
      icon: BookOpen,
    },
    {
      num: "03",
      title: "Dampak Terukur",
      score: analysis.dimensions.measurableImpact,
      desc: "Kuantifikasi hasil capaian kerja dengan angka dan persentase nyata.",
      icon: TrendingUp,
    },
    {
      num: "04",
      title: "Relevansi Skill",
      score: analysis.dimensions.skillRelevance,
      desc: "Kesesuaian kata kunci teknis dengan kebutuhan rekrutmen terkini.",
      icon: Wrench,
    },
    {
      num: "05",
      title: "Kelengkapan Profil",
      score: analysis.dimensions.completeness,
      desc: "Kelengkapan data kontak resmi, riwayat pendidikan, dan portofolio.",
      icon: Award,
    },
  ];

  return (
    <main className="min-h-full bg-[#f8fafc] max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* CANDIDATE HEADER HERO CARD (100% Solid Navy & Crimson) */}
      <section className="bg-[#0f2c56] text-white rounded-[28px] p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Profile Identity Details */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ce2731] text-white text-xs font-extrabold">
                <CheckCircle2 className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                Format ATS Terverifikasi
              </span>
              <span className="text-xs text-[#0f2c56] font-mono font-bold bg-white px-3 py-1 rounded-full">
                ID Dokumen: {analysis.cvId}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white font-heading">
                {analysis.profile.fullName}
              </h1>
              <p className="text-sm sm:text-base font-bold text-white/85 mt-1">
                {analysis.profile.headline || "Kandidat Profesional Muda"}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-white/80 font-medium">
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
                onClick={() => router.push("/dashboard?tab=preview")}
                className="px-5 py-2.5 bg-white hover:bg-[#ce2731] text-[#0f2c56] hover:text-white text-xs font-extrabold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Lihat Dokumen CV ATS</span>
              </button>

              <button
                type="button"
                onClick={handleResetToOnboarding}
                className="px-5 py-2.5 bg-[#ce2731] hover:bg-white text-white hover:text-[#0f2c56] text-xs font-extrabold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Ubah Data Onboarding</span>
              </button>
            </div>
          </div>

          {/* ATS Overall Score Metric Box (Solid White Card) */}
          <div className="lg:col-span-4 bg-white text-[#0f2c56] p-6 rounded-2xl flex items-center gap-5">
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border-[6px] border-[#0f2c56] shrink-0">
              <div className="text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#0f2c56] tracking-tight">
                  {score}
                </span>
                <span className="block text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                  / 100
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Skor Kesiapan ATS
              </span>
              <p className="text-sm font-extrabold text-white bg-[#ce2731] px-2.5 py-0.5 rounded-md inline-block">
                {isHighReady ? "Sangat Kompetitif" : "Cukup Siap Kerja"}
              </p>
              <p className="text-xs text-slate-600 leading-snug">
                {isHighReady
                  ? "Struktur berkas siap dipindai sistem parser lowongan kerja tanpa hambatan."
                  : "Terapkan rekomendasi optimasi untuk memaksimalkan peluang panggilan wawancara."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TAB CONTENT 1: SKOR & 5 DIMENSI */}
      {activeTab === "dimensions" && (
        <section className="space-y-6">
          {/* 5 DIMENSIONS GRID (Solid Navy & Crimson Hierarchy) */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-1">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ce2731]">
                  Rincian Penilaian
                </span>
                <h2 className="text-lg sm:text-xl font-extrabold text-[#0f2c56] font-heading">
                  Peringkat 5 Dimensi Kualitas Resume
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-semibold">
                Target optimal setiap dimensi: &ge; 80 / 100
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {dimensionCards.map((dim) => {
                const Icon = dim.icon;
                const isOptimal = dim.score >= 80;
                return (
                  <div
                    key={dim.num}
                    className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${
                            isOptimal ? "bg-[#0f2c56]" : "bg-[#ce2731]"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span
                          className={`px-2.5 py-0.5 rounded-lg text-xs font-black text-white ${
                            isOptimal ? "bg-[#0f2c56]" : "bg-[#ce2731]"
                          }`}
                        >
                          {dim.score}/100
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                          Dimensi {dim.num}
                        </span>
                        <h3 className="text-sm font-extrabold text-[#0f2c56]">
                          {dim.title}
                        </h3>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {dim.desc}
                      </p>
                    </div>

                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isOptimal ? "bg-[#0f2c56]" : "bg-[#ce2731]"
                        }`}
                        style={{ width: `${dim.score}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STRENGTHS & RECOMMENDATIONS TWO-COLUMN CARD (Solid White + Bold Brand Borders) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths (Solid Navy Border) */}
            <div className="p-6 bg-white border-2 border-[#0f2c56] rounded-2xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-[#0f2c56] text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0f2c56]">
                    Kekuatan Utama Dokumen CV Anda
                  </h3>
                  <p className="text-xs text-slate-500">
                    Elemen yang sudah memenuhi standar kurasi ATS
                  </p>
                </div>
              </div>

              <ul className="space-y-3">
                {analysis.strengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#0f2c56]">
                    <span className="w-5 h-5 rounded-md bg-[#0f2c56] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations for Improvement (Solid Crimson Border) */}
            <div className="p-6 bg-white border-2 border-[#ce2731] rounded-2xl space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                <div className="w-9 h-9 rounded-xl bg-[#ce2731] text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0f2c56]">
                    Peluang Optimasi &amp; Rekomendasi
                  </h3>
                  <p className="text-xs text-slate-500">
                    Langkah perbaikan prioritas untuk menaikkan skor kesiapan
                  </p>
                </div>
              </div>

              <ul className="space-y-3">
                {analysis.recommendations.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#0f2c56]">
                    <span className="w-5 h-5 rounded-md bg-[#ce2731] text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
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
        <section className="space-y-4">
          <AtsCvPreview
            profile={analysis.profile}
            onEdit={handleResetToOnboarding}
          />
        </section>
      )}

      {/* TAB CONTENT 3: REKOMENDASI LOWONGAN COCOK */}
      {activeTab === "jobs" && (
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-5 rounded-2xl border border-slate-200">
            <div>
              <h2 className="text-lg font-extrabold text-[#0f2c56]">
                Rekomendasi Lowongan Sesuai Profil
              </h2>
              <p className="text-xs text-slate-600">
                Pencocokan berbasis keahlian teknis dan preferensi posisi yang Anda cantumkan.
              </p>
            </div>

            <Link
              href="/jobs"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors self-start sm:self-auto"
            >
              <span>Jelajahi Semua Lowongan</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {jobs.map((job) => {
              const userTechSkills = analysis.profile.skills.technical || [];
              const matchedCount = job.requiredSkills.filter((req) =>
                userTechSkills.some(
                  (userSkill) =>
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
                  className="p-5 bg-white border border-slate-200 rounded-2xl flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#ce2731] text-white font-bold">
                        {matchPercent}% Cocok
                      </span>
                      <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-md bg-slate-100 text-[#0f2c56] font-bold">
                        {job.workType}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-[#0f2c56] line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        {job.companyName}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#ce2731]" />
                        {job.location}
                      </span>
                      {job.salaryRange && <span>{job.salaryRange}</span>}
                    </div>

                    {/* Skill Badges */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-mono uppercase text-slate-400 font-bold">
                        Skill Lowongan:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredSkills.map((req, i) => {
                          const isMatched = userTechSkills.some(
                            (u) =>
                              u.toLowerCase().includes(req.toLowerCase()) ||
                              req.toLowerCase().includes(u.toLowerCase())
                          );
                          return (
                            <span
                              key={i}
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                isMatched
                                  ? "bg-[#0f2c56] text-white"
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
                        className="w-full py-2.5 bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Lamar di Sumber Asli</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    ) : (
                      <Link
                        href="/jobs"
                        className="w-full py-2.5 bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Kirim Lamaran Profil</span>
                        <ChevronRight className="w-3.5 h-3.5" />
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
        <section className="max-w-3xl mx-auto">
          <div className="p-6 sm:p-8 bg-white border border-slate-200 rounded-2xl space-y-5">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ce2731]">
                Evaluasi Baru
              </span>
              <h2 className="text-lg font-extrabold text-[#0f2c56]">
                Uji atau Ganti Berkas CV Anda
              </h2>
              <p className="text-xs text-slate-600 mt-0.5">
                Unggah variasi berkas baru untuk membandingkan skor 5 dimensi secara instan.
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
          <div className="w-10 h-10 border-4 border-[#0f2c56] border-t-transparent rounded-full animate-spin" />
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
