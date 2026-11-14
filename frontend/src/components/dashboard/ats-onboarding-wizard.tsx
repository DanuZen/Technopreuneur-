"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, Loader2, GraduationCap, Briefcase, Award, FileSpreadsheet, User, MapPin } from "lucide-react";
import { QuestionnaireData, CVAnalysisResult } from "@/types";
import { api } from "@/lib/api";

interface AtsOnboardingWizardProps {
  onComplete: (result: CVAnalysisResult) => void;
}

export function AtsOnboardingWizard({ onComplete }: AtsOnboardingWizardProps) {
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
      if (!formData.fullName.trim() || !formData.email.trim()) {
        setError("Nama lengkap dan alamat email wajib diisi untuk kontak standar ATS.");
        return;
      }
    } else if (step === 2) {
      if (!formData.institution.trim()) {
        setError("Nama institusi pendidikan wajib diisi.");
        return;
      }
    } else if (step === 3) {
      if (!formData.targetRole.trim()) {
        setError("Tentukan target posisi pekerjaan yang Anda minati.");
        return;
      }
    } else if (step === 4) {
      if (!formData.technicalSkills.trim()) {
        setError("Masukkan keahlian teknis atau tools yang Anda kuasai.");
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
      onComplete(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Gagal membuat CV dari kuesioner. Periksa kembali koneksi Anda.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#edf2f9]/80 rounded-[28px] p-6 sm:p-9 clay-well space-y-7 animate-fade-in-up max-w-3xl mx-auto shadow-md">
      {/* Header & ATS Standards Indicator */}
      <div className="space-y-4 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-primary font-bold bg-blue-100/90 px-3 py-1 rounded-full shadow-2xs">
              Onboarding Mandiri Standar ATS
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-primary mt-2">
              Lengkapi Data Profil CV Anda
            </h2>
          </div>
          <span className="text-xs text-primary font-bold bg-white px-3 py-1 rounded-full shadow-xs">
            Langkah {step} dari 5
          </span>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-blue-100/80 h-2.5 rounded-full overflow-hidden shadow-inner">
          <div
            className="bg-[#ce2731] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: IDENTITAS & KONTAK */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-in-up">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base">
            <User className="w-5 h-5 text-slate-700" aria-hidden="true" />
            <h3>Identitas &amp; Kontak Resmi (ATS Header)</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Format ATS mensyaratkan kontak yang jelas di bagian paling atas resume tanpa tabel tersembunyi.
          </p>

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
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Alamat Email Aktif *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Nomor Telepon / WhatsApp
              </label>
              <input
                type="tel"
                value={formData.phone || ""}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+62 812-3456-7890"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tautan LinkedIn atau Portofolio (Opsional)
              </label>
              <input
                type="url"
                value={formData.portfolioLink || ""}
                onChange={(e) => updateField("portfolioLink", e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PENDIDIKAN TERAKHIR */}
      {step === 2 && (
        <div className="space-y-5 animate-fade-in-up">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base">
            <GraduationCap className="w-5 h-5 text-slate-700" aria-hidden="true" />
            <h3>Riwayat Pendidikan Formal</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Sistem ATS membaca jenjang, nama institusi resmi, program studi, dan tahun kelulusan.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Jenjang Pendidikan *
              </label>
              <select
                value={formData.educationLevel}
                onChange={(e) => updateField("educationLevel", e.target.value as QuestionnaireData["educationLevel"])}
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="SMK">SMK / SMA</option>
                <option value="D3">Diploma (D3)</option>
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
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
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
                placeholder="Contoh: Teknik Informatika / Sistem Informasi"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Tahun Kelulusan (atau Perkiraan)
              </label>
              <input
                type="number"
                value={formData.graduationYear}
                onChange={(e) => updateField("graduationYear", e.target.value)}
                placeholder="2026"
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: TARGET POSISI KERJA */}
      {step === 3 && (
        <div className="space-y-5 animate-fade-in-up">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base">
            <Briefcase className="w-5 h-5 text-slate-700" aria-hidden="true" />
            <h3>Target Posisi &amp; Fokus Bidang Karir</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Menentukan headline profesional pada resume ATS dan memandu mesin matching mencari lowongan yang sejalan.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Posisi Kerja yang Dituju *
            </label>
            <input
              type="text"
              value={formData.targetRole}
              onChange={(e) => updateField("targetRole", e.target.value)}
              placeholder="Contoh: Junior Frontend Developer / UI Engineer"
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-[11px] text-slate-400 mt-1.5">
              Gunakan nama peran standar industri untuk meningkatkan skor kecocokan kata kunci.
            </p>
          </div>
        </div>
      )}

      {/* STEP 4: KEAHLIAN TEKNIS & TOOLS */}
      {step === 4 && (
        <div className="space-y-5 animate-fade-in-up">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base">
            <Award className="w-5 h-5 text-slate-700" aria-hidden="true" />
            <h3>Keahlian Teknis &amp; Alat Kerja (Skills Section)</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Bagian terpenting dalam penyaringan ATS. Cantumkan kata kunci teknologi, framework, dan tools yang Anda kuasai.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Keahlian Teknis / Bahasa Pemrograman / Software *
            </label>
            <textarea
              rows={3}
              value={formData.technicalSkills}
              onChange={(e) => updateField("technicalSkills", e.target.value)}
              placeholder="Contoh: React, Next.js, TypeScript, Tailwind CSS, Git, REST API, Figma"
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Pisahkan setiap keahlian dengan tanda koma.
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
              placeholder="Contoh: Problem Solving, Komunikasi Tim, Berpikir Analitis"
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}

      {/* STEP 5: PENGALAMAN & PROYEK */}
      {step === 5 && (
        <div className="space-y-5 animate-fade-in-up">
          <div className="flex items-center gap-2.5 text-slate-900 font-semibold text-base">
            <FileSpreadsheet className="w-5 h-5 text-slate-700" aria-hidden="true" />
            <h3>Pengalaman Nyata: Proyek Kuliah, Magang atau Organisasi</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ceritakan proyek terbaik yang pernah Anda kerjakan. AI kami akan memformatnya menjadi poin-poin *action verbs* terukur standar ATS.
          </p>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Deskripsi Pengalaman / Proyek
            </label>
            <textarea
              rows={4}
              value={formData.experienceSummary}
              onChange={(e) => updateField("experienceSummary", e.target.value)}
              placeholder="Contoh: Memimpin tim 4 orang dalam merancang aplikasi antrean web tugas akhir kampus dengan Next.js. Mengoptimasi query database sehingga respon halaman meningkat 40%."
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl shadow-xs border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="p-4 bg-white/90 rounded-2xl shadow-xs text-xs text-slate-700 space-y-1.5">
            <p className="font-bold text-slate-900">Format Resume ATS Siap Dibuat:</p>
            <p className="text-slate-600 leading-relaxed">
              Setelah tombol ditekan, profil Anda akan langsung dikonversi menjadi dokumen CV digital 1-kolom berstandar ATS dan dashboard karir Anda akan terbuka otomatis.
            </p>
          </div>
        </div>
      )}

      {/* Wizard Footer Controls */}
      <div className="flex items-center justify-between pt-6">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className="px-5 py-2.5 text-xs font-semibold text-slate-700 hover:text-primary bg-white hover:bg-slate-50 rounded-full shadow-xs transition min-h-[40px]"
          >
            Kembali
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-7 py-2.5 bg-primary hover:bg-[#163861] text-white text-xs font-bold rounded-full shadow-md shadow-primary/25 transition min-h-[40px]"
          >
            Lanjut
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="px-7 py-3 bg-secondary hover:bg-secondary-700 text-white text-xs font-bold rounded-full shadow-lg shadow-secondary/30 transition flex items-center gap-2 min-h-[44px] disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                <span>Menyusun CV Standar ATS...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" aria-hidden="true" />
                <span>Buat CV Standar ATS &amp; Masuk Dashboard</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
