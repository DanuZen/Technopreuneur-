"use client";

import { Printer, Download, Edit3, ShieldCheck } from "lucide-react";
import { CVProfileData } from "@/types";

interface AtsCvPreviewProps {
  profile: CVProfileData;
  onEdit?: () => void;
  hideToolbar?: boolean;
  fitViewport?: boolean;
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

  return (
    <div className={fitViewport ? "h-full flex items-center justify-center print:block" : "space-y-4"}>
      {/* Action Toolbar */}
      {!hideToolbar && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm print:hidden">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-xs font-semibold text-slate-800">
              Format ATS 1-Kolom Bersih Terverifikasi
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition flex items-center gap-1.5 min-h-[36px]"
              >
                <Edit3 className="w-3.5 h-3.5 text-slate-600" aria-hidden="true" />
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

      {/* ATS DOCUMENT PAPER SHEET (A4: 210mm x 297mm) */}
      <div
        className={`bg-white rounded-2xl border border-slate-200 shadow-md font-sans text-slate-900 mx-auto print:w-[210mm] print:min-h-[297mm] print:h-auto print:aspect-auto print:max-w-none print:shadow-none print:border-none print:p-0 print:overflow-visible ${
          fitViewport
            ? "p-5 sm:p-7 space-y-3.5 w-full xl:w-auto xl:h-full xl:max-h-full xl:aspect-[210/297] overflow-y-auto scrollbar-none"
            : "p-8 sm:p-12 space-y-6 w-full max-w-[794px] sm:min-h-[1123px]"
        }`}
      >
        {/* ATS Header */}
        <header className={`border-b border-slate-300 text-center space-y-1 ${fitViewport ? "pb-2.5" : "pb-4"}`}>
          <h1
            className={`font-black tracking-tight text-slate-900 uppercase ${
              fitViewport ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
            }`}
          >
            {profile.fullName}
          </h1>
          {profile.headline && (
            <p className="text-sm font-semibold text-slate-700">{profile.headline}</p>
          )}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 pt-1">
            {profile.contactEmail && <span>{profile.contactEmail}</span>}
            {profile.contactEmail && <span>•</span>}
            <span>Indonesia</span>
            {profile.portfolioProjects && profile.portfolioProjects[0]?.link && (
              <>
                <span>•</span>
                <span className="text-blue-600 underline">
                  {profile.portfolioProjects[0].link}
                </span>
              </>
            )}
          </div>
        </header>

        {/* ATS Section 1: Ringkasan Profesional */}
        {profile.summary && (
          <section className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 font-mono">
              Ringkasan Profesional
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {profile.summary}
            </p>
          </section>
        )}

        {/* ATS Section 2: Keahlian Teknis (Core Skills) */}
        {profile.skills && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 font-mono">
              Keahlian &amp; Penguasaan Alat
            </h2>
            <div className="text-xs text-slate-700 space-y-1">
              <p>
                <span className="font-semibold text-slate-900">Keahlian Teknis:</span>{" "}
                {profile.skills.technical?.join(", ") || "-"}
              </p>
              {profile.skills.soft && profile.skills.soft.length > 0 && (
                <p>
                  <span className="font-semibold text-slate-900">Keterampilan Non-Teknis:</span>{" "}
                  {profile.skills.soft.join(", ")}
                </p>
              )}
              {profile.skills.tools && profile.skills.tools.length > 0 && (
                <p>
                  <span className="font-semibold text-slate-900">Tools / Software:</span>{" "}
                  {profile.skills.tools.join(", ")}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ATS Section 3: Riwayat Pengalaman / Proyek */}
        {profile.experiences && profile.experiences.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 font-mono">
              Pengalaman Proyek &amp; Organisasi
            </h2>
            <div className="space-y-3">
              {profile.experiences.map((exp, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{exp.title}</span>
                    <span className="text-slate-500 font-mono text-[11px]">{exp.period}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600">{exp.organization}</p>
                  <p className="text-xs text-slate-700 leading-relaxed text-justify">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ATS Section 4: Riwayat Pendidikan */}
        {profile.education && profile.education.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 font-mono">
              Pendidikan Formal
            </h2>
            <div className="space-y-2">
              {profile.education.map((edu, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{edu.institution}</span>
                    <span className="text-slate-600">, {edu.degree} {edu.field}</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">
                    Lulus: {edu.graduationYear}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
