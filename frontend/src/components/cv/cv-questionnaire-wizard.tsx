"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Loader2, GraduationCap, Briefcase, Award, FileSpreadsheet } from "lucide-react";
import { QuestionnaireData, CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";

interface CVQuestionnaireWizardProps {
  onComplete?: (result: CVAnalysisResult) => void;
}

export function CVQuestionnaireWizard({ onComplete }: CVQuestionnaireWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<QuestionnaireData>({
    fullName: "",
    email: "",
    phone: "",
    educationLevel: "S1",
    institution: "",
    major: "",
    graduationYear: new Date().getFullYear().toString(),
    targetRole: "",
    technicalSkills: "",
    softSkills: "",
    experienceSummary: "",
    portfolioLink: "",
  });

  const updateField = (field: keyof QuestionnaireData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.institution.trim()) {
        setError("Mohon lengkapi nama lengkap, email, dan nama institusi pendidikan Anda.");
        return;
      }
    } else if (step === 2) {
      if (!formData.targetRole.trim()) {
        setError("Mohon tentukan peran atau posisi kerja yang Anda minati.");
        return;
      }
    } else if (step === 3) {
      if (!formData.technicalSkills.trim()) {
        setError("Mohon masukkan minimal beberapa keahlian teknis atau software yang Anda kuasai.");
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.submitQuestionnaire(formData);
      if (onComplete) {
        onComplete(result);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal membuat CV dari kuesioner. Periksa kembali jaringan Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Wizard Header & Stepper Indicator */}
      <div className="space-y-3 border-b border-slate-100 pb-5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-blue-600 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI Resume Builder · Langkah {step} dari 4
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Estimasi waktu: ~3 menit
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Pendidikan & Identitas Dasar */}
      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base">
            <GraduationCap className="w-5 h-5 text-blue-600" />
            <h3>Identitas &amp; Latar Belakang Pendidikan</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nama Lengkap *
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Contoh: Wira Fikri Ramadanu"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Alamat Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Jenjang *
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => updateField("educationLevel", e.target.value as QuestionnaireData["educationLevel"])}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="SMK">SMK / SMA</option>
                <option value="D3">Diploma 3 (D3)</option>
                <option value="S1">Sarjana (S1 / D4)</option>
                <option value="S2">Magister (S2)</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nama Kampus / Sekolah *
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => updateField("institution", e.target.value)}
                placeholder="Contoh: Universitas Negeri Padang"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Jurusan / Program Studi
              </label>
              <input
                type="text"
                value={formData.major}
                onChange={(e) => updateField("major", e.target.value)}
                placeholder="Contoh: Teknik Informatika"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tahun Kelulusan (atau Estimasi)
              </label>
              <input
                type="number"
                value={formData.graduationYear}
                onChange={(e) => updateField("graduationYear", e.target.value)}
                placeholder="2026"
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Minat Karir & Peran Target */}
      {step === 2 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h3>Minat Karir &amp; Posisi yang Dituju</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Posisi / Peran Kerja yang Anda Inginkan *
            </label>
            <input
              type="text"
              value={formData.targetRole}
              onChange={(e) => updateField("targetRole", e.target.value)}
              placeholder="Contoh: Frontend Developer / Junior UI Engineer"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              AI akan menyesuaikan ringkasan profil dan rekomendasi loker berdasarkan posisi ini.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Tautan Portofolio / GitHub / LinkedIn (Opsional)
            </label>
            <input
              type="url"
              value={formData.portfolioLink}
              onChange={(e) => updateField("portfolioLink", e.target.value)}
              placeholder="https://github.com/username atau linkedin.com/in/..."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* STEP 3: Keahlian & Keterampilan */}
      {step === 3 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base">
            <Award className="w-5 h-5 text-blue-600" />
            <h3>Keahlian &amp; Penguasaan Alat</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Keahlian Teknis &amp; Software / Tools yang Dikuasai *
            </label>
            <textarea
              rows={3}
              value={formData.technicalSkills}
              onChange={(e) => updateField("technicalSkills", e.target.value)}
              placeholder="Contoh: React, Next.js, Tailwind CSS, TypeScript, Git, Figma, REST API"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Pisahkan dengan tanda koma. Masukkan bahasa pemrograman, framework, atau tools desain yang pernah dipelajari.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Keterampilan Non-Teknis (Soft Skills)
            </label>
            <input
              type="text"
              value={formData.softSkills}
              onChange={(e) => updateField("softSkills", e.target.value)}
              placeholder="Contoh: Problem Solving, Komunikasi Tim, Manajemen Waktu, Ketelitian"
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      )}

      {/* STEP 4: Pengalaman Proyek & Konfirmasi */}
      {step === 4 && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            <h3>Pengalaman Organisasi, Proyek Kuliah atau Magang</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Ceritakan Pengalaman / Proyek Terbaik Anda
            </label>
            <textarea
              rows={4}
              value={formData.experienceSummary}
              onChange={(e) => updateField("experienceSummary", e.target.value)}
              placeholder="Contoh: Pernah memimpin divisi publikasi himpunan mahasiswa selama 1 periode. Mengerjakan proyek akhir pembuatan aplikasi sistem antrean web menggunakan Next.js."
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Tulis secara bebas. AI kami akan memformatnya menjadi narasi profesional dengan pencapaian terukur.
            </p>
          </div>

          {/* Review Box */}
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2 text-xs text-blue-900">
            <span className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Siap Disusun oleh CareerMatch AI Engine
            </span>
            <p className="text-blue-800 leading-relaxed">
              Setelah tombol ditekan, AI akan menyusun berkas CV digital lengkap dengan ringkasan profesional, 5 dimensi nilai, serta mencarikan lowongan yang sesuai dengan keahlian Anda.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </button>
        ) : (
          <div />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition"
          >
            Lanjut
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-sm flex items-center gap-2 transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                AI Sedang Menyusun CV...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Buatkan CV Saya &amp; Cari Loker
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
