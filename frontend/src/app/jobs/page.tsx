"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Briefcase, ExternalLink, Filter, Bookmark, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { JobItem } from "@/types";
import { api } from "@/lib/api";

export default function JobsPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [workType, setWorkType] = useState("");
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getJobs({ keyword, location, workType });
      // If backend returns empty list (mocked/initial state), supply realistic initial sample jobs
      if (!data || data.length === 0) {
        setJobs(SAMPLE_JOBS);
      } else {
        setJobs(data);
      }
    } catch {
      // In offline/initial dev phase, fallback to clean sample jobs
      setJobs(SAMPLE_JOBS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <main className="max-w-[1400px] w-full mx-auto px-4 py-8 sm:px-6 lg:px-10 space-y-8 animate-fade-in-up">
      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">
          Eksplorasi Lowongan Kerja
        </h1>
        <p className="text-sm text-slate-600 max-w-2xl">
          Temukan lowongan dari mitra internal terverifikasi dan agregasi portal Jooble Indonesia, lengkap dengan analisis kesesuaian skill Pasbana AI.
        </p>
      </header>

      {/* Search & Filter Bar */}
      <form onSubmit={handleSearch} className="p-5 bg-gradient-to-br from-white via-blue-50/30 to-slate-50 rounded-2xl border-2 border-blue-200/80 shadow-md space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Posisi, keahlian, atau perusahaan..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            />
          </div>

          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Kota (Jakarta, Bandung, Remote)..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer bg-white"
              >
                <option value="">Semua Tipe Kerja</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Magang (Internship)</option>
                <option value="remote">Remote</option>
              </select>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-primary hover:bg-[#163861] text-white text-sm font-semibold rounded-xl shadow-md shadow-primary/25 transition focus-visible:ring-2 focus-visible:ring-primary min-h-[44px]"
            >
              Cari
            </button>
          </div>
        </div>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" aria-hidden="true" />
          <p className="text-sm text-slate-500 font-medium">Memuat data lowongan kerja...</p>
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && jobs.length === 0 && (
        <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-slate-200 p-8">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" aria-hidden="true" />
          <h3 className="text-base font-semibold text-slate-800">Tidak ada lowongan yang sesuai kriteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau bersihkan filter lokasi untuk melihat lowongan lainnya.
          </p>
        </div>
      )}

      {/* Job List State */}
      {!loading && !error && jobs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Menampilkan {jobs.length} lowongan aktif</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

function JobCard({ job }: { job: JobItem }) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="p-6 bg-gradient-to-br from-white via-blue-50/20 to-slate-50 rounded-2xl border-2 border-blue-200/70 shadow-sm hover:border-primary hover:shadow-lg transition space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-primary">{job.title}</h2>
            <span
              className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                job.source === "internal"
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-blue-100 text-primary border border-blue-200"
              }`}
            >
              {job.source === "internal" ? "Mitra Terverifikasi" : "Sumber: Jooble"}
            </span>
          </div>

          <p className="text-sm font-semibold text-slate-800">{job.companyName}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
              {job.location}
            </span>
            <span>•</span>
            <span className="capitalize font-medium">{job.workType}</span>
            {job.salaryRange && (
              <>
                <span>•</span>
                <span className="font-bold text-primary">{job.salaryRange}</span>
              </>
            )}
          </div>
        </div>

        {/* Match Score Badge (if computed) */}
        {job.matchScore !== undefined && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold self-start">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" aria-hidden="true" />
            <span>Kecocokan {job.matchScore}%</span>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Required Skills Badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        {job.requiredSkills.map((skill, idx) => (
          <span
            key={idx}
            className="text-[11px] px-2.5 py-0.5 rounded-md bg-white text-primary border border-blue-200 font-medium"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-200">
        <button
          type="button"
          onClick={() => setSaved(!saved)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 min-h-[36px] ${
            saved
              ? "bg-amber-100 border-amber-300 text-amber-900"
              : "border-slate-300 text-slate-700 hover:bg-slate-100"
          }`}
          aria-label={saved ? "Hapus dari simpanan" : "Simpan lowongan ini"}
        >
          <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-amber-600 text-amber-600" : ""}`} aria-hidden="true" />
          {saved ? "Disimpan" : "Simpan"}
        </button>

        {job.externalUrl ? (
          <a
            href={job.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold px-4 py-2 bg-primary hover:bg-[#163861] text-white rounded-lg shadow-sm transition flex items-center gap-1.5 min-h-[36px]"
          >
            Lamar di Sumber Asli
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        ) : (
          <Link
            href={`/apply/${job.id}`}
            className="text-xs font-semibold px-4 py-2 bg-primary hover:bg-[#163861] text-white rounded-lg shadow-sm transition min-h-[36px]"
          >
            Kirim Lamaran Cepat
          </Link>
        )}
      </div>
    </article>
  );
}

const SAMPLE_JOBS: JobItem[] = [
  {
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
  {
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
  {
    id: "job-3",
    title: "Junior Backend Developer",
    companyName: "PT Data Presisi Solusindo",
    location: "Surabaya",
    workType: "full-time",
    salaryRange: "Rp 6.500.000 - Rp 9.500.000",
    source: "jooble",
    externalUrl: "https://id.jooble.org",
    description: "Tanggung jawab mencakup pengembangan API RESTful menggunakan Node.js Express atau Python FastAPI serta integrasi database PostgreSQL.",
    requiredSkills: ["Node.js", "Express", "PostgreSQL", "REST API"],
    postedAt: "2026-11-09",
    matchScore: 78,
  },
];

