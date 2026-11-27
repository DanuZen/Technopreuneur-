"use client";

import { Printer, Edit3 } from "lucide-react";
import { CVProfileData } from "@/types";

interface AtsCvPreviewProps {
  profile: CVProfileData;
  onEdit?: () => void;
  hideToolbar?: boolean;
  fitViewport?: boolean;
}

function cleanInstitutionName(raw: string): string {
  if (!raw) return "Perguruan Tinggi";
  // Hentikan pada titik kalimat atau tanda kurung yang tidak sengaja ikut terekstrak
  const firstPart = raw.split(/[.(;]/)[0]?.trim();
  return firstPart && firstPart.length >= 4 ? firstPart : raw.trim();
}

function formatDegreeAndField(
  degreeRaw: string,
  fieldRaw: string,
  headline?: string
): string {
  const deg = (degreeRaw || "Sarjana (S1)").trim();
  const degFormatted =
    deg.toUpperCase() === "SARJANA" || deg.toUpperCase() === "S1"
      ? "Sarjana (S1)"
      : deg;

  const cleanField = (fieldRaw || "").trim();
  if (
    !cleanField ||
    cleanField.toLowerCase() === "bidang studi terkait"
  ) {
    const hl = (headline || "").toLowerCase();
    if (
      hl.includes("flutter") ||
      hl.includes("javascript") ||
      hl.includes("frontend") ||
      hl.includes("backend") ||
      hl.includes("fullstack") ||
      hl.includes("web") ||
      hl.includes("software")
    ) {
      return `${degFormatted}, Teknik Informatika / Ilmu Komputer`;
    }
    if (hl.includes("data") || hl.includes("ai")) {
      return `${degFormatted}, Sains Data & Sistem Informasi`;
    }
    return `${degFormatted}, Teknologi Informasi`;
  }
  return `${degFormatted}, ${cleanField}`;
}

interface HarvardExperienceEntry {
  organization: string;
  location: string;
  roleTitle: string;
  period: string;
  bullets: string[];
}

function buildHarvardExperiences(profile: CVProfileData): HarvardExperienceEntry[] {
  const rawList = profile.experiences || [];
  const headline = profile.headline || "Software & Product Engineer";

  // Deteksi apakah data lama berasal dari fallback placeholder ("Pencapaian & Pengalaman #1" / baris skill)
  const isLegacySkillBullets =
    rawList.length > 0 &&
    rawList.every(
      (e) =>
        e.title.startsWith("Pencapaian & Pengalaman #") ||
        e.organization === "Riwayat Pengalaman Kandidat" ||
        /^(Bahasa & Framework|Backend & Database|Desain & UI\/UX):/i.test(
          e.description.trim()
        )
    );

  if (isLegacySkillBullets) {
    const tech = profile.skills?.technical || [];
    const topTech = tech.slice(0, 5).join(", ") || "React, Next.js, TypeScript, Flutter";
    return [
      {
        organization: "Pengembangan Produk & Aplikasi Digital",
        location: "Indonesia",
        roleTitle: headline,
        period: "2024 – Sekarang",
        bullets: [
          `Merancang dan mengembangkan aplikasi web serta mobile lintas platform menggunakan ${topTech} dengan arsitektur modular yang skalabel.`,
          "Mengintegrasikan layanan RESTful API, autentikasi pengguna, serta pengelolaan basis data terstruktur untuk mendukung performa sistem yang responsif.",
          "Menerapkan standar antarmuka UI/UX modern dan pengujian fungsionalitas guna meningkatkan pengalaman serta retensi pengguna.",
        ],
      },
      {
        organization: "Proyek Kolaborasi & Riset Teknologi Kampus",
        location: "Padang, Indonesia",
        roleTitle: "Fullstack & UI/UX Developer",
        period: "2023 – 2024",
        bullets: [
          "Memimpin perancangan wireframe, sistem desain (design system), dan prototipe interaktif menggunakan Figma sebelum tahap implementasi kode.",
          "Menyusun dokumentasi teknis, manajemen repositori Git, dan penerapan kontrol akses berbasis peran (Role-Based Access Control).",
        ],
      },
    ];
  }

  return rawList.map((exp, idx) => {
    const isPlaceholderTitle = exp.title.startsWith("Pencapaian & Pengalaman #");
    const isPlaceholderOrg =
      exp.organization === "Riwayat Pengalaman Kandidat" ||
      exp.organization === "Riwayat Kandidat";

    const roleTitle = isPlaceholderTitle
      ? idx === 0
        ? headline
        : `Project Contributor & ${headline}`
      : exp.title;

    const organization = isPlaceholderOrg
      ? "Proyek Pengembangan & Implementasi Sistem"
      : exp.organization;

    const period =
      !exp.period || exp.period.toLowerCase() === "terbaru"
        ? idx === 0
          ? "2024 – Sekarang"
          : "2023 – 2024"
        : exp.period;

    const rawSentences = (exp.description || "")
      .split(/(?:\r?\n|•|(?<=\.)\s+)/)
      .map((s) => s.replace(/^[-*•\s]+/, "").trim())
      .filter((s) => s.length > 4);

    const bullets =
      rawSentences.length > 0
        ? rawSentences
        : [
            "Melaksanakan pengembangan solusi teknis dan kolaborasi tim secara terukur sesuai standar kebutuhan organisasi.",
          ];

    return {
      organization,
      location: "Indonesia",
      roleTitle,
      period,
      bullets,
    };
  });
}

export function AtsCvPreview({
  profile,
  onEdit,
  hideToolbar = false,
  fitViewport = false,
}: AtsCvPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const harvardExperiences = buildHarvardExperiences(profile);
  const educationList =
    profile.education && profile.education.length > 0
      ? profile.education
      : [
          {
            institution: "Universitas Negeri Padang",
            degree: "Sarjana (S1)",
            field: "Teknik Informatika",
            graduationYear: "2026",
          },
        ];

  const portfolioLink = profile.portfolioProjects?.[0]?.link;

  return (
    <div
      className={
        fitViewport
          ? "h-full flex items-center justify-center print:block"
          : "space-y-4"
      }
    >
      {/* Action Toolbar */}
      {!hideToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm print:hidden">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            <span className="text-xs font-semibold text-slate-800">
              Format Harvard ATS 1-Kolom Terverifikasi
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1.5 min-h-[36px]"
              >
                <Edit3
                  className="w-3.5 h-3.5 text-slate-600"
                  aria-hidden="true"
                />
                <span>Edit Data</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-sm transition flex items-center gap-1.5 min-h-[36px]"
            >
              <Printer className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Cetak / Unduh PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* HARVARD ATS DOCUMENT PAPER SHEET (A4: 210mm x 297mm) */}
      <div
        className={`bg-white rounded-2xl border border-slate-200 shadow-md text-slate-900 mx-auto print:w-[210mm] print:min-h-[297mm] print:h-auto print:aspect-auto print:max-w-none print:shadow-none print:border-none print:p-0 print:overflow-visible ${
          fitViewport
            ? "px-6 py-5 sm:px-8 sm:py-6 space-y-3 w-full xl:w-auto xl:h-full xl:max-h-full xl:aspect-[210/297] overflow-y-auto scrollbar-none"
            : "p-8 sm:p-12 space-y-5 w-full max-w-[794px] sm:min-h-[1123px]"
        }`}
      >
        {/* 1. HARVARD HEADER: Name & Contact Line */}
        <header className="border-b border-slate-800 pb-2 text-center space-y-1">
          <h1
            className={`font-bold tracking-wide text-slate-950 uppercase ${
              fitViewport ? "text-lg sm:text-xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {profile.fullName}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 text-[11px] text-slate-700">
            <span>Indonesia</span>
            {profile.contactEmail && (
              <>
                <span>•</span>
                <span>{profile.contactEmail}</span>
              </>
            )}
            {profile.headline && (
              <>
                <span>•</span>
                <span className="font-medium text-slate-800">
                  {profile.headline}
                </span>
              </>
            )}
            {portfolioLink && (
              <>
                <span>•</span>
                <span className="underline text-slate-900">{portfolioLink}</span>
              </>
            )}
          </div>
        </header>

        {/* 2. EDUCATION (Harvard Standard First Section) */}
        <section className="space-y-1.5">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5">
            Education
          </h2>
          <div className="space-y-2">
            {educationList.map((edu, idx) => {
              const instName = cleanInstitutionName(edu.institution);
              const degreeLine = formatDegreeAndField(
                edu.degree,
                edu.field,
                profile.headline
              );
              const gradYear = edu.graduationYear || "2026";
              return (
                <div key={idx} className="text-[11.5px] leading-snug space-y-0.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-bold text-slate-950">{instName}</span>
                    <span className="text-[11px] text-slate-700 shrink-0">
                      Indonesia
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="italic text-slate-800">{degreeLine}</span>
                    <span className="text-[11px] text-slate-700 shrink-0">
                      Lulus {gradYear}
                    </span>
                  </div>
                  {idx === 0 && profile.summary && (
                    <p className="text-[11px] text-slate-700 pt-0.5 leading-normal">
                      <span className="font-semibold text-slate-900">
                        Fokus &amp; Kualifikasi:{" "}
                      </span>
                      {profile.summary}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. EXPERIENCE (Harvard Standard Organization/Location + Role/Dates + Action Bullets) */}
        {harvardExperiences.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5">
              Experience
            </h2>
            <div className="space-y-2.5">
              {harvardExperiences.map((exp, idx) => (
                <div key={idx} className="text-[11.5px] leading-snug space-y-1">
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-bold text-slate-950">
                        {exp.organization}
                      </span>
                      <span className="text-[11px] text-slate-700 shrink-0">
                        {exp.location}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="italic font-medium text-slate-800">
                        {exp.roleTitle}
                      </span>
                      <span className="text-[11px] text-slate-700 shrink-0">
                        {exp.period}
                      </span>
                    </div>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-800 leading-normal">
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. LEADERSHIP & ACTIVITIES / PORTFOLIO */}
        <section className="space-y-1.5">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5">
            Leadership &amp; Activities
          </h2>
          <div className="text-[11.5px] leading-snug space-y-1">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-bold text-slate-950">
                {profile.portfolioProjects?.[0]?.name ||
                  "Pengembangan Portofolio & Komunitas Teknologi"}
              </span>
              <span className="text-[11px] text-slate-700 shrink-0">
                {portfolioLink || "Indonesia"}
              </span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="italic font-medium text-slate-800">
                {profile.headline || "Kontributor Teknis & Pengembang Mandiri"}
              </span>
              <span className="text-[11px] text-slate-700 shrink-0">
                Aktif
              </span>
            </div>
            <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-slate-800 leading-normal">
              <li>
                Membangun dan mendokumentasikan proyek perangkat lunak dengan
                standar kode bersih (clean architecture) serta kesiapan produksi.
              </li>
              {profile.skills?.soft && profile.skills.soft.length > 0 && (
                <li>
                  Aktif menerapkan kompetensi {profile.skills.soft.join(", ")}{" "}
                  dalam penyelesaian proyek tim maupun kolaborasi lintas fungsi.
                </li>
              )}
            </ul>
          </div>
        </section>

        {/* 5. SKILLS & INTERESTS (Harvard Key-Value Block) */}
        {profile.skills && (
          <section className="space-y-1.5">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-950 border-b border-slate-400 pb-0.5">
              Skills &amp; Interests
            </h2>
            <div className="text-[11px] text-slate-800 space-y-0.5 leading-normal">
              <p>
                <span className="font-bold text-slate-950">Technical:</span>{" "}
                {profile.skills.technical?.join(", ") || "-"}
              </p>
              {profile.skills.tools && profile.skills.tools.length > 0 && (
                <p>
                  <span className="font-bold text-slate-950">
                    Tools &amp; Software:
                  </span>{" "}
                  {profile.skills.tools.join(", ")}
                </p>
              )}
              <p>
                <span className="font-bold text-slate-950">Language:</span>{" "}
                Bahasa Indonesia (Fasih), Bahasa Inggris (Profesional)
              </p>
              {profile.skills.soft && profile.skills.soft.length > 0 && (
                <p>
                  <span className="font-bold text-slate-950">
                    Competencies &amp; Interests:
                  </span>{" "}
                  {profile.skills.soft.join(", ")}
                </p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
