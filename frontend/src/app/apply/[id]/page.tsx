"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Briefcase, Building2, MapPin, FileCheck, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { CVAnalysisResult, JobItem } from "@/types";

interface ApplyPageProps {
  params: {
    id: string;
  };
}

const SAMPLE_JOBS: Record<string, JobItem> = {
  "job-1": {
    id: "job-1",
    title: "Junior Frontend Developer",
    companyName: "PT Teknologi Berdaya Nusantara",
    location: "Jakarta (Hybrid)",
    workType: "full-time",
    salaryRange: "Rp 6.000.000 - Rp 9.000.000",
    source: "internal",
    description: "Kami mencari fresh graduate atau talenta muda dengan kemahiran React, TypeScript, dan Tailwind CSS untuk bergabung dengan tim produk web kami.",
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
    description: "Program magang intensif 6 bulan untuk mahasiswa tingkat akhir / fresh graduate yang ingin mengasah kemampuan arsitektur UI dan implementasi desain Figma.",
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
    description: "Tanggung jawab mencakup pengembangan API RESTful menggunakan Node.js Express atau Python FastAPI serta integrasi database PostgreSQL.",
    requiredSkills: ["Node.js", "Express", "PostgreSQL", "REST API"],
    postedAt: "2026-11-09",
    matchScore: 78,
  },
};

export default function ApplyJobPage({ params }: ApplyPageProps) {
  const router = useRouter();
  const [job, setJob] = useState<JobItem | null>(null);
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Cari job berdasarkan id
    const found = SAMPLE_JOBS[params.id] || {
      id: params.id,
      title: "Posisi Rekrutmen Terbuka",
      companyName: "Mitra Industri Pasbana",
      location: "Indonesia",
      workType: "full-time",
      source: "internal",
      description: "Lamaran cepat melalui sistem evaluasi profil dan berkas CV Pasbana AI.",
      requiredSkills: ["Kompetensi Terkait"],
      postedAt: "2026-11-12",
    };
    setJob(found);

    const currentAnalysis = api.getCurrentAnalysis();
    if (currentAnalysis) {
      setAnalysis(currentAnalysis);
      setApplicantName(currentAnalysis.profile?.fullName || "");
      setApplicantEmail(currentAnalysis.profile?.contactEmail || "");
    }
  }, [params.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  if (!job) {
    return null;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8 sm:px-6 space-y-6 animate-fade-in-up">
      {/* Top Navigation */}
      <div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Kembali ke Daftar Lowongan</span>
        </Link>
      </div>

      {/* Job Summary Banner */}
      <section className="p-6 rounded-3xl bg-gradient-to-br from-blue-50/90 via-white to-slate-50 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary">
              Lamaran Cepat: {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <Building2 className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
                {job.companyName}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                {job.location}
              </span>
              <span className="capitalize px-2 py-0.5 rounded-full bg-blue-100 text-primary text-[10px] font-mono font-bold">
                {job.workType}
              </span>
            </div>
          </div>

          {job.matchScore && (
            <div className="text-left sm:text-right">
              <span className="text-xl font-black text-emerald-600">{job.matchScore}%</span>
              <p className="text-[10px] uppercase font-mono text-slate-400">Kesesuaian AI</p>
            </div>
          )}
        </div>
      </section>

      {/* Main Content / Form */}
      {isSubmitted ? (
        <section className="bg-white p-8 rounded-3xl clay-card shadow-xl text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
          </div>
          <h2 className="text-xl font-bold text-primary">Lamaran Anda Berhasil Terkirim</h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            Data profil terstruktur dan ringkasan kualifikasi ATS Anda telah diteruskan ke tim rekruter {job.companyName}.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/jobs"
              className="px-6 py-2.5 bg-primary text-white text-xs font-semibold rounded-full shadow-sm hover:bg-[#163861] transition"
            >
              Cari Lowongan Lain
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full hover:bg-slate-200 transition"
            >
              Lihat Dashboard Profil
            </Link>
          </div>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl clay-card shadow-xl space-y-5">
          {analysis ? (
            <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-950 flex items-start gap-3 shadow-xs">
              <FileCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs space-y-0.5">
                <p className="font-bold">Resume Digital ATS Terverifikasi</p>
                <p className="text-slate-600">
                  Profil evaluasi Skor ATS ({analysis.overallScore}/100) akan dilampirkan otomatis ke rekruter.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-blue-50 text-primary flex items-start gap-3 shadow-xs">
              <Briefcase className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <div className="text-xs space-y-1">
                <p className="font-bold">Optimalkan Peluang Anda</p>
                <p className="text-slate-600">
                  Anda belum mengevaluasi CV di sesi ini. Anda tetap dapat melamar, atau lakukan evaluasi CV terlebih dahulu.
                </p>
                <Link href="/evaluate" className="text-secondary font-bold hover:underline inline-block">
                  Evaluasi CV Sekarang
                </Link>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="apply-name" className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Nama Lengkap Pelamar
            </label>
            <input
              id="apply-name"
              type="text"
              required
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
              placeholder="Contoh: Wira Fikri Ramadanu"
              className="w-full px-3.5 py-2.5 text-sm bg-[#edf2f9] rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="apply-email" className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Alamat Email Aktif
            </label>
            <input
              id="apply-email"
              type="email"
              required
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-3.5 py-2.5 text-sm bg-[#edf2f9] rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="apply-notes" className="block text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Catatan Pengantar Singkat (Opsional)
            </label>
            <textarea
              id="apply-notes"
              rows={3}
              value={coverNote}
              onChange={(e) => setCoverNote(e.target.value)}
              placeholder="Jelaskan secara ringkas motivasi atau proyek terkait yang relevan dengan posisi ini..."
              className="w-full px-3.5 py-2.5 text-sm bg-[#edf2f9] rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-primary hover:bg-[#163861] text-white font-semibold text-sm rounded-full shadow-md shadow-primary/25 transition flex items-center justify-center gap-2 min-h-[44px] disabled:opacity-60 cursor-pointer"
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

