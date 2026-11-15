"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import { UploadCloud } from "lucide-react";
import { api } from "@/lib/api";
import { isValidDashboardRole } from "@/lib/routes";
import { CVAnalysisResult } from "@/types";
import { DashboardPageHeading } from "@/components/dashboard/dashboard-page-heading";
import { CvEvaluationChat } from "@/components/evaluate/cv-evaluation-chat";

const DEMO_SESSIONS: Record<string, CVAnalysisResult> = {
  "demo-ats-wira": {
    cvId: "demo-ats-wira",
    fileName: "CV Wira Fikri - Standar ATS.pdf",
    overallScore: 88,
    dimensions: {
      structure: 92,
      clarity: 86,
      measurableImpact: 84,
      skillRelevance: 90,
      completeness: 88,
    },
    strengths: [
      "Format berkas 1-kolom ATS-friendly terbaca jelas tanpa tabel kompleks.",
      "Memuat kata kunci teknis yang kuat di bidang pengembangan perangkat lunak.",
      "Informasi kontak dan riwayat pendidikan formal tersusun rapi.",
    ],
    weaknesses: [
      "Beberapa poin riwayat kerja belum mencantumkan metrik angka peningkatan.",
      "Belum ada tautan portofolio daring atau repositori GitHub aktif.",
    ],
    recommendations: [
      "Tambahkan angka kuantitatif pada pencapaian proyek (contoh: 'Meningkatkan kecepatan load 35%').",
      "Sertakan tautan profil LinkedIn atau portofolio digital yang dapat diakses rekruter.",
    ],
    profile: {
      fullName: "Wira Fikri",
      headline: "Calon Profesional Muda",
      summary:
        "Lulusan yang memiliki antusiasme tinggi dalam implementasi teknologi web modern, berorientasi pada pemecahan masalah dan kolaborasi tim.",
      education: [
        {
          institution: "Universitas Negeri Padang",
          degree: "Sarjana (S1)",
          field: "Teknik Informatika",
          graduationYear: "2026",
        },
      ],
      skills: {
        technical: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Git"],
        soft: ["Problem Solving", "Komunikasi Tim", "Manajemen Waktu"],
        tools: ["VS Code", "Figma", "Postman"],
      },
      experiences: [
        {
          title: "Frontend Developer (Proyek Mandiri / Kampus)",
          organization: "Laboratorium Komputasi",
          period: "2024 - 2025",
          description:
            "Mengembangkan antarmuka aplikasi web berbasis Next.js dengan arsitektur komponen modular dan integrasi RESTful API.",
        },
      ],
    },
  },
  "demo-frontend-freshgrad": {
    cvId: "demo-frontend-freshgrad",
    fileName: "Resume Frontend Fresh Graduate.pdf",
    overallScore: 82,
    dimensions: {
      structure: 88,
      clarity: 82,
      measurableImpact: 76,
      skillRelevance: 84,
      completeness: 80,
    },
    strengths: [
      "Struktur CV ringkas 1 halaman dan mudah dipindai oleh perekrut.",
      "Keahlian frontend modern seperti React dan TypeScript tercantum jelas.",
    ],
    weaknesses: [
      "Dampak terukur pada pengalaman proyek masih bersifat deskriptif.",
    ],
    recommendations: [
      "Sertakan hasil angka atau persentase peningkatan performa pada proyek web.",
      "Lengkapi tautan demo aplikasi atau repositori GitHub.",
    ],
    profile: {
      fullName: "Resume Frontend Fresh Graduate",
      headline: "Junior Frontend Developer",
      summary:
        "Fresh graduate dengan fokus pada pengembangan antarmuka web responsif menggunakan React dan Tailwind CSS.",
      education: [
        {
          institution: "Universitas Negeri Padang",
          degree: "Sarjana (S1)",
          field: "Teknik Informatika",
          graduationYear: "2026",
        },
      ],
      skills: {
        technical: ["React", "JavaScript", "HTML/CSS", "Tailwind CSS"],
        soft: ["Adaptif", "Kolaborasi Tim"],
        tools: ["Git", "Figma"],
      },
      experiences: [
        {
          title: "Web UI Intern",
          organization: "Studio Digital Kampus",
          period: "2025",
          description:
            "Membangun komponen halaman landing responsif dan melakukan pengujian lintas perangkat.",
        },
      ],
    },
  },
};

export default function RiwayatSesiDetailPage() {
  const params = useParams<{ role: string; id: string }>();
  const router = useRouter();
  const role = params?.role || "";
  const sessionId = decodeURIComponent(params?.id || "");

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<CVAnalysisResult | null>(null);

  if (!isValidDashboardRole(role)) {
    notFound();
  }

  useEffect(() => {
    const stored = api.getAnalysisById(sessionId) || DEMO_SESSIONS[sessionId] || null;
    if (stored) {
      api.saveAnalysis(stored);
      setAnalysis(stored);
    }
    setLoading(false);
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#0f2c56] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <main className="min-h-full w-full px-3.5 sm:px-6 pt-4 sm:pt-5 pb-5 sm:pb-6 space-y-6">
        <DashboardPageHeading
          badge="Riwayat Sesi"
          titleLine1="Sesi evaluasi CV"
          titleLine2Prefix="tidak"
          titleHighlight="ditemukan!"
        />
        <div className="bg-white border border-slate-200 rounded-[28px] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            Sesi riwayat yang Anda pilih sudah dihapus atau belum tersedia. Silakan mulai evaluasi CV baru.
          </p>
          <Link
            href={`/${role}/dashboard/evaluasi`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Evaluasi CV Baru</span>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="h-full overflow-hidden w-full px-3.5 sm:px-6 pt-4 sm:pt-5 pb-3 flex flex-col gap-4">
      <div className="shrink-0">
        <DashboardPageHeading
          badge="Hasil & Konsultasi CV"
          titleLine1="Diskusikan hasil evaluasi"
          titleLine2Prefix="untuk skor"
          titleHighlight="paling optimal!"
        />
      </div>
      <CvEvaluationChat
        analysis={analysis}
        onResetUpload={() => router.push(`/${role}/dashboard/evaluasi`)}
      />
    </div>
  );
}
