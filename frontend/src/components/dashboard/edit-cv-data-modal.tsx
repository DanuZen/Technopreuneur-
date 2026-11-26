"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  User,
  Award,
  Briefcase,
  GraduationCap,
  Plus,
  Trash2,
  Check,
} from "lucide-react";
import { CVProfileData } from "@/types";

interface EditCvDataModalProps {
  profile: CVProfileData;
  onClose: () => void;
  onSave: (updated: CVProfileData) => void;
}

type ModalTab = "identitas" | "keahlian" | "pengalaman" | "pendidikan";

export function EditCvDataModal({
  profile,
  onClose,
  onSave,
}: EditCvDataModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<ModalTab>("identitas");

  const [fullName, setFullName] = useState(profile.fullName || "");
  const [headline, setHeadline] = useState(profile.headline || "");
  const [contactEmail, setContactEmail] = useState(profile.contactEmail || "");
  const [summary, setSummary] = useState(profile.summary || "");
  const [portfolioLink, setPortfolioLink] = useState(
    profile.portfolioProjects?.[0]?.link || ""
  );

  const [techText, setTechText] = useState(
    (profile.skills?.technical || []).join(", ")
  );
  const [softText, setSoftText] = useState(
    (profile.skills?.soft || []).join(", ")
  );
  const [toolsText, setToolsText] = useState(
    (profile.skills?.tools || []).join(", ")
  );

  const [experiences, setExperiences] = useState(
    profile.experiences?.length ? [...profile.experiences] : []
  );
  const [education, setEducation] = useState(
    profile.education?.length ? [...profile.education] : []
  );

  useEffect(() => {
    setMounted(true);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const parseCsv = (val: string) =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedLink = portfolioLink.trim();
    const updated: CVProfileData = {
      ...profile,
      fullName: fullName.trim() || profile.fullName,
      headline: headline.trim(),
      contactEmail: contactEmail.trim(),
      summary: summary.trim(),
      skills: {
        technical: parseCsv(techText),
        soft: parseCsv(softText),
        tools: parseCsv(toolsText),
      },
      experiences: experiences.filter(
        (ex) => ex.title.trim() || ex.description.trim()
      ),
      education: education.filter(
        (ed) => ed.institution.trim() || ed.degree.trim()
      ),
      portfolioProjects: cleanedLink
        ? [
            {
              name: profile.portfolioProjects?.[0]?.name || "Portofolio Utama",
              description:
                profile.portfolioProjects?.[0]?.description ||
                "Tautan portofolio kandidat",
              link: cleanedLink,
            },
          ]
        : undefined,
    };
    onSave(updated);
  };

  const modalContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Edit Data Dokumen CV ATS"
      className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/45 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      <form
        onSubmit={handleSave}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl max-h-[88dvh] flex flex-col overflow-hidden rounded-[28px] bg-white border border-slate-200 text-[#0f2c56] shadow-[0_24px_60px_-15px_rgba(15,44,86,0.35)] animate-page-enter"
      >
        {/* Header */}
        <div className="shrink-0 px-6 pt-5 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#ce2731] text-white text-[10px] font-bold uppercase tracking-wider">
              Edit Data CV ATS
            </span>
            <h2 className="text-base sm:text-lg font-extrabold text-[#0f2c56] mt-1">
              Sesuaikan Isi Dokumen CV Sebelum Dicetak
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup popup edit data CV"
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#0f2c56] flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="shrink-0 px-4 sm:px-6 pt-3 pb-2 bg-[#f4f7fb] border-b border-slate-200 flex overflow-x-auto scrollbar-none sm:flex-wrap gap-1.5">
          {(
            [
              { id: "identitas", label: "Identitas & Ringkasan", icon: User },
              { id: "keahlian", label: "Keahlian & Alat", icon: Award },
              { id: "pengalaman", label: "Pengalaman", icon: Briefcase },
              { id: "pendidikan", label: "Pendidikan", icon: GraduationCap },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  active
                    ? "bg-[#0f2c56] text-white"
                    : "bg-white text-slate-600 hover:text-[#0f2c56] border border-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-4">
          {activeTab === "identitas" && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56] mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56] mb-1">
                    Target Peran / Headline
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Contoh: Frontend Developer"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56] mb-1">
                    Email Kontak
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56] mb-1">
                    Tautan Portofolio / LinkedIn
                  </label>
                  <input
                    type="text"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    placeholder="https://github.com/username"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56] mb-1">
                  Ringkasan Profesional
                </label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-[#0f2c56] leading-relaxed focus:outline-none focus:border-[#0f2c56] resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === "keahlian" && (
            <div className="space-y-3.5">
              <p className="text-[11px] text-slate-500">
                Pisahkan setiap keahlian atau alat dengan tanda koma (,).
              </p>
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56] mb-1">
                  Keahlian Teknis
                </label>
                <textarea
                  rows={2}
                  value={techText}
                  onChange={(e) => setTechText(e.target.value)}
                  placeholder="React, Next.js, TypeScript, REST API"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56] resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56] mb-1">
                  Keterampilan Non-Teknis (Soft Skills)
                </label>
                <textarea
                  rows={2}
                  value={softText}
                  onChange={(e) => setSoftText(e.target.value)}
                  placeholder="Komunikasi, Kepemimpinan, Problem Solving"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56] resize-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56] mb-1">
                  Tools / Software
                </label>
                <textarea
                  rows={2}
                  value={toolsText}
                  onChange={(e) => setToolsText(e.target.value)}
                  placeholder="Git, GitHub, Figma, Docker"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56] resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === "pengalaman" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#0f2c56]">
                  Daftar Pengalaman / Proyek ({experiences.length})
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setExperiences([
                      ...experiences,
                      {
                        title: "",
                        organization: "",
                        period: "Terbaru",
                        description: "",
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0f2c56] text-white text-[11px] font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pengalaman</span>
                </button>
              </div>

              {experiences.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#f4f7fb] border border-slate-200 space-y-2.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold text-[#0f2c56]">
                      Pengalaman #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setExperiences(experiences.filter((_, i) => i !== idx))
                      }
                      className="p-1 rounded-lg text-slate-400 hover:text-[#ce2731] cursor-pointer"
                      aria-label={`Hapus pengalaman ${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={(e) => {
                        const next = [...experiences];
                        next[idx] = { ...exp, title: e.target.value };
                        setExperiences(next);
                      }}
                      placeholder="Peran / Judul Proyek"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56]"
                    />
                    <input
                      type="text"
                      value={exp.organization}
                      onChange={(e) => {
                        const next = [...experiences];
                        next[idx] = { ...exp, organization: e.target.value };
                        setExperiences(next);
                      }}
                      placeholder="Instansi / Organisasi"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56]"
                    />
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => {
                        const next = [...experiences];
                        next[idx] = { ...exp, period: e.target.value };
                        setExperiences(next);
                      }}
                      placeholder="Periode (mis. 2024 - 2025)"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56]"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => {
                      const next = [...experiences];
                      next[idx] = { ...exp, description: e.target.value };
                      setExperiences(next);
                    }}
                    placeholder="Uraikan pencapaian terukur (mis. meningkatkan performa 35%)"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-[#0f2c56] resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "pendidikan" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#0f2c56]">
                  Riwayat Pendidikan ({education.length})
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setEducation([
                      ...education,
                      {
                        institution: "",
                        degree: "S1",
                        field: "",
                        graduationYear: "2026",
                      },
                    ])
                  }
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0f2c56] text-white text-[11px] font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Pendidikan</span>
                </button>
              </div>

              {education.map((edu, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-[#f4f7fb] border border-slate-200 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold text-[#0f2c56]">
                      Pendidikan #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEducation(education.filter((_, i) => i !== idx))
                      }
                      className="p-1 rounded-lg text-slate-400 hover:text-[#ce2731] cursor-pointer"
                      aria-label={`Hapus pendidikan ${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const next = [...education];
                        next[idx] = { ...edu, institution: e.target.value };
                        setEducation(next);
                      }}
                      placeholder="Nama Universitas / Sekolah"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56]"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const next = [...education];
                        next[idx] = { ...edu, degree: e.target.value };
                        setEducation(next);
                      }}
                      placeholder="Jenjang (S1 / D3 / SMK)"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56]"
                    />
                    <input
                      type="text"
                      value={edu.field}
                      onChange={(e) => {
                        const next = [...education];
                        next[idx] = { ...edu, field: e.target.value };
                        setEducation(next);
                      }}
                      placeholder="Jurusan / Program Studi"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56]"
                    />
                    <input
                      type="text"
                      value={edu.graduationYear}
                      onChange={(e) => {
                        const next = [...education];
                        next[idx] = { ...edu, graduationYear: e.target.value };
                        setEducation(next);
                      }}
                      placeholder="Tahun Lulus (mis. 2026)"
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56]"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0f2c56] text-xs font-bold cursor-pointer"
          >
            Batal
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </form>
    </div>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
