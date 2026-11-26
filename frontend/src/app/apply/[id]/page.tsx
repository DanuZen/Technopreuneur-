"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Briefcase,
  Building2,
  MapPin,
  FileCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";
import { CVAnalysisResult, JobItem } from "@/types";

const SAMPLE_JOBS: Record<string, JobItem> = {
  "job-1": {
    id: "job-1",
    title: "Junior Frontend Developer",
    companyName: "PT Teknologi Berdaya Nusantara",
    location: "Jakarta (Hybrid)",
    workType: "full-time",
    salaryRange: "Rp 6.000.000 - Rp 9.000.000",
    source: "internal",
    description:
      "Kami mencari fresh graduate atau talenta muda dengan kemahiran React, TypeScript, dan Tailwind CSS untuk bergabung dengan tim produk web kami.",
    requiredSkills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Git"],
    postedAt: "2026-11-10",
    matchScore: 92,
  },
  "job-2": {
    id: "job-2",
    title: "Web UI Engineer Intern",
    companyName: "PT Solusi Kreasi Bangsa",
    location: "Bandung (Remote)",
    workType: "internship",
    salaryRange: "Rp 3.500.000 (Uang Saku)",
    source: "internal",
    description:
      "Program magang intensif 6 bulan untuk mahasiswa tingkat akhir / fresh graduate yang ingin mengasah kemampuan arsitektur UI dan implementasi desain Figma.",
    requiredSkills: ["HTML/CSS", "JavaScript", "Figma to Code", "Responsive Layout"],
    postedAt: "2026-11-08",
    matchScore: 85,
  },
  "job-3": {
    id: "job-3",
    title: "Junior Backend Developer",
    companyName: "PT Data Presisi Solusindo",
    location: "Surabaya",
    workType: "full-time",
    salaryRange: "Rp 6.500.000 - Rp 9.500.000",
    source: "jooble",
    description:
      "Tanggung jawab mencakup pengembangan API RESTful menggunakan Node.js Express atau Python FastAPI serta integrasi database PostgreSQL.",
    requiredSkills: ["Node.js", "Express", "PostgreSQL", "REST API"],
    postedAt: "2026-11-09",
    matchScore: 78,
  },
};

export default function ApplyJobPage() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id || "";

  const [job, setJob] = useState<JobItem | null>(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  useEffect(() => {
    const currentAnalysis = api.getCurrentAnalysis();
    if (currentAnalysis) {
      setAnalysis(currentAnalysis);
      setApplicantName(currentAnalysis.profile?.fullName || "");
      setApplicantEmail(currentAnalysis.profile?.contactEmail || "");
    } else if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("cm_user");
        if (storedUser) {
          const parsed = JSON.parse(storedUser) as { name?: string; email?: string };
          setApplicantName(parsed.name || "");
          setApplicantEmail(parsed.email || "");
        }
      } catch {
        // ignore
      }
    }

    const loadJob = async () => {
      try {
        const recommended = await api.getRecommendedJobs().catch(() => []);
        const foundRec = recommended.find((j) => j.id === jobId);
        if (foundRec) {
          setJob(foundRec);
          return;
        }
        const allJobs = await api.getJobs().catch(() => []);
        const foundAll = allJobs.find((j) => j.id === jobId);
        if (foundAll) {
          setJob(foundAll);
          return;
        }
      } finally {
        setLoadingJob(false);
      }

      setJob(
        SAMPLE_JOBS[jobId] || {
          id: jobId,
          title: "Posisi Rekrutmen Terbuka",
          companyName: "Mitra Industri Pasbana",
          location: "Indonesia",
          workType: "full-time",
          source: "internal",
          description:
            "Lamaran cepat melalui sistem evaluasi profil dan berkas CV Pasbana AI.",
          requiredSkills: ["Kompetensi Terkait"],
          postedAt: "2026-11-12",
        }
      );
    };

    loadJob();
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setSubmitError(null);
    setNeedsLogin(false);
    setIsSubmitting(true);

    try {
      await api.applyJob(job.id, coverNote.trim() || undefined);
      setIsSubmitted(true);
    } catch (err) {
      const status = (err as Error & { status?: number })?.status;
      if (status === 401 || status === 403) {
        setNeedsLogin(true);
        setSubmitError(
          "Silakan masuk menggunakan akun Pencari Kerja terlebih dahulu untuk mengirim lamaran resmi."
        );
      } else if (status && status >= 400 && status < 500) {
        setSubmitError(
          err instanceof Error ? err.message : "Gagal mengirim lamaran."
        );
      } else {
        setSubmitError(
          "Layanan backend tidak terjangkau. Pastikan Anda sudah masuk dan server aktif."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingJob || !job) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-12 sm:px-6 flex items-center justify-center gap-2 text-sm font-bold text-[#0f2c56]">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Memuat detail lowongan...</span>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 space-y-6 animate-fade-in-up">
      {/* Top Navigation */}
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/user/dashboard/lowongan"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f2c56] hover:text-[#ce2731] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Kembali ke Lowongan Cocok</span>
        </Link>
        <Link
          href="/jobs"
          className="text-xs font-bold text-slate-500 hover:text-[#0f2c56] transition-colors"
        >
          Portal Semua Lowongan
        </Link>
      </div>

      {/* Job Summary Banner */}
      <section className="p-6 rounded-[24px] bg-[#0f2c56] text-white space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ce2731] text-white text-[10px] font-bold uppercase tracking-wider">
              Lamaran Cepat Pasbana AI
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
              <span className="flex items-center gap-1 font-semibold text-white">
                <Building2 className="w-3.5 h-3.5 text-white/80" aria-hidden="true" />
                {job.companyName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-white/80" aria-hidden="true" />
                {job.location}
              </span>
              <span className="capitalize px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[10px] font-mono font-bold">
                {job.workType}
              </span>
            </div>
          </div>

          {typeof job.matchScore === "number" && (
            <div className="px-4 py-2.5 rounded-2xl bg-white text-[#0f2c56] text-left sm:text-right shrink-0">
              <span className="text-xl font-black font-mono text-[#ce2731]">
                {job.matchScore}%
              </span>
              <p className="text-[10px] uppercase font-mono font-bold text-slate-500">
                Kesesuaian AI
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content / Form */}
      {isSubmitted ? (
        <section className="bg-white border border-slate-200 p-8 rounded-[24px] text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#0f2c56] text-white flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-extrabold text-[#0f2c56]">
            Lamaran Anda Berhasil Terkirim
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Data profil terstruktur dan ringkasan kualifikasi ATS Anda telah diteruskan ke panel Seleksi Kandidat {job.companyName} dalam mode blind screening.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/user/dashboard/lowongan"
              className="px-6 py-2.5 bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Kembali ke Lowongan Cocok
            </Link>
            <Link
              href="/jobs"
              className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0f2c56] text-xs font-bold rounded-xl transition-colors"
            >
              Cari Lowongan Lain
            </Link>
          </div>
        </section>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-slate-200 p-6 sm:p-8 rounded-[24px] space-y-5"
        >
          {analysis ? (
            <div className="p-3.5 rounded-2xl bg-[#edf2f9] text-[#0f2c56] flex items-start gap-3">
              <FileCheck className="w-5 h-5 text-[#0f2c56] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs space-y-0.5">
                <p className="font-extrabold">Resume Digital ATS Terverifikasi</p>
                <p className="text-slate-600">
                  Profil evaluasi Skor ATS ({analysis.overallScore}/100) akan dilampirkan otomatis ke rekruter dalam format blind screening.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#edf2f9] text-[#0f2c56] flex items-start gap-3">
              <Briefcase className="w-5 h-5 text-[#ce2731] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs space-y-1">
                <p className="font-extrabold">Optimalkan Peluang Anda</p>
                <p className="text-slate-600">
                  Anda belum mengevaluasi CV di sesi ini. Anda tetap dapat melamar, atau lakukan evaluasi CV terlebih dahulu.
                </p>
                <Link
                  href="/user/dashboard/evaluasi"
                  className="text-[#ce2731] font-bold hover:underline inline-block"
                >
                  Evaluasi CV Sekarang
                </Link>
              </div>
            </div>
          )}

          {submitError && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-[#ce2731] text-xs font-bold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p>{submitError}</p>
                {needsLogin && (
                  <Link
                    href={`/login?next=/apply/${job.id}`}
                    className="inline-block px-3 py-1.5 rounded-lg bg-[#0f2c56] text-white text-[11px] font-bold"
                  >
                    Masuk ke Akun Pencari Kerja
                  </Link>
                )}
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="apply-name"
              className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5"
            >
              Nama Lengkap Pelamar
            </label>
            <input
              id="apply-name"
              type="text"
              required
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Contoh: Wira Fikri Ramadanu"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
            />
          </div>

          <div>
            <label
              htmlFor="apply-email"
              className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5"
            >
              Alamat Email Aktif
            </label>
            <input
              id="apply-email"
              type="email"
              required
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
            />
          </div>

          <div>
            <label
              htmlFor="apply-notes"
              className="block text-xs font-bold text-[#0f2c56] uppercase tracking-wider mb-1.5"
            >
              Catatan Pengantar Singkat (Opsional)
            </label>
            <textarea
              id="apply-notes"
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Jelaskan secara ringkas motivasi atau proyek terkait yang relevan dengan posisi ini..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-[#0f2c56] focus:outline-none focus:border-[#0f2c56] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-[#0f2c56] hover:bg-[#ce2731] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-60 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Mengirim Lamaran...</span>
              </>
            ) : (
              <span>Kirimkan Lamaran Cepat</span>
            )}
          </button>
        </form>
      )}
    </main>
  );
}
