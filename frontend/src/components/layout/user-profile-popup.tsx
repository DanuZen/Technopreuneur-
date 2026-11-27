"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  X,
  User as UserIcon,
  Briefcase,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Pencil,
  Check,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  FileText,
} from "lucide-react";
import { CVAnalysisResult, User } from "@/types";
import { api } from "@/lib/api";
import { ModalShell } from "@/components/ui/modal-shell";

interface ExperienceEntry {
  id: string;
  title: string;
  company: string;
  period: string;
}

interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

interface UserProfileDraft {
  name: string;
  email: string;
  location: string;
  field: string;
  seniority: "intern" | "junior" | "mid" | "senior" | "lead";
  summary: string;
  skills: string[];
  experiences: ExperienceEntry[];
  education: EducationEntry[];
}

const STORAGE_KEY = "pasbana_user_profile_detail";

interface UserProfilePopupProps {
  user: User;
  baseDashboardPath: string;
  onClose: () => void;
  onLogout: () => void;
  onUserUpdated: (updated: User) => void;
}

type ProfileSectionTab =
  | "identitas"
  | "keahlian"
  | "pengalaman"
  | "pendidikan"
  | "privasi";

export function UserProfilePopup({
  user,
  baseDashboardPath,
  onClose,
  onLogout,
  onUserUpdated,
}: UserProfilePopupProps) {
  const isUserRole =
    user.role === "jobseeker" || String(user.role) === "user" || !user.role;

  const [activeTab, setActiveTab] = useState<ProfileSectionTab>("identitas");
  const [savedNotice, setSavedNotice] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [cvList, setCvList] = useState<CVAnalysisResult[]>([]);
  const [deletingCvId, setDeletingCvId] = useState<string | null>(null);
  const [confirmDeleteAccount, setConfirmDeleteAccount] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCvList(api.getHistory());
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const handleDeleteCv = async (cvId: string) => {
    setDeletingCvId(cvId);
    await api.deleteCV(cvId);
    setCvList(api.getHistory());
    setDeletingCvId(null);
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await api.deleteAccount();
      onClose();
      onLogout();
    } finally {
      setDeletingAccount(false);
    }
  };

  const [draft, setDraft] = useState<UserProfileDraft>({
    name: user.name,
    email: user.email || "",
    location: "Padang, Indonesia",
    field: "Software Engineering / Frontend",
    seniority: "junior",
    summary:
      "Lulusan baru yang berfokus pada pengembangan antarmuka web modern dan siap berkontribusi dalam tim produk.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
    experiences: [
      {
        id: "exp-1",
        title: "Frontend Developer Intern",
        company: "PT Inovasi Digital",
        period: "2025",
      },
    ],
    education: [
      {
        id: "edu-1",
        degree: "S1 Teknik Informatika",
        institution: "Universitas Negeri Padang",
        year: "2026",
      },
    ],
  });

  // Form states for Skills CRUD
  const [newSkill, setNewSkill] = useState("");

  // Form states for Experience CRUD
  const [expTitle, setExpTitle] = useState("");
  const [expCompany, setExpCompany] = useState("");
  const [expPeriod, setExpPeriod] = useState("");
  const [editingExpId, setEditingExpId] = useState<string | null>(null);

  // Form states for Education CRUD
  const [eduDegree, setEduDegree] = useState("");
  const [eduInstitution, setEduInstitution] = useState("");
  const [eduYear, setEduYear] = useState("");
  const [editingEduId, setEditingEduId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<UserProfileDraft>;
        setDraft((prev) => ({
          ...prev,
          ...parsed,
          name: parsed.name || user.name,
          email: parsed.email || user.email || "",
        }));
        return;
      }
      const currentAnalysis = api.getCurrentAnalysis();
      if (currentAnalysis?.profile) {
        const p = currentAnalysis.profile;
        const mergedSkills = [
          ...(p.skills?.technical || []),
          ...(p.skills?.tools || []),
          ...(p.skills?.soft || []),
        ];
        setDraft((prev) => ({
          ...prev,
          name: p.fullName || user.name,
          summary: p.summary || prev.summary,
          skills: mergedSkills.length ? mergedSkills : prev.skills,
          experiences: p.experiences?.length
            ? p.experiences.map((e, i) => ({
                id: `exp-${i}`,
                title: e.title,
                company: e.organization,
                period: e.period,
              }))
            : prev.experiences,
          education: p.education?.length
            ? p.education.map((ed, i) => ({
                id: `edu-${i}`,
                degree: ed.degree,
                institution: ed.institution,
                year: ed.graduationYear,
              }))
            : prev.education,
        }));
      }
    } catch {
      // ignore storage errors
    }

    // Sinkronkan dari Backend API jika sesi aktif
    api
      .getProfile<{
        fullName?: string;
        headline?: string;
        contactEmail?: string;
        city?: string;
        summary?: string;
        skills?: { technical?: string[] };
        experiences?: Array<{ title: string; organization: string; period: string }>;
        education?: Array<{ degree: string; field: string; institution: string; graduationYear: string }>;
      }>()
      .then((remote) => {
        if (!remote) return;
        setDraft((prev) => ({
          ...prev,
          name: remote.fullName || prev.name,
          email: remote.contactEmail || prev.email,
          location: remote.city || prev.location,
          field: remote.headline || prev.field,
          summary: remote.summary || prev.summary,
          skills:
            remote.skills?.technical && remote.skills.technical.length > 0
              ? remote.skills.technical
              : prev.skills,
          experiences:
            remote.experiences && remote.experiences.length > 0
              ? remote.experiences.map((ex, idx) => ({
                  id: `exp-r-${idx}`,
                  title: ex.title,
                  company: ex.organization,
                  period: ex.period,
                }))
              : prev.experiences,
          education:
            remote.education && remote.education.length > 0
              ? remote.education.map((ed, idx) => ({
                  id: `edu-r-${idx}`,
                  degree: `${ed.degree} ${ed.field}`.trim(),
                  institution: ed.institution,
                  year: ed.graduationYear,
                }))
              : prev.education,
        }));
      })
      .catch(() => {
        // tetap gunakan localStorage jika offline
      });
  }, [user.name, user.email]);

  const persistDraft = (next: UserProfileDraft) => {
    setDraft(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      const updatedUser: User = {
        ...user,
        name: next.name.trim() || user.name,
        email: next.email.trim() || user.email,
      };
      localStorage.setItem("cm_user", JSON.stringify(updatedUser));
      onUserUpdated(updatedUser);
    } catch {
      // ignore
    }

    api
      .updateProfile({
        fullName: next.name.trim() || user.name,
        contactEmail: next.email.trim() || user.email,
        city: next.location,
        headline: next.field,
        seniorityLevel: next.seniority,
        summary: next.summary,
        skills: { technical: next.skills, soft: [], tools: [] },
        experiences: next.experiences.map((ex) => ({
          title: ex.title,
          organization: ex.company,
          period: ex.period,
          description: ex.title,
        })),
        education: next.education.map((ed) => ({
          degree: ed.degree,
          field: "",
          institution: ed.institution,
          graduationYear: ed.year,
        })),
      })
      .catch(() => {
        // tetap tersimpan lokal jika offline
      });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  // Skills CRUD
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newSkill.trim();
    if (!cleaned || draft.skills.includes(cleaned)) return;
    persistDraft({ ...draft, skills: [...draft.skills, cleaned] });
    setNewSkill("");
  };

  const handleRemoveSkill = (skill: string) => {
    persistDraft({
      ...draft,
      skills: draft.skills.filter((s) => s !== skill),
    });
  };

  // Experience CRUD
  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expTitle.trim() || !expCompany.trim()) return;
    if (editingExpId) {
      persistDraft({
        ...draft,
        experiences: draft.experiences.map((item) =>
          item.id === editingExpId
            ? {
                ...item,
                title: expTitle.trim(),
                company: expCompany.trim(),
                period: expPeriod.trim() || "2026",
              }
            : item
        ),
      });
      setEditingExpId(null);
    } else {
      persistDraft({
        ...draft,
        experiences: [
          {
            id: `exp-${Date.now()}`,
            title: expTitle.trim(),
            company: expCompany.trim(),
            period: expPeriod.trim() || "2026",
          },
          ...draft.experiences,
        ],
      });
    }
    setExpTitle("");
    setExpCompany("");
    setExpPeriod("");
  };

  const handleEditExp = (item: ExperienceEntry) => {
    setEditingExpId(item.id);
    setExpTitle(item.title);
    setExpCompany(item.company);
    setExpPeriod(item.period);
  };

  const handleDeleteExp = (id: string) => {
    if (editingExpId === id) {
      setEditingExpId(null);
      setExpTitle("");
      setExpCompany("");
      setExpPeriod("");
    }
    persistDraft({
      ...draft,
      experiences: draft.experiences.filter((item) => item.id !== id),
    });
  };

  // Education CRUD
  const handleSaveEdu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduDegree.trim() || !eduInstitution.trim()) return;
    if (editingEduId) {
      persistDraft({
        ...draft,
        education: draft.education.map((item) =>
          item.id === editingEduId
            ? {
                ...item,
                degree: eduDegree.trim(),
                institution: eduInstitution.trim(),
                year: eduYear.trim() || "2026",
              }
            : item
        ),
      });
      setEditingEduId(null);
    } else {
      persistDraft({
        ...draft,
        education: [
          {
            id: `edu-${Date.now()}`,
            degree: eduDegree.trim(),
            institution: eduInstitution.trim(),
            year: eduYear.trim() || "2026",
          },
          ...draft.education,
        ],
      });
    }
    setEduDegree("");
    setEduInstitution("");
    setEduYear("");
  };

  const handleEditEdu = (item: EducationEntry) => {
    setEditingEduId(item.id);
    setEduDegree(item.degree);
    setEduInstitution(item.institution);
    setEduYear(item.year);
  };

  const handleDeleteEdu = (id: string) => {
    if (editingEduId === id) {
      setEditingEduId(null);
      setEduDegree("");
      setEduInstitution("");
      setEduYear("");
    }
    persistDraft({
      ...draft,
      education: draft.education.filter((item) => item.id !== id),
    });
  };

  const modalContent = (
    <ModalShell
      onClose={onClose}
      ariaLabel="Detail Profil Pengguna"
      size={isUserRole ? "lg" : "sm"}
      badge={user.role}
      title={draft.name || user.name}
      subtitle={
        savedNotice ? (
          <span className="inline-flex items-center gap-1 font-bold text-emerald-300">
            <Check className="w-3 h-3" />
            Tersimpan
          </span>
        ) : undefined
      }
      leading={
        <div className="w-11 h-11 rounded-2xl bg-white text-[#0f2c56] text-base font-extrabold flex items-center justify-center shrink-0">
          {(draft.name || user.name).charAt(0).toUpperCase()}
        </div>
      }
      subHeader={
        isUserRole
          ? (
              [
                { id: "identitas", label: "Identitas", icon: UserIcon },
                { id: "keahlian", label: "Keahlian", icon: Sparkles },
                { id: "pengalaman", label: "Pengalaman", icon: Briefcase },
                { id: "pendidikan", label: "Pendidikan", icon: GraduationCap },
                { id: "privasi", label: "Privasi & CV", icon: ShieldCheck },
              ] as const
            ).map((tab) => {
              const TabIcon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 min-h-[40px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                    active
                      ? "bg-[#0f2c56] text-white"
                      : "bg-white text-[#0f2c56] border border-slate-200 hover:bg-[#edf2f9]"
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })
          : undefined
      }
      footer={
        <div className="grid grid-cols-2 gap-2.5">
          <Link
            href={baseDashboardPath}
            onClick={onClose}
            className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f2c56] hover:bg-[#163861] text-white text-xs font-bold transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Buka Dashboard</span>
          </Link>
          <button
            type="button"
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="min-h-[44px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar</span>
          </button>
        </div>
      }
    >
        <div className="space-y-4">
          {!isUserRole ? (
            <div className="rounded-2xl bg-[#f4f7fb] p-4 space-y-2 text-xs">
              <p className="font-bold text-[#0f2c56]">
                Email: {user.email || "Akun Terverifikasi"}
              </p>
              <p className="text-slate-600">
                Sesi aktif pada portal {user.role === "employer" ? "Perusahaan" : "Administrator"}.
              </p>
            </div>
          ) : activeTab === "identitas" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                persistDraft(draft);
              }}
              className="space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    value={draft.email}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Domisili
                  </label>
                  <input
                    type="text"
                    value={draft.location}
                    onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase">
                    Tingkat Senioritas
                  </label>
                  <select
                    value={draft.seniority}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        seniority: e.target.value as UserProfileDraft["seniority"],
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  >
                    <option value="intern">Intern / Magang</option>
                    <option value="junior">Junior / Fresh Graduate</option>
                    <option value="mid">Mid-Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Bidang Minat Karir
                </label>
                <input
                  type="text"
                  value={draft.field}
                  onChange={(e) => setDraft({ ...draft, field: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase">
                  Ringkasan Profil
                </label>
                <textarea
                  rows={3}
                  value={draft.summary}
                  onChange={(e) => setDraft({ ...draft, summary: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                />
              </div>
              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  className="morph-pill px-4 py-2 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold cursor-pointer"
                >
                  Simpan Identitas
                </button>
              </div>
            </form>
          ) : activeTab === "keahlian" ? (
            <div className="space-y-4">
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Tambah keahlian (misal: Python, Figma)"
                  className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                />
                <button
                  type="submit"
                  className="morph-pill inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </form>

              <div className="flex flex-wrap gap-2">
                {draft.skills.length === 0 ? (
                  <p className="text-xs text-slate-500">Belum ada keahlian ditambahkan.</p>
                ) : (
                  draft.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#edf2f9] text-[#0f2c56] text-xs font-bold"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        aria-label={`Hapus skill ${skill}`}
                        className="text-slate-500 hover:text-[#ce2731] cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          ) : activeTab === "pengalaman" ? (
            <div className="space-y-4">
              <form
                onSubmit={handleSaveExp}
                className="rounded-2xl bg-[#f4f7fb] p-3.5 space-y-2.5"
              >
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56]">
                  {editingExpId ? "Ubah Pengalaman" : "Tambah Pengalaman / Proyek"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={expTitle}
                    onChange={(e) => setExpTitle(e.target.value)}
                    placeholder="Peran / Jabatan"
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                    required
                  />
                  <input
                    type="text"
                    value={expCompany}
                    onChange={(e) => setExpCompany(e.target.value)}
                    placeholder="Perusahaan / Proyek"
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                    required
                  />
                  <input
                    type="text"
                    value={expPeriod}
                    onChange={(e) => setExpPeriod(e.target.value)}
                    placeholder="Tahun (misal: 2025)"
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  {editingExpId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingExpId(null);
                        setExpTitle("");
                        setExpCompany("");
                        setExpPeriod("");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    className="morph-pill px-3.5 py-1.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold cursor-pointer"
                  >
                    {editingExpId ? "Simpan Perubahan" : "Tambah Pengalaman"}
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {draft.experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-white"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-[#0f2c56] truncate">
                        {exp.title}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {exp.company} &middot; {exp.period}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditExp(exp)}
                        aria-label={`Edit ${exp.title}`}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-[#edf2f9] hover:text-[#0f2c56] cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExp(exp.id)}
                        aria-label={`Hapus ${exp.title}`}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-[#ce2731] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <form
                onSubmit={handleSaveEdu}
                className="rounded-2xl bg-[#f4f7fb] p-3.5 space-y-2.5"
              >
                <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#0f2c56]">
                  {editingEduId ? "Ubah Pendidikan" : "Tambah Riwayat Pendidikan"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={eduDegree}
                    onChange={(e) => setEduDegree(e.target.value)}
                    placeholder="Gelar / Jurusan"
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                    required
                  />
                  <input
                    type="text"
                    value={eduInstitution}
                    onChange={(e) => setEduInstitution(e.target.value)}
                    placeholder="Institusi / Kampus"
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                    required
                  />
                  <input
                    type="text"
                    value={eduYear}
                    onChange={(e) => setEduYear(e.target.value)}
                    placeholder="Tahun Lulus"
                    className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#0f2c56] focus:outline-none focus:border-[#0f2c56]"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  {editingEduId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingEduId(null);
                        setEduDegree("");
                        setEduInstitution("");
                        setEduYear("");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-600 cursor-pointer"
                    >
                      Batal
                    </button>
                  )}
                  <button
                    type="submit"
                    className="morph-pill px-3.5 py-1.5 rounded-xl bg-[#0f2c56] hover:bg-[#ce2731] text-white text-xs font-bold cursor-pointer"
                  >
                    {editingEduId ? "Simpan Perubahan" : "Tambah Pendidikan"}
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {draft.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-white"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-extrabold text-[#0f2c56] truncate">
                        {edu.degree}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {edu.institution} &middot; {edu.year}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleEditEdu(edu)}
                        aria-label={`Edit ${edu.degree}`}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-[#edf2f9] hover:text-[#0f2c56] cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEdu(edu.id)}
                        aria-label={`Hapus ${edu.degree}`}
                        className="p-1.5 rounded-lg text-slate-500 hover:bg-red-50 hover:text-[#ce2731] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isUserRole && activeTab === "privasi" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-[#edf2f9] border border-slate-200 space-y-1">
                <p className="text-xs font-extrabold text-[#0f2c56]">
                  Hak Penghapusan Data Permanen (UU PDP)
                </p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Anda berhak menghapus riwayat dokumen CV, teks terekstrak, dan vektor embedding kapan saja. Penghapusan bersifat permanen.
                </p>
              </div>

              {cvList.length === 0 ? (
                <div className="p-5 rounded-2xl border border-slate-200 bg-white text-center space-y-1">
                  <p className="text-xs font-bold text-[#0f2c56]">
                    Tidak ada dokumen CV tersimpan.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Riwayat unggahan atau CV Onboarding Anda akan muncul di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {cvList.map((item) => (
                    <div
                      key={item.cvId}
                      className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 bg-white"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#edf2f9] text-[#0f2c56] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold text-[#0f2c56] truncate">
                            {item.fileName || item.profile?.fullName || "CV Onboarding"}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Skor ATS: {item.overallScore}/100
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        disabled={deletingCvId === item.cvId}
                        onClick={() => handleDeleteCv(item.cvId)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-[#ce2731] text-[#ce2731] hover:text-white text-[11px] font-bold transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>
                          {deletingCvId === item.cvId ? "Menghapus..." : "Hapus Permanen"}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 space-y-2.5">
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-[#ce2731]">
                    Hapus Akun Secara Permanen
                  </p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Menghapus seluruh akun, profil, dokumen CV, dan riwayat lamaran Anda dari sistem secara permanen.
                  </p>
                </div>
                {!confirmDeleteAccount ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteAccount(true)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-red-300 text-[#ce2731] hover:bg-[#ce2731] hover:text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Hapus Akun Saya
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={deletingAccount}
                      onClick={handleDeleteAccount}
                      className="px-3.5 py-2 rounded-xl bg-[#ce2731] hover:bg-[#b01e27] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {deletingAccount ? "Menghapus Akun..." : "Ya, Hapus Permanen"}
                    </button>
                    <button
                      type="button"
                      disabled={deletingAccount}
                      onClick={() => setConfirmDeleteAccount(false)}
                      className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
    </ModalShell>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
}
